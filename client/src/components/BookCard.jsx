import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchReviews } from '../api/reviews';
import { addToReadingList } from '../api/readingList';
import { addToFavorites, removeFromFavorites, isFavorite } from '../api/favorites';
import { useToast } from '../context/ToastContext';
import StarRating from './StarRating';

function BookCard({ book }) {
  const [reviews, setReviews] = useState([]);
  const [adding, setAdding] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [favoriting, setFavoriting] = useState(false);
  const { showToast } = useToast();
  
  console.log('BookCard book data:', book);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews(book.id);
        setReviews(data.slice(0, 2)); // Show only first 2 reviews
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    
    const checkFavorite = async () => {
      try {
        const isFav = await isFavorite(book.id);
        setFavorited(isFav);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    loadReviews();
    checkFavorite();
  }, [book.id]);

  const handleAddToList = async () => {
    setAdding(true);
    try {
      console.log('Adding book to reading list:', book.id);
      const result = await addToReadingList(book.id);
      console.log('Add to list result:', result);
      showToast('Added to your reading list!', 'success');
    } catch (error) {
      console.error('Error adding to list:', error);
      if (error.message.includes('already in reading list')) {
        showToast('This book is already in your reading list!', 'warning');
      } else {
        showToast('Failed to add to reading list. Please try again.', 'error');
      }
    } finally {
      setAdding(false);
    }
  };

  const handleToggleFavorite = async () => {
    setFavoriting(true);
    try {
      if (favorited) {
        await removeFromFavorites(book.id);
        setFavorited(false);
        showToast('Removed from favorites!', 'info');
      } else {
        await addToFavorites(book.id);
        setFavorited(true);
        showToast('Added to favorites!', 'success');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (error.message.includes('already in favorites')) {
        showToast('This book is already in your favorites!', 'warning');
      } else {
        showToast('Failed to update favorites. Please try again.', 'error');
      }
    } finally {
      setFavoriting(false);
    }
  };

  const handleRatingChange = (rating) => {
    setUserRating(rating);
  };

  const handleSubmitRating = async () => {
    if (userRating === 0) return;
    
    setAdding(true);
    try {
      // This would typically call an API to submit the rating
      // For now, we'll just show a success message
      showToast(`Rated "${book.title}" ${userRating} star${userRating !== 1 ? 's' : ''}!`, 'success');
      // Reset rating after submission
      setUserRating(0);
    } catch (error) {
      showToast('Failed to submit rating. Please try again.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleCopyLink = () => {
    const bookUrl = `${window.location.origin}/books/${book.id}`;
    navigator.clipboard.writeText(bookUrl).then(() => {
      showToast('Book link copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy link', 'error');
    });
  };

  const handleDownload = () => {
    // Create a simple text file with book info
    const bookContent = `Title: ${book.title}\nAuthor: ${book.author}\nGenre: ${book.genre}\n\nDescription:\n${book.description}\n\n--- Downloaded from Book Warmz ---`;
    const blob = new Blob([bookContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Book downloaded successfully!', 'success');
  };

  return (
    <div className="book-card">
      <div className="book-image">
        {book.image_url ? (
          <img 
            src={book.image_url}
            alt={book.title}
            onLoad={() => console.log('Image loaded:', book.image_url)}
            onError={(e) => {
              console.log('Image failed to load:', book.image_url);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : console.log('No image_url for book:', book.title)}
        <div className="default-book-cover" style={{display: book.image_url ? 'none' : 'flex'}}>
          <div className="book-spine"></div>
          <div className="book-title-overlay">{book.title.substring(0, 20)}{book.title.length > 20 ? '...' : ''}</div>
        </div>
      </div>
      <div className="book-card-header">
        <div className="genre-badge">{book.genre}</div>
        <button 
          onClick={handleToggleFavorite}
          disabled={favoriting}
          className={`favorite-btn ${favorited ? 'favorited' : ''}`}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorited ? '💖' : '🤍'}
        </button>
      </div>
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">by {book.author}</p>
      <p className="book-description">{book.description}</p>
      
      <div className="comments-preview">
        <h4>Recent Reviews</h4>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-preview">
              <div className="rating">★{review.rating}/5</div>
              <p>{review.comment.substring(0, 100)}{review.comment.length > 100 ? '...' : ''}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="book-rating">
        <h4>Rate this book:</h4>
        <StarRating 
          rating={userRating} 
          onRatingChange={handleRatingChange}
        />
        {userRating > 0 && (
          <button 
            onClick={handleSubmitRating}
            className="btn btn-rating"
            disabled={adding}
          >
            ✨ Submit Rating
          </button>
        )}
      </div>
      
      <div className="book-actions">
        <Link to={`/books/${book.id}`} className="btn btn-primary">
          View Details
        </Link>
        <button 
          onClick={handleAddToList} 
          disabled={adding}
          className="btn btn-secondary"
        >
          {adding ? 'Adding...' : 'Add to Library'}
        </button>
        <button 
          onClick={handleDownload}
          className="btn btn-download"
          title="Download book info"
        >
          📥
        </button>
        <button 
          onClick={() => navigator.share ? navigator.share({
            title: book.title,
            text: `Check out "${book.title}" by ${book.author} - ${book.description.substring(0, 100)}...`,
            url: window.location.href
          }) : handleCopyLink()}
          className="btn btn-share"
          title="Share book"
        >
          📤
        </button>
      </div>
    </div>
  );
}

export default BookCard;