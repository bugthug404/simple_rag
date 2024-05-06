# PDF Rag App - Ollama, Qdrant & Langchain

Working demo - [Watch video](https://youtu.be/hb-dm6MIW6M)

clone this repository to work in local

**Requirements to run this on local machine**

- [Python](https://www.python.org/downloads/) - for backend
- [Ollama](https://ollama.com/) - to use LLM on Local
- [Docker](https://www.docker.com/products/docker-desktop/) - to run Qdrant storage
- [Nodejs](https://nodejs.org/en/download) - for frontend & backend
- [Qdrant Docker Image](https://qdrant.tech/documentation/quick-start/)

Run this command to run docker image

```
docker run -p 6333:6333 -p 6334:6334 \
    -v $(pwd)/qdrant_storage:/qdrant/storage:z \
    qdrant/qdrant
```

**Backend Setup**

pull llm from ollama

    ollama pull gemma:2b
    ollama pull nomic-embed-text

run ollama

    ollama serve

**PYTHON BACKEND**

>**Note:-** website module is in development

Install dependencies

    pip install pypdf qdrant_client sentence_transformers langchain_community langchain

run backend

    python cool_api

**NODEJS BACKEND**

Install dependencies

    pnpm install

run backend

    pnpm dev



backend should be running on http://localhost:3009.
open http://localhost:3009 in browser & you should get this result

    {
      "data": "server says : get request on time : 11:39:49"
    }

now your backend is ready!

**_Package version used in python_**

1. PyPDF2 - v3.0.1
2. qdrant-client - v1.7.3
3. sentence_transformers - v2.2.2
4. langchain_community - v0.0.21
5. langchain - v0.1.8
   > If there is braking changes in newer version make sure to match the version

**Frontend Setup**

install dependencies & run the app

>website module not ready for frontend

    cd frontend
    pnpm install
    pnpm dev

Give it star ⭐️

Thank you
