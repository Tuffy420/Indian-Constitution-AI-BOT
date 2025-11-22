from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from rag import get_rag_chain
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Indian Constitution AI Bot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.get("/")
async def root():
    return {"message": "Indian Constitution AI Bot API is running"}

@app.post("/chat")
async def chat(request: QueryRequest):
    try:
        chain = get_rag_chain()
        response = chain.invoke(request.query)
        return {"answer": response}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
