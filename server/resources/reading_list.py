from flask_restful import Resource, request
from models import db, ReadingListItem, Book

class ReadingListResource(Resource):
    def get(self):
        items = ReadingListItem.query.all()
        return [item.to_dict() for item in items]
    
    def post(self):
        data = request.get_json()
        
        if not data or 'book_id' not in data:
            return {'error': 'book_id is required'}, 400
            
        try:
            book = Book.query.get_or_404(data['book_id'])
            
            existing_item = ReadingListItem.query.filter_by(book_id=data['book_id']).first()
            if existing_item:
                return {'message': 'Book already in reading list'}, 400
            
            item = ReadingListItem(
                book_id=data['book_id'],
                user_id=1,  # Default user for now
                status=data.get('status', 'want_to_read')
            )
            db.session.add(item)
            db.session.commit()
            return item.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to add book to reading list'}, 500

class ReadingListItemResource(Resource):
    def get(self, id):
        item = ReadingListItem.query.get_or_404(id)
        return item.to_dict()
    
    def put(self, id):
        item = ReadingListItem.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
            
        try:
            item.status = data.get('status', item.status)
            db.session.commit()
            return item.to_dict()
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update reading list item'}, 500
    
    def patch(self, id):
        item = ReadingListItem.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
            
        try:
            if 'status' in data:
                item.status = data['status']
            
            db.session.commit()
            return item.to_dict()
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update reading list item'}, 500
    
    def delete(self, id):
        item = ReadingListItem.query.get_or_404(id)
        try:
            db.session.delete(item)
            db.session.commit()
            return '', 204
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to delete reading list item'}, 500