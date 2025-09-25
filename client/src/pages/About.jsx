import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BookCreate from './BookCreate';

function About() {
  const [showAddBook, setShowAddBook] = useState(false);

  if (showAddBook) {
    return <BookCreate onBack={() => setShowAddBook(false)} />;
  }

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <img 
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop" 
            alt="BookWarmz Library" 
            className="about-image"
          />
          <h1 className="about-title">About BookWarmz</h1>
        </div>
        
        <div className="about-content">
          <div className="about-description">
            <h2>Welcome to BookWarmz</h2>
            <p>
              BookWarmz is your ultimate digital companion for discovering, sharing, and connecting 
              through the love of books. Our platform brings together book enthusiasts from around 
              the world to create a vibrant community of readers.
            </p>
            
            <h3>What We Offer</h3>
            <ul>
              <li><strong>Personalized Recommendations:</strong> Get book suggestions tailored to your preferences</li>
              <li><strong>Social Reading:</strong> Connect with friends and share book recommendations</li>
              <li><strong>Reading Lists:</strong> Organize your books with custom reading lists</li>
              <li><strong>Reviews & Ratings:</strong> Share your thoughts and discover what others think</li>
              <li><strong>Favorites Collection:</strong> Keep track of your most beloved books</li>
              <li><strong>Book Discovery:</strong> Explore new genres and authors</li>
            </ul>
            
            <h3>Our Mission</h3>
            <p>
              We believe that books have the power to transform lives, spark conversations, and 
              build bridges between people. BookWarmz is designed to make reading more social, 
              discoverable, and enjoyable for everyone.
            </p>
            
            <h3>Join Our Community</h3>
            <p>
              Whether you're a casual reader or a literary enthusiast, BookWarmz welcomes you. 
              Start building your digital library, connect with fellow readers, and discover 
              your next favorite book today.
            </p>
          </div>
          
          <div className="author-section">
            <div className="author-cta">
              <h2>ARE YOU AN AUTHOR?</h2>
              <p>Share your literary work with our community of passionate readers!</p>
              <button 
                onClick={() => setShowAddBook(true)}
                className="btn btn-gradient add-book-btn"
              >
                ◆ ADD YOUR BOOK HERE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;