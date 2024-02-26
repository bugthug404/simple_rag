from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

# Controllers
# from controllers import qdrant_controller, search_controller
from controllers import search_controller
from testing import llm_controller

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/", methods=['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'])
def home():
    return jsonify(data=f'server says : get request on time : {datetime.now().strftime("%H:%M:%S")}'), 200

app.register_blueprint(search_controller.searchData, url_prefix='/rag')
app.register_blueprint(llm_controller.llmRoutes, url_prefix='/testing')


if __name__ == "__main__":
    port = int(os.getenv("PORT", 3009))
    app.run(port=port, debug=True)