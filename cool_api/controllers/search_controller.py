
from flask import Blueprint
from .search_service import add_book, ask_book

searchData = Blueprint('searchData', __name__)

@searchData.route('/add-book', methods=['POST'])
def add_book_route():
    return add_book()

@searchData.route('/ask-book', methods=['GET'])
def search_book_route():
    return ask_book()
