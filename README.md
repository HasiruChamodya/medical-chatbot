# Medical Chatbot

A medical information chatbot that helps users understand symptoms, conditions, medications, and general health topics through conversational Q&A. This project is intended for **educational and informational purposes only** and is **not a substitute for professional medical advice, diagnosis, or treatment**.

> **Disclaimer (read first):**  
> This chatbot may produce incorrect, incomplete, or outdated information. Do **not** use it for emergencies or to make medical decisions. Always consult a licensed clinician for medical concerns.

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Clone](#clone)
  - [Environment Variables](#environment-variables)
  - [Install Dependencies](#install-dependencies)
  - [Run Locally](#run-locally)
- [Usage](#usage)
  - [Example Prompts](#example-prompts)
  - [Safety Guidance Prompts](#safety-guidance-prompts)
- [Configuration](#configuration)



---

## Features

- **Symptom & condition Q&A** (informational, non-diagnostic)
- **Medication information** (uses, side effects, interactions—informational)
- **Triage-style guidance** (e.g., “when to seek urgent care”) with strong safety disclaimers
- **Conversation memory** (optional) to keep context within a session
- **Retrieval-Augmented Generation (RAG)** support (optional) for grounding answers on curated medical content
- **Source-citing mode** (recommended) to reference trusted documents if RAG is enabled
- **Safety guardrails**
  - emergency redirection (e.g., chest pain, stroke symptoms)
  - refusal for diagnosis and prescription requests
  - privacy warnings for sensitive data

---

## Demo

If you have a hosted demo, add it here:

- Live app: `https://<your-deployment-url>`
- Video walkthrough: `https://<your-video-url>`

---

## How It Works

At a high level, the chatbot:

1. Accepts a user query (symptoms, medical topics, medication questions, etc.).
2. Applies **safety rules** (e.g., emergency triggers, self-harm, diagnosis/prescription restrictions).
3. Optionally retrieves relevant context from a **knowledge base** (RAG).
4. Sends the user query + system instructions + retrieved context to the language model.
5. Returns a structured, user-friendly response including:
   - plain-language explanation
   - “what to do next” guidance
   - red flags / emergency criteria
   - (optional) sources and confidence notes

---

## Tech Stack

Fill in to match your repository (edit as needed):

- **Language:** Python / JavaScript / TypeScript (depending on your implementation)
- **LLM Provider:** OpenAI / Azure OpenAI / Hugging Face / Local model
- **UI:** CLI / Web (React, Streamlit, Flask, FastAPI, Next.js, etc.)
- **Vector DB (optional):** FAISS / Chroma / Pinecone / Weaviate
- **Embeddings (optional):** OpenAI / SentenceTransformers
- **Deployment:** Docker / Render / Vercel / Hugging Face Spaces / AWS / Azure

---

## Project Structure

> Update these paths to match the actual repository layout.

```text
medical-chatbot/
├─ app/                  # application code (API/UI)
├─ data/                 # curated documents, FAQs, references (if any)
├─ prompts/              # system prompts / safety prompts
├─ scripts/              # ingestion, indexing, utilities
├─ tests/                # tests
├─ .env.example          # example environment variables
├─ requirements.txt      # python dependencies (or package.json for node)
└─ README.md
```

---

## Setup

### Prerequisites

- Git
- One of the following depending on your repo:
  - **Python 3.10+** (recommended for modern LLM tooling)
  - **Node.js 18+**
- An API key (if using a hosted LLM):
  - `OPENAI_API_KEY` / `AZURE_OPENAI_API_KEY` / etc.

### Clone

```bash
git clone https://github.com/HasiruChamodya/medical-chatbot.git
cd medical-chatbot
```

### Environment Variables

Create a `.env` file (or set environment variables in your shell). Use `.env.example` if included.

Example:

```bash
# LLM provider
OPENAI_API_KEY="your_api_key_here"

# Model settings (examples)
MODEL_NAME="gpt-4o-mini"
TEMPERATURE="0.2"
MAX_TOKENS="800"

# RAG / vector store (optional)
RAG_ENABLED="true"
VECTORSTORE_PATH="./vectorstore"
```

> **Important:** Never commit `.env` files or secrets.

### Install Dependencies

#### If Python

```bash
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows (PowerShell)
# .\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

#### If Node.js

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run Locally

#### If Python (examples)

```bash
python -m app
# or
uvicorn app.main:app --reload
# or (Streamlit)
streamlit run app.py
```

#### If Node.js (examples)

```bash
npm run dev
# or
npm start
```

Open the app at:

- `http://localhost:3000` (common for Next.js/React)
- `http://127.0.0.1:8000` (common for FastAPI)
- Streamlit will print a local URL

---

## Usage

### Example Prompts

Try asking:

- “What are common causes of a sore throat?”
- “What’s the difference between influenza and a common cold?”
- “What are typical side effects of ibuprofen?”
- “I have a headache and mild fever. What could it mean and when should I worry?”
- “What lifestyle changes help with high blood pressure?”

### Safety Guidance Prompts

- “I have chest pain and shortness of breath.”
- “I think I’m having a stroke.”
- “I took too much medication.”

The chatbot should respond with urgent-care guidance (e.g., contacting local emergency services).

---

## Configuration

Common knobs you may want to expose:

- **Model selection:** `MODEL_NAME`
- **Answer style:** concise vs detailed
- **Temperature:** lower for safer, more consistent responses
- **RAG toggle:** enable/disable retrieval
- **Source citations:** on/off
- **Session memory:** on/off
- **Safety filters:** emergency keywords, age-specific rules, pregnancy rules, etc.

---

## Deployment

Options:

### Docker (recommended)

Add a `Dockerfile` and optionally `docker-compose.yml` if your repo supports it:

```bash
docker build -t medical-chatbot .
docker run -p 8080:8080 --env-file .env medical-chatbot
```

### Platform Deployments

- **Vercel** (Next.js)
- **Render / Fly.io** (API + UI)
- **Hugging Face Spaces** (Gradio/Streamlit)
- **AWS/GCP/Azure** (containers)

Make sure to configure environment variables securely in your deployment platform.

---

## Testing

Examples:

### Python

```bash
pytest -q
```

### Node.js

```bash
npm test
```

Suggested test coverage:

- safety / refusal logic (diagnosis, prescriptions, emergency redirection)
- prompt injection resistance (basic)
- RAG retrieval correctness (if enabled)
- response format validation (if your app enforces structure)

---

## Security & Privacy

- Do **not** enter personally identifiable information (PII) into the chatbot.
- Avoid collecting patient data unless you have:
  - explicit user consent
  - a legal basis
  - a clear retention policy
  - strong security controls
- If you store chat logs, document:
  - what is stored
  - how long it is retained
  - how it is protected
  - how users can request deletion

---

## Limitations

- Not a medical device.
- Not suitable for emergency use.
- Can hallucinate or provide outdated info.
- Cannot verify user identity, age, allergies, medication lists, or history reliably.
- If using RAG, answers are limited by the quality and coverage of the knowledge base.

---

### Contact

Owner: **HasiruChamodya**  
Repository: https://github.com/HasiruChamodya/medical-chatbot
