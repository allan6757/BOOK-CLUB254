import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createBook } from '../api/books';

const validationSchema = Yup.object({
  title: Yup.string().min(1, 'Title must be at least 1 character').required('Title is required'),
  author: Yup.string().min(2, 'Author must be at least 2 characters').required('Author is required'),
  genre: Yup.string().required('Genre is required'),
  description: Yup.string().min(10, 'Description must be at least 10 characters').required('Description is required'),
  image_url: Yup.string().url('Must be a valid URL')
});

function BookCreate({ onBack }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    setSuccess(false);
    
    try {
      const book = await createBook(values);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/books/${book.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating book:', error);
      setError('Failed to add book. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const genres = [
    'Fiction', 'Science Fiction', 'Fantasy', 'Romance', 'Thriller', 'Mystery',
    'Classic Fiction', 'Dystopian Fiction', 'Philosophy', 'Memoir', 'Biography',
    'Self-Help', 'Literary Fiction', 'Historical Fiction', 'Horror', 'Adventure'
  ];

  return (
    <div className="book-create">
      <div className="create-header">
        <h1>📚 Add New Book to Library</h1>
        <p>Share your favorite books with the community</p>
        
        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            ✅ Book added successfully! Redirecting...
          </div>
        )}
      </div>
      
      <Formik
        initialValues={{ title: '', author: '', genre: '', description: '', image_url: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="book-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">📖 Book Title *</label>
                <Field type="text" id="title" name="title" placeholder="Enter the book title" />
                <ErrorMessage name="title" component="div" className="error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="author">👤 Author *</label>
                <Field type="text" id="author" name="author" placeholder="Enter author name" />
                <ErrorMessage name="author" component="div" className="error" />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="genre">🎭 Genre *</label>
              <Field as="select" id="genre" name="genre">
                <option value="">Select a genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </Field>
              <ErrorMessage name="genre" component="div" className="error" />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">📝 Description *</label>
              <Field as="textarea" id="description" name="description" 
                placeholder="Write a compelling description of the book..." 
                rows="4" />
              <ErrorMessage name="description" component="div" className="error" />
            </div>
            
            <div className="form-group">
              <label htmlFor="image_url">📸 Book Cover Image URL (Optional)</label>
              <Field type="url" id="image_url" name="image_url" 
                placeholder="https://example.com/book-cover.jpg" />
              <ErrorMessage name="image_url" component="div" className="error" />
              {values.image_url && (
                <div className="image-preview">
                  <img src={values.image_url} alt="Book cover preview" 
                    onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={onBack || (() => navigate('/'))} className="btn btn-secondary">
                {onBack ? 'Back' : 'Cancel'}
              </button>
              <button type="submit" disabled={isSubmitting} className="btn btn-gradient">
                {isSubmitting ? '🔄 Adding Book...' : '✨ Add to Library'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BookCreate;