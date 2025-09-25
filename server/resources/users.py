from flask_restful import Resource, request
from models import db, User

class UserListResource(Resource):
    def get(self):
        users = User.query.all()
        return [user.to_dict() for user in users]
    
    def post(self):
        data = request.get_json()
        
        if not data or 'username' not in data or 'email' not in data or 'password' not in data:
            return {'error': 'Username, email and password are required'}, 400
            
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return {'error': 'User with this email already exists'}, 400
            
        try:
            user = User(
                username=data['username'],
                email=data['email']
            )
            user.set_password(data['password'])
            db.session.add(user)
            db.session.commit()
            return user.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to create user'}, 500

class UserResource(Resource):
    def get(self, id):
        user = User.query.get_or_404(id)
        return user.to_dict()
    
    def put(self, id):
        user = User.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
            
        try:
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            
            db.session.commit()
            return user.to_dict()
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update user'}, 500
    
    def patch(self, id):
        user = User.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
            
        try:
            if 'username' in data:
                user.username = data['username']
            if 'email' in data:
                user.email = data['email']
            
            db.session.commit()
            return user.to_dict()
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update user'}, 500
    
    def delete(self, id):
        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return '', 204

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return {'error': 'Email and password are required'}, 400
            
        user = User.query.filter_by(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            return {'error': 'Invalid email or password'}, 401
        
        return {'user': user.to_dict(), 'message': 'Login successful'}, 200