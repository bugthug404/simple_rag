from flask import request, jsonify
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from langchain_community.llms import Ollama
from langchain.vectorstores import Qdrant
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from langchain.callbacks import get_openai_callback
from langchain.chains.question_answering import load_qa_chain
from langchain.docstore.document import Document
from langchain import VectorDBQA
from io import BytesIO
from PyPDF2 import PdfReader
import tempfile
import base64

encoder = SentenceTransformer("all-MiniLM-L6-v2")

def add_book():
    try:
        # get pdf data from body
        print("add book request recieved")
        row = request.json
        row_pdf = row['data']
        pdf_data_encoded = row_pdf.split(",")[1]
        pdf_data = base64.b64decode(pdf_data_encoded)
  
        # Create a temporary file with the binary data
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
            tmp_file.write(pdf_data)
            tmp_file_path = tmp_file.name
      
        loader = PyPDFLoader(tmp_file_path)
        # reader = PdfReader(pdf_data)
        documents = loader.load()
        
        print("documents === ",documents)
        
        client = QdrantClient("localhost", port=6333);

       # Split the documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=10)
        texts = text_splitter.split_documents(documents)
        
        print("texts  === ",texts)
        return "everything's ok here", 200


        embeddings = HuggingFaceBgeEmbeddings(
            model_name="sentence-transformers/all-mpnet-base-v2",
        )

        doc_store = Qdrant.from_documents(
            texts, embeddings, url="http://localhost:6333", collection_name="rag_api"
        )

        return jsonify({"status":"data uploaded successfully"}), 200
    except Exception as error:
        return jsonify(error=str(error)), 500
      

def ask_book():
    try:
        
        query = request.args.get('query') 
        model = request.args.get('model',"gemma:2b") 
        
        if not query:
             return jsonify("Please provide a query parameter"), 400
        
        embeddings = HuggingFaceBgeEmbeddings(
            model_name="sentence-transformers/all-mpnet-base-v2",
        )

        client = QdrantClient("localhost", port=6333)
        collection_name = "rag_api"
        doc_store = Qdrant(client, collection_name, embeddings)

        # Load the question answering chain
        llm = Ollama(model=model)
        qa = VectorDBQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            vectorstore=doc_store,
            return_source_documents=False,
        )

        response = qa.run(query)

        return jsonify(response), 200
    except Exception as error:
        error_text = str(error)
        if "Not found: Collection" in error_text:
            return jsonify(error="Collection not found!"), 400
        return jsonify(error=str(data)), 500
    

