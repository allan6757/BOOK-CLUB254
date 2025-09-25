import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBook } from '../api/books';
import { fetchReviews } from '../api/reviews';
import { addToReadingList } from '../api/readingList';
import { addToFavorites, removeFromFavorites, isFavorite } from '../api/favorites';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    const loadBookData = async () => {
      try {
        const [bookData, reviewsData, isFav] = await Promise.all([
          fetchBook(id),
          fetchReviews(id),
          isFavorite(parseInt(id))
        ]);
        setBook(bookData);
        setReviews(reviewsData);
        setFavorited(isFav);
      } catch (error) {
        console.error('Error fetching book data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBookData();
  }, [id]);

  const handleAddToList = async () => {
    try {
      await addToReadingList(parseInt(id));
      alert('✅ Added to reading list!');
    } catch (error) {
      console.error('Error adding to list:', error);
      if (error.message.includes('already in reading list')) {
        alert('📚 This book is already in your reading list!');
      } else {
        alert('❌ Failed to add to reading list.');
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (favorited) {
        await removeFromFavorites(parseInt(id));
        setFavorited(false);
        alert('💔 Removed from favorites!');
      } else {
        await addToFavorites(parseInt(id));
        setFavorited(true);
        alert('❤️ Added to favorites!');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (error.message.includes('already in favorites')) {
        alert('❤️ This book is already in your favorites!');
      } else {
        alert('❌ Failed to update favorites.');
      }
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner">📚</div>
      <p>Loading book details...</p>
    </div>
  );
  
  if (!book) return (
    <div className="error-container">
      <h2>📖 Book not found</h2>
      <p>The book you're looking for doesn't exist.</p>
    </div>
  );

  return (
    <div className="book-detail">
      <div className="book-header">
        <div className="book-cover">
          {book.image_url ? (
            <img src={book.image_url} alt={book.title} />
          ) : (
            <div className="default-cover">
              <div className="cover-icon">📚</div>
              <div className="cover-title">{book.title}</div>
            </div>
          )}
        </div>
        
        <div className="book-info">
          <div className="book-badge">{book.genre}</div>
          <h1 className="book-title">{book.title}</h1>
          <h2 className="book-author">👤 by {book.author}</h2>
          
          <div className="book-stats">
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{averageRating}</span>
              <span className="stat-label">({reviews.length} reviews)</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📖</span>
              <span className="stat-value">{book.genre}</span>
              <span className="stat-label">Genre</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📅</span>
              <span className="stat-value">{new Date(book.created_at).getFullYear()}</span>
              <span className="stat-label">Added</span>
            </div>
          </div>
          
          <div className="book-actions">
            <button onClick={handleAddToList} className="btn btn-primary">
              📚 Add to Reading List
            </button>
            <button onClick={handleToggleFavorite} className="btn btn-secondary">
              {favorited ? '💔 Remove from Favorites' : '❤️ Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="book-description">
        <h3>📝 About this book</h3>
        <p>{book.description}</p>
      </div>
      
      <div className="reviews-section">
        <h3>⭐ Reader Reviews</h3>
        <ReviewForm bookId={id} onReviewAdded={(review) => setReviews([...reviews, review])} />
        <div className="reviews">
          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>💬 Be the first to review this book!</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="review">
                <div className="review-header">
                  <StarRating rating={review.rating} readonly={true} />
                  <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;