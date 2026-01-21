from flask import Flask, request, jsonify
from src.helper import download_hugging_face_embeddings
from langchain_pinecone import PineconeVectorStore
from langchain_openai import ChatOpenAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from src.prompt import *
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Allow the React UI to talk to this Backend

load_dotenv() 

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")  

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

# Initialize Embeddings and Vector Store
embeddings = download_hugging_face_embeddings()
index_name = "medical-chatbot"

docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings,
)

retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})

# Initialize LLM
chatModel = ChatOpenAI(model="gpt-4o")
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}"),
    ]
)

question_answer_chain = create_stuff_documents_chain(chatModel, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# --- ROUTES ---

@app.route('/')
def index():
    # We no longer serve 'chat.html' here.
    return "<h1>Medical Chatbot Backend is Running...</h1><p>Please use the React Interface (localhost:5173) to chat.</p>"

@app.route("/get", methods=["POST"])
def chat():
    msg = request.form["msg"]
    input = msg
    print(f"User Question: {input}")
    
    response = rag_chain.invoke({"input": msg})
    print(f"AI Response: {response['answer']}")
    
    # Return just the text answer
    return str(response["answer"])

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)