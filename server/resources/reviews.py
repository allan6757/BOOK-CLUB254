from flask_restful import Resource, request
from models import db, Review, Book

class ReviewListResource(Resource):
    def get(self, book_id):
        reviews = Review.query.filter_by(book_id=book_id).all()
        return [review.to_dict() for review in reviews]
    
    def post(self, book_id):
        book = Book.query.get_or_404(book_id)
        data = request.get_json()
        
        if not data or 'rating' not in data or 'comment' not in data:
            return {'error': 'Rating and comment are required'}, 400
            
        try:
            rating = int(data['rating'])
            if rating < 1 or rating > 5:
                return {'error': 'Rating must be between 1 and 5'}, 400
                
            review = Review(
                book_id=book_id,
                rating=rating,
                comment=data['comment']
            )
            db.session.add(review)
            db.session.commit()
            return review.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to create review'}, 500

class ReviewResource(Resource):
    def get(self, id):
        review = Review.query.get_or_404(id)
        return review.to_dict()
    
    def put(self, id):
        review = Review.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
            
        try:
            if 'rating' in data:
                rating = int(data['rating'])
                if rating < 1 or rating > 5:
                    return {'error': 'Rating must be between 1 and 5'}, 400
                review.rating = rating
                
            if 'comment' in data:
                review.comment = data['comment']
            
            db.session.commit()
            return review.to_dict()
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update review'}, 500
    
    def patch(self, id):
        review = Review.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
            
        try:
            if 'rating' in data:
                rating = int(data['rating'])
                if rating < 1 or rating > 5:
                    return {'error': 'Rating must be between 1 and 5'}, 400
                review.rating = rating
                
            if 'comment' in data:
                review.comment = data['comment']
            
            db.session.commit()
            return review.to_dict()
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update review'}, 500
    
    def delete(self, id):
        review = Review.query.get_or_404(id)
        try:
            db.session.delete(review)
            db.session.commit()
            return '', 204
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to delete review'}, 500