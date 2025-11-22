import json
import os
import shutil
import time
import requests
from typing import List, Dict, Any
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

DATA_PATH = "../data/constitution.json"
DB_PATH = "chroma_db"
URL = "https://raw.githubusercontent.com/Yash-Handa/The_Constitution_Of_India/master/COI.json"

def download_data():
    print(f"Downloading latest Constitution data from {URL}...")
    try:
        response = requests.get(URL)
        response.raise_for_status()
        # Ensure the directory exists
        os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
        with open(DATA_PATH, "wb") as f:
            f.write(response.content)
        print("Download complete.")
    except Exception as e:
        print(f"Failed to download data: {e}")
        print("Using existing local data if available.")

def load_data() -> List[Dict[str, Any]]:
    download_data()
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Data file not found at {DATA_PATH}")
    with open(DATA_PATH, "r") as f:
        data = json.load(f)
    
    # Flatten the list of lists if necessary
    if isinstance(data, list) and len(data) > 0 and isinstance(data[0], list):
        flat_data = []
        for sublist in data:
            flat_data.extend(sublist)
        return flat_data
    return data

def process_article(article: Dict[str, Any]) -> str:
    content = f"Article {article.get('ArtNo', '')}: {article.get('Name', '')}\n"
    if article.get('ArtDesc'):
        content += f"{article['ArtDesc']}\n"
    
    if 'Clauses' in article:
        for clause in article['Clauses']:
            content += f"Clause {clause.get('ClauseNo', '')}: {clause.get('ClauseDesc', '')}\n"
            if 'SubClauses' in clause:
                for sub in clause['SubClauses']:
                    content += f"  ({sub.get('SubClauseNo', '')}) {sub.get('SubClauseDesc', '')}\n"
    
    return content

def ingest():
    # Clean up old DB to avoid conflicts between embedding models
    if os.path.exists(DB_PATH):
        print("Removing old vector database...")
        shutil.rmtree(DB_PATH)

    print("Loading data...")
    articles = load_data()
    documents = []
    
    print(f"Processing {len(articles)} articles...")
    for art in articles:
        if art.get('Status') == 'Omitted':
            continue
            
        content = process_article(art)
        metadata = {
            "article_no": art.get('ArtNo', ''),
            "title": art.get('Name', ''),
            "source": "Constitution of India"
        }
        documents.append(Document(page_content=content, metadata=metadata))
    
    print("Initializing local embeddings (HuggingFace)...")
    # Using a small, fast, local model
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    print("Creating vector store...")
    # No rate limits for local embeddings!
    Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=DB_PATH
    )
    print("Ingestion complete!")

if __name__ == "__main__":
    ingest()
