from flask_restful import Resource, request
from models import db, Book

class BookListResource(Resource):
    def get(self):
        books = Book.query.all()
        return [book.to_dict() for book in books]
    
    def post(self):
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
            
        required_fields = ['title', 'author', 'genre', 'description']
        for field in required_fields:
            if field not in data:
                return {'error': f'{field} is required'}, 400
        
        try:
            book = Book(
                title=data['title'],
                author=data['author'],
                genre=data['genre'],
                description=data['description'],
                image_url=data.get('image_url')
            )
            db.session.add(book)
            db.session.commit()
            return book.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to create book'}, 500

class BookResource(Resource):
    def get(self, id):
        book = Book.query.get_or_404(id)
        return book.to_dict()
    
    def put(self, id):
        book = Book.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
            
        try:
            book.title = data.get('title', book.title)
            book.author = data.get('author', book.author)
            book.genre = data.get('genre', book.genre)
            book.description = data.get('description', book.description)
            book.image_url = data.get('image_url', book.image_url)
            
            db.session.commit()
            return book.to_dict()
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update book'}, 500
    
    def patch(self, id):
        book = Book.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
            
        try:
            if 'title' in data:
                book.title = data['title']
            if 'author' in data:
                book.author = data['author']
            if 'genre' in data:
                book.genre = data['genre']
            if 'description' in data:
                book.description = data['description']
            if 'image_url' in data:
                book.image_url = data['image_url']
            
            db.session.commit()
            return book.to_dict()
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update book'}, 500
    
    def delete(self, id):
        book = Book.query.get_or_404(id)
        try:
            db.session.delete(book)
            db.session.commit()
            return '', 204
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to delete book'}, 500