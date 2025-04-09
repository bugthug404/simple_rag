
from flask import Blueprint
from .llm_service import askllm, query, query1, ask_vector

llmRoutes = Blueprint('llmRoutes', __name__)

@llmRoutes.route('/ask', methods=['GET'])
def askllm_question():
    return askllm()

@llmRoutes.route('/query', methods=['GET'])
def query_llm():
    return query()

@llmRoutes.route('/query1', methods=['GET'])
def query_llm1():
    return query1()

@llmRoutes.route('/ask-vector', methods=['GET'])
def ask_vec():
    return ask_vector()
