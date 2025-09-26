import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from config import Config
from models import db

migrate = Migrate()

def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='')
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    
    # Serve React app
    @app.route('/')
    def serve():
        return app.send_static_file('index.html')
    
    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')
    
    api = Api(app)
    
    from resources.books import BookResource, BookListResource
    from resources.reviews import ReviewResource, ReviewListResource
    from resources.reading_list import ReadingListResource, ReadingListItemResource
    from resources.users import UserResource, UserListResource, LoginResource
    
    api.add_resource(BookListResource, '/api/books')
    api.add_resource(BookResource, '/api/books/<int:id>')
    api.add_resource(ReviewListResource, '/api/books/<int:book_id>/reviews')
    api.add_resource(ReviewResource, '/api/reviews/<int:id>')
    api.add_resource(ReadingListResource, '/api/reading-list')
    api.add_resource(ReadingListItemResource, '/api/reading-list/<int:id>')
    api.add_resource(UserListResource, '/api/users')
    api.add_resource(UserResource, '/api/users/<int:id>')
    api.add_resource(LoginResource, '/api/login')
    
    return app

# Create app instance for gunicorn
app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)