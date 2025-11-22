# Indian Constitution AI Bot

This project is an AI-powered chatbot designed to answer questions related to the Indian Constitution. It uses a Retrieval-Augmented Generation (RAG) approach to provide accurate and context-aware responses based on the constitutional text.

## Tech Stack

### Frontend
- **Framework:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Language:** JavaScript/JSX

### Backend
- **Framework:** FastAPI
- **AI/ML:** LangChain, HuggingFace, Sentence Transformers
- **Vector Database:** ChromaDB
- **Language:** Python

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites
- Node.js and npm installed
- Python 3.8+ installed

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   python main.py
   ```
   The backend API will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend application will be available at `http://localhost:5173` (or the port shown in your terminal).
