import { useState } from 'react';
import axios from 'axios';
import './Summary.css'


export default function Summary() {
  // All state declarations must be inside the component function
  const [inputMethod, setInputMethod] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [model, setModel] = useState('Google Generative AI');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSummarize = async () => {
    setLoading(true);
    setError('');
    
    try {
      let response;
      
      if (inputMethod === 'text') {
        if (!text.trim()) {
          throw new Error('Please enter text to summarize');
        }
        
        response = await axios.post('http://localhost:8000/summarize/text', {
          text,
          model
        });
      } else {
        if (!file) {
          throw new Error('Please upload a file');
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', model);
        
        response = await axios.post('http://localhost:8000/summarize/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="container">
        <h1>TextKit - Enhanced Text Summarizer</h1>
        <p>
          Welcome to TextKit! This app allows you to input text manually or upload documents (PDF/DOCX) for summarization.
        </p>
        
        <div className="input-method">
          <h2>Input Method</h2>
          <div>
            <label>
              <input
                type="radio"
                value="text"
                checked={inputMethod === 'text'}
                onChange={() => setInputMethod('text')}
              />
              Text Box
            </label>
            <label>
              <input
                type="radio"
                value="file"
                checked={inputMethod === 'file'}
                onChange={() => setInputMethod('file')}
              />
              Upload Document
            </label>
          </div>
        </div>
        
        {inputMethod === 'text' ? (
          <div className="text-input">
            <h2>Enter Text to Summarize</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
            />
          </div>
        ) : (
          <div className="file-input">
            <h2>Upload Document</h2>
            <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
            {file && <p>Selected file: {file.name}</p>}
          </div>
        )}
        
        <div className="model-select">
          <h2>Summarization Model</h2>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="Google Generative AI">Google Generative AI</option>
            <option value="HuggingFace">HuggingFace</option>
          </select>
        </div>
        
        <button onClick={handleSummarize} disabled={loading}>
          {loading ? 'Processing...' : 'Summarize'}
        </button>
        
        {error && <div className="error">{error}</div>}
        
        {results && (
          <div className="results">
            <div className="result-section">
              <h2>Preprocessed Text</h2>
              <p>{results.preprocessed_text}</p>
            </div>
            
            <div className="result-section">
              <h2>Extracted Keywords</h2>
              <ul>
                {results.keywords.map((kw, index) => (
                  <li key={index}>
                    <strong>{kw.text}</strong> - <em>{kw.label}</em>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="result-section">
              <h2>Original Text</h2>
              <p>{results.original_text}</p>
            </div>
            
            <div className="result-section">
              <h2>Summarized Text</h2>
              <p>{results.summary}</p>
            </div>
          </div>
        )}
        
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Text Summarizer v1.0 | Powered by Google Generative AI and HuggingFace</p>
            <p className="mt-1">© {new Date().getFullYear()} AI Text Processing Solutions. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
}
