from app import create_app
from models import Book, Review, ReadingListItem, User

def seed_data():
    app = create_app()
    with app.app_context():
        from app import db
        # Clear existing data
        try:
            db.drop_all()
        except:
            pass
        db.create_all()
        
        # Create default user
        user = User(username='demo', email='demo@example.com')
        db.session.add(user)
        db.session.commit()
        
        # Create sample books with images
        books = [
            Book(title='To Kill a Mockingbird', author='Harper Lee', genre='Classic Fiction', 
                 description='A gripping tale of racial injustice and childhood innocence in the American South.',
                 image_url='https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop'),
            Book(title='1984', author='George Orwell', genre='Dystopian Fiction',
                 description='A chilling dystopian novel about totalitarian control and surveillance.',
                 image_url='https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop'),
            Book(title='Pride and Prejudice', author='Jane Austen', genre='Romance',
                 description='A witty romantic novel about love, class, and social expectations.',
                 image_url='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'),
            Book(title='The Great Gatsby', author='F. Scott Fitzgerald', genre='Classic Fiction',
                 description='A masterpiece about the Jazz Age and the elusive American Dream.',
                 image_url='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop'),
            Book(title='Harry Potter and the Sorcerer\'s Stone', author='J.K. Rowling', genre='Fantasy',
                 description='A magical adventure of a young wizard discovering his destiny.',
                 image_url='https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop'),
            Book(title='Dune', author='Frank Herbert', genre='Science Fiction',
                 description='Epic space opera about power, politics, and survival on a desert planet.',
                 image_url='https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=400&fit=crop'),
            Book(title='The Hobbit', author='J.R.R. Tolkien', genre='Fantasy',
                 description='An unexpected journey of courage, friendship, and adventure.',
                 image_url='https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop'),
            Book(title='Gone Girl', author='Gillian Flynn', genre='Thriller',
                 description='A psychological thriller that will keep you guessing until the end.',
                 image_url='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'),
            Book(title='The Alchemist', author='Paulo Coelho', genre='Philosophy',
                 description='An inspiring tale about following your dreams and finding your purpose.',
                 image_url='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop'),
            Book(title='Educated', author='Tara Westover', genre='Memoir',
                 description='A powerful memoir about education, family, and self-discovery.',
                 image_url='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop'),
            Book(title='The Silent Patient', author='Alex Michaelides', genre='Mystery',
                 description='A gripping psychological thriller about obsession and silence.',
                 image_url='https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop'),
            Book(title='Where the Crawdads Sing', author='Delia Owens', genre='Literary Fiction',
                 description='A haunting coming-of-age story set in the marshlands of North Carolina.',
                 image_url='https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop')
        ]
        
        for book in books:
            db.session.add(book)
        db.session.commit()
        
        # Create sample reviews (using user_id=1 for demo)
        reviews = [
            Review(book_id=1, user_id=1, rating=5, comment='An absolute masterpiece that everyone should read.'),
            Review(book_id=2, user_id=1, rating=4, comment='Thought-provoking and eerily relevant to today.'),
            Review(book_id=3, user_id=1, rating=4, comment='Witty and charming, a delightful read.'),
            Review(book_id=4, user_id=1, rating=5, comment='A timeless classic about the American Dream.'),
            Review(book_id=5, user_id=1, rating=5, comment='Magical and enchanting for all ages.'),
            Review(book_id=6, user_id=1, rating=4, comment='Epic science fiction at its finest.')
        ]
        
        for review in reviews:
            db.session.add(review)
        db.session.commit()
        
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()