# PDF Rag App - Ollama, Qdrant & Langchain

Working demo - [Watch video](https://youtu.be/hb-dm6MIW6M)

clone this repository to work in local

**Backend Setup**

download & install ollama from https://ollama.com

pull llm from ollama

    ollama pull gemma:2b
    ollama pull llama2

run ollama

    ollama serve

Install dependencies

    pip install pypdf qdrant_client sentence_transformers langchain_community langchain

run backend

    python cool_api

backend should be running on http://localhost:3009
open http://localhost:3009 in browser & you should get this result

    {
      "data": "server says : get request on time : 11:39:49"
    }

now your backend is ready!

**_Package version used_**

1. PyPDF2 - v3.0.1
2. qdrant-client - v1.7.3
3. sentence_transformers - v2.2.2
4. langchain_community - v0.0.21
5. langchain - v0.1.8
   > If there is braking changes in newer version make sure to match the version

**Frontend Setup**

install dependencies & run the app

    cd frontend
    pnpm install
    pnpm dev

Give it star ⭐️

Thank you
