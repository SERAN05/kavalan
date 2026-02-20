# ─────────────────────────────────────────────────────────────
#  TARUN — AI Health Officer Chatbot Router (LangChain RAG)
# ─────────────────────────────────────────────────────────────

from fastapi import APIRouter
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    OPENAI_API_KEY: str = ""
    class Config:
        env_file = ".env"


settings = Settings()
router = APIRouter()

SYSTEM_PROMPT = """
You are Kavalan AI — an expert public health assistant for the Neervazh Kavalan 
early warning system in Coimbatore district. You help health officers understand 
disease risk predictions, water quality data, and recommended interventions.

Always ground your answers in public health best practices for water-borne diseases 
(cholera, typhoid, dysentery, hepatitis A). Be concise and practical.
"""

llm = ChatOpenAI(model="gpt-4o-mini", api_key=settings.OPENAI_API_KEY)
prompt_template = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", "{question}"),
])
chain = prompt_template | llm | StrOutputParser()


class ChatRequest(BaseModel):
    question: str


@router.post("/")
async def chat(req: ChatRequest):
    answer = await chain.ainvoke({"question": req.question})
    return {"question": req.question, "answer": answer}
