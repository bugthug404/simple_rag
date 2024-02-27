from flask import request, jsonify
from qdrant_client import models, QdrantClient
from sentence_transformers import SentenceTransformer
from langchain_community.llms import Ollama
from llama_index.core import VectorStoreIndex, ServiceContext, download_loader
from llama_index.core.storage.storage_context import StorageContext
# from llama_index.core.vector_stores.qdrant import QdrantVectorStore
from llama_index.vector_stores.qdrant import QdrantVectorStore  # For newer versions
from pathlib import Path
# llm = Ollama(model="llama2")
from langchain.vectorstores import Qdrant
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from transformers import AutoModel, AutoTokenizer
import os
from langchain.callbacks import get_openai_callback
from langchain.chains.question_answering import load_qa_chain

# os.environ["OPENAI_API_KEY"] = "sk-"


def ask_vector():
    try:
        # docs = knowledge_base.similarity_search(user_question)
        search_query = "what is the diameter of the sun"
        encoder = SentenceTransformer('all-MiniLM-L6-v2')
        query_embedding = encoder.encode(search_query)
   
        
        client = QdrantClient("localhost", port=6333);

        docs = client.search(
            collection_name="vector_db",
            query_vector=encoder.encode(search_query).tolist(),
            limit=10,
        )
        payloads = [result.payload for result in docs]
        
        return jsonify(payloads), 200
        
        # llm = OpenAI()
        llm = Ollama(model="llama2")
        # result = llm.invoke("The first man on the moon was ...")
        chain = load_qa_chain(llm, chain_type="stuff")
        input_documents = [encoder.encode(search_query).tolist() for doc in docs]
        with get_openai_callback() as cb:
          response = chain.invoke(input_documents=payloads[0], question=search_query,input={"question": search_query, "input_documents": payloads[0]})
        

        return jsonify(response), 200
    except Exception as error:
        return jsonify(error=str(error)), 500

def query1():
    try:
        loader = PyPDFLoader("/Users/k9966/Documents/My Projects/ask_book/cool_api/llm/world_geo.pdf")
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000,
                                                        chunk_overlap=10)
        texts = text_splitter.split_documents(documents)
        
        # # llm = OpenAI()
        # llm = Ollama(model="llama2")
        # chain = load_qa_chain(llm, chain_type="stuff")
        # with get_openai_callback() as cb:
        #   response = chain.run(input_documents=texts, question=user_question)
        

        # Load the embedding model 
        # model_name = "BAAI/bge-large-en"
        model_name = "sentence-transformers/all-MiniLM-L6-v2"
        model_kwargs = {'device': 'cpu'}
        encode_kwargs = {'normalize_embeddings': False}
        embeddings = HuggingFaceBgeEmbeddings(
            model_name=model_name,
            model_kwargs=model_kwargs,
            encode_kwargs=encode_kwargs,
        )

        url = "http://localhost:6333"
        qdrant = Qdrant.from_documents(
            texts,
            embeddings,
            url=url,
            prefer_grpc=False,
            collection_name="vector_db",
            force_recreate=True,
        )
        
        return jsonify({"success":True}), 200
    except Exception as error:
        return jsonify(error=str(error)), 500
   
   

def query():
    try:
        # Load JSON data
        JSONReader = download_loader("JSONReader")
        loader = JSONReader()
        documents = loader.load_data(Path('/Users/k9966/Documents/My Projects/ask_book/cool_api/controllers/startups_demo.json'))

        # Initialize SentenceTransformer model
        encoder = SentenceTransformer('all-MiniLM-L6-v2')

        # Create Qdrant client and store
        client = QdrantClient("localhost", port=6333)
        vector_store = QdrantVectorStore(client=client, collection_name="my_books")
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        # Initialize Ollama and ServiceContext
        service_context = ServiceContext.from_defaults(llm=llm, embed_model="local")

        # Create VectorStoreIndex and query engine
        index = VectorStoreIndex.from_documents(documents, service_context=service_context, storage_context=storage_context)
        query_engine = index.as_query_engine()

        # Get the query from the request data
        query_text = request.args.get("query", "Hello")

        # Perform a query and return the response
        response = query_engine.query(query_text)
        return jsonify(response), 200
    except Exception as error:
        return jsonify(error=str(error)), 500
   
   
 

def askllm():
    try:
        # get request query
        query = request.args.get("query")
        result = llm.invoke("The first man on the moon was ...");
        return jsonify(data=result), 200
    except Exception as error:
        return jsonify(error=str(error)), 500