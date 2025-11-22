import os
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv

load_dotenv()

DB_PATH = "./chroma_db"

def get_rag_chain():
    if not os.getenv("GROQ_API_KEY"):
        raise ValueError("GROQ_API_KEY not found")

    # Must match the embedding model used in ingest.py
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = Chroma(persist_directory=DB_PATH, embedding_function=embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 30})

    # Using Llama 3 8B via Groq (Fast & Free tier available)
    llm = ChatGroq(
        model_name="llama-3.3-70b-versatile",
        temperature=0
    )

    template = """You are an expert on the Indian Constitution. Answer the question based ONLY on the following context.
    If the context contains a list of articles, try to summarize or list as many as possible.
    If the answer is not in the context, say "I cannot find the answer in the provided context."

    Context:
    {context}

    Question: {question}

    Answer:"""
    
    prompt = ChatPromptTemplate.from_template(template)

    def format_docs(docs):
        return "\n\n".join([d.page_content for d in docs])

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    return rag_chain
