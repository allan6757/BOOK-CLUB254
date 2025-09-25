#!/usr/bin/env python3
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import Book, User, Review, db

def init_database():
    app = create_app()
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Create sample user
        if not User.query.first():
            user = User(username='demo', email='demo@example.com')
            user.set_password('password123')  # Default password for demo user
            db.session.add(user)
            db.session.commit()
        
        # Create sample books with images
        if not Book.query.first():
            books = [
                Book(title='The Seven Husbands of Evelyn Hugo', author='Taylor Jenkins Reid', genre='Fiction', 
                     description='A reclusive Hollywood icon finally tells her story to a young journalist.',
                     image_url='https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1618329605i/32620332.jpg'),
                Book(title='Where the Crawdads Sing', author='Delia Owens', genre='Fiction',
                     description='A mystery about a young woman who raised herself in the marshes of North Carolina.',
                     image_url='https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1582135294i/36809135.jpg'),
                Book(title='The Midnight Library', author='Matt Haig', genre='Fiction',
                     description='Between life and death is a library, and within that library, the shelves go on forever.',
                     image_url='https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg'),
                Book(title='Project Hail Mary', author='Andy Weir', genre='Science Fiction',
                     description='A lone astronaut must save humanity from extinction.',
                     image_url='https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg'),
                Book(title='Dune', author='Frank Herbert', genre='Science Fiction',
                     description='Epic tale of politics, religion, and power on the desert planet Arrakis.',
                     image_url='https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg'),
                Book(title='Harry Potter and the Sorcerer\'s Stone', author='J.K. Rowling', genre='Fantasy',
                     description='A young wizard discovers his magical heritage and attends Hogwarts.',
                     image_url='https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg'),
                Book(title='Pride and Prejudice', author='Jane Austen', genre='Romance',
                     description='The classic tale of Elizabeth Bennet and Mr. Darcy.',
                     image_url='https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg'),
                Book(title='Gone Girl', author='Gillian Flynn', genre='Thriller',
                     description='A husband becomes the prime suspect when his wife disappears.',
                     image_url='https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1554086139i/19288043.jpg'),
                Book(title='The Thursday Murder Club', author='Richard Osman', genre='Mystery',
                     description='Four retirees meet weekly to investigate cold cases.',
                     image_url='https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/46000520.jpg'),
                Book(title='Atomic Habits', author='James Clear', genre='Self-Help',
                     description='An easy and proven way to build good habits and break bad ones.',
                     image_url='https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535115320i/40121378.jpg')
            ]
            
            for book in books:
                db.session.add(book)
            db.session.commit()
            
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_database()