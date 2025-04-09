from langchain_community.llms import Ollama
from llama_index import  ServiceContext, download_loader

llm = Ollama(model="llama2")
result = llm.invoke("The first man on the moon was ...")
print(result)

context = "The first man on the moon was Neil Armstrong. "
question = "Who was the first man on the moon?"
input = context + question

response = llm.invoke(input)
print(response)