from langchain.vectorstores import Qdrant
from langchain.embeddings import HuggingFaceEmbeddings
from langchain import OpenAI, VectorDBQA



search_result = client.search(
    collection_name=COLLECTION_NAME,
    query_vector=encoder.encode(query).tolist(),
    limit=3,
)

embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
qdrant_vec_store = Quadrant.from_texts(docs, embedding_model,
host = "localhost",
port = 6333,
collection_name = "my_books"
)

llm = OpenAI(openai_api_key="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")
rag =   VectorDBQA.from_chain_type(
                                    llm=llm,
                                    chain_type="stuff",
                                    vectorstore=qdrant_vec_store,
                                    return_source_documents=False)
rag.run("hello")