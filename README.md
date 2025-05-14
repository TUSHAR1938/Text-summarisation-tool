
---

# 🧠 Advanced Text Summarizer

An AI-powered application that summarizes text using **Google Generative AI** or **HuggingFace models**, with additional NLP processing via **SpaCy**.

---

## 🚀 Features

- 🔍 Summarization using Google GenAI or HuggingFace (`facebook/bart-large-cnn`)
- 📄 File upload support (PDF, DOCX)
- 🧠 Text preprocessing and keyword extraction with SpaCy
- ⚡ Fast, responsive user interface
- 🖥️ FastAPI backend and React frontend

---

## 🛠️ Technology Stack

- **Frontend**: React.js  
- **Backend**: FastAPI (Python)  
- **AI Models**: 
  - Google Generative AI  
  - HuggingFace Transformers (`facebook/bart-large-cnn`)  
- **NLP Library**: SpaCy  

---

## ⚙️ Setup Instructions

### 📌 Backend Setup

1. **Install Python dependencies**  
   ```bash
   pip install fastapi uvicorn spacy langchain-google-genai transformers python-dotenv PyPDF2 python-docx
   ```

2. **Download SpaCy English model**  
   ```bash
   python -m spacy download en_core_web_sm
   ```

3. **Add environment variable**  
   Create a `.env` file in the backend directory:
   ```
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```

4. **Run FastAPI server**  
   ```bash
   uvicorn main:app --reload
   ```
   Backend runs at: [http://localhost:8000](http://localhost:8000)

---

### 💻 Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd summarizer-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install axios
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   Frontend runs at: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints

### `POST /summarize/text`

Summarize plain text input.

**Parameters:**
- `text`: (string) The text to summarize
- `model`: (`google` or `huggingface`)

---

### `POST /summarize/file`

Summarize content from an uploaded file.

**Parameters:**
- `file`: (PDF or DOCX)
- `model`: (`google` or `huggingface`)

---

## 🔐 Environment Variables

| Variable Name         | Description                           |
|-----------------------|---------------------------------------|
| `GOOGLE_GENAI_API_KEY`| API key for Google Generative AI      |

---

https://ai.google.dev/gemini-api/docs/api-key    Get your API key from
