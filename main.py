from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import spacy
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from transformers import pipeline
from dotenv import load_dotenv
from PyPDF2 import PdfReader
import docx
import os
from pydantic import BaseModel
from typing import Optional
import tempfile

# Load environment variables
load_dotenv()
api_key = os.getenv("GOOGLE_GENAI_API_KEY")

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models
nlp = spacy.load("en_core_web_sm")
google_llm = GoogleGenerativeAI(model="models/gemini-1.5-flash", google_api_key=api_key)
google_prompt = PromptTemplate(
    input_variables=["text"],
    template="Summarize the following text concisely: \n{text}"
)
google_summarization_chain = LLMChain(llm=google_llm, prompt=google_prompt)
huggingface_summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class TextInput(BaseModel):
    text: str
    model: str = "Google Generative AI"

def preprocess_text(input_text: str) -> str:
    doc = nlp(input_text)
    cleaned_text = " ".join([token.text for token in doc if not token.is_stop])
    return cleaned_text

def extract_keywords(input_text: str) -> list:
    doc = nlp(input_text)
    entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
    return entities

def summarize_text(input_text: str, model: str) -> str:
    if model == "Google Generative AI":
        try:
            summary = google_summarization_chain.run(text=input_text)
            return summary
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Google Generative AI error: {e}")
    elif model == "HuggingFace":
        try:
            summary = huggingface_summarizer(input_text, max_length=130, min_length=30, do_sample=False)
            return summary[0]["summary_text"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"HuggingFace error: {e}")

def extract_text_from_file(file: UploadFile) -> str:
    try:
        # Create a temporary file to work with
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            # Read the uploaded file in chunks
            contents = file.file.read()
            temp_file.write(contents)
            temp_file_path = temp_file.name
        
        # Now process the file based on its type
        if file.filename.endswith(".pdf"):
            with open(temp_file_path, 'rb') as f:
                pdf_reader = PdfReader(f)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()
        elif file.filename.endswith(".docx"):
            doc = docx.Document(temp_file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        return text
    except Exception as e:
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/summarize/text")
async def summarize_from_text(input_data: TextInput):
    try:
        cleaned_text = preprocess_text(input_data.text)
        keywords = extract_keywords(input_data.text)
        summary = summarize_text(cleaned_text, input_data.model)
        
        return {
            "original_text": input_data.text,
            "preprocessed_text": cleaned_text,
            "keywords": keywords,
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize/file")
async def summarize_from_file(file: UploadFile = File(...), model: str = "Google Generative AI"):
    try:
        text = extract_text_from_file(file)
        if not text:
            raise HTTPException(status_code=400, detail="Unable to extract text from file")
            
        cleaned_text = preprocess_text(text)
        keywords = extract_keywords(text)
        summary = summarize_text(cleaned_text, model)
        
        return {
            "original_text": text,
            "preprocessed_text": cleaned_text,
            "keywords": keywords,
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Text Summarizer API is running"}