from flask import Flask, request, jsonify
from src.helper import download_hugging_face_embeddings
from langchain_pinecone import PineconeVectorStore
from langchain_openai import ChatOpenAI
from langchain.chains import create_retrieval_chain, create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

load_dotenv() 

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")  

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

embeddings = download_hugging_face_embeddings()
index_name = "medical-chatbot"

docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings,
)

# made the k to 5 to get more context
retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 5})

chatModel = ChatOpenAI(model="gpt-4o")

# --- MEMORY & RETRIEVAL CHAIN ---

# Reformulate Question 
contextualize_q_system_prompt = (
    "Given a chat history and the latest user question "
    "which might reference context in the chat history, "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, "
    "just reformulate it if needed and otherwise return it as is."
)

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

history_aware_retriever = create_history_aware_retriever(
    chatModel, retriever, contextualize_q_prompt
)

# Answer Question 
# instruction to use history for context
qa_system_prompt = (
    "You are a helpful medical assistant. "
    "Use the following pieces of retrieved context to answer the question. "
    "You may use the conversation history to understand the user's intent. "
    "If the answer is not present in the context, strictly say 'I don't know'. "
    "Do not use your own internal knowledge to answer. "
    "Keep the answer concise."
    "\n\n"
    "{context}"
)

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

question_answer_chain = create_stuff_documents_chain(chatModel, qa_prompt)
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

# Global History
chat_history = []

@app.route('/')
def index():
    return "<h1>Medical Chatbot Backend is Running...</h1>"

@app.route("/get", methods=["POST"])
def chat():
    global chat_history
    msg = request.form["msg"]
    
    # DEBUG PRINT
    print(f"Incoming Question: {msg}")
    
    try:
        response = rag_chain.invoke({"input": msg, "chat_history": chat_history})
        answer = response['answer']
        
        # Update History
        chat_history.append(HumanMessage(content=msg))
        chat_history.append(AIMessage(content=answer))
        
        # Keep only last 6 messages
        if len(chat_history) > 6:
            chat_history = chat_history[-6:]
            
        print(f"AI Answer: {answer}")
        return str(answer)
        
    except Exception as e:
        print(f"Error: {e}")
        return "Sorry, I encountered an error processing your request."

# reset route to clear history easily
@app.route("/reset", methods=["POST"])
def reset():
    global chat_history
    chat_history = []
    print("History Cleared!")
    return "History Cleared"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)