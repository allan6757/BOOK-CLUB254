import React, { useState, useEffect } from 'react';
import { mockBooks } from '../data/mockBooks';
import { sendRecommendation } from '../api/recommendations';
import { useToast } from '../context/ToastContext';

function RecommendBookModal({ friend, isOpen, onClose }) {
  const [selectedBook, setSelectedBook] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) {
      showToast('Please select a book to recommend', 'warning');
      return;
    }

    setSending(true);
    try {
      await sendRecommendation(friend.id, parseInt(selectedBook), message);
      showToast(`Book recommended to ${friend.username}!`, 'success');
      onClose();
      setSelectedBook('');
      setMessage('');
    } catch (error) {
      showToast('Failed to send recommendation', 'error');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="recommend-modal">
        <h2>Recommend Book to {friend.username}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Book:</label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              required
            >
              <option value="">Choose a book...</option>
              {mockBooks.slice(0, 20).map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Message (optional):</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why do you recommend this book?"
              rows="3"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={sending} className="btn btn-primary">
              {sending ? 'Sending...' : 'Send Recommendation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecommendBookModal;