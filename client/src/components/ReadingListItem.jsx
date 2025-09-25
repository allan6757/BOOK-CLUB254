import React from 'react';
import { Link } from 'react-router-dom';
import { updateReadingStatus, removeFromReadingList } from '../api/readingList';

function ReadingListItem({ item, onUpdate, onRemove }) {
  const handleStatusChange = async (newStatus) => {
    try {
      await updateReadingStatus(item.id, newStatus);
      onUpdate(item.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromReadingList(item.id);
      onRemove(item.id);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <div className="reading-list-item">
      <div className="book-info">
        <h3>
          <Link to={`/books/${item.book.id}`}>{item.book.title}</Link>
        </h3>
        <p>by {item.book.author}</p>
      </div>
      <div className="item-controls">
        <select
          value={item.status}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="want_to_read">Want to Read</option>
          <option value="reading">Reading</option>
          <option value="read">Read</option>
        </select>
        <button onClick={handleRemove} className="btn btn-danger">
          Remove
        </button>
      </div>
    </div>
  );
}

export default ReadingListItem;