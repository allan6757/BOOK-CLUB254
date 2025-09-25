import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getBook, updateBook } from '../api/books';

const validationSchema = Yup.object({
  title: Yup.string().min(1, 'Title must be at least 1 character').required('Title is required'),
  author: Yup.string().min(2, 'Author must be at least 2 characters').required('Author is required'),
  genre: Yup.string().required('Genre is required'),
  description: Yup.string().min(10, 'Description must be at least 10 characters').required('Description is required'),
  image_url: Yup.string().url('Must be a valid URL')
});

function BookEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await getBook(id);
        setBook(bookData);
      } catch (error) {
        setError('Failed to load book');
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateBook(id, values);
      navigate(`/books/${id}`);
    } catch (error) {
      setError('Failed to update book');
    } finally {
      setSubmitting(false);
    }
  };

  if (!book) return <div>Loading...</div>;

  const genres = [
    'Fiction', 'Science Fiction', 'Fantasy', 'Romance', 'Thriller', 'Mystery',
    'Classic Fiction', 'Self-Help'
  ];

  return (
    <div className="book-edit">
      <h1>Edit Book</h1>
      {error && <div className="alert alert-error">{error}</div>}
      
      <Formik
        initialValues={{
          title: book.title || '',
          author: book.author || '',
          genre: book.genre || '',
          description: book.description || '',
          image_url: book.image_url || ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="book-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <Field type="text" id="title" name="title" />
              <ErrorMessage name="title" component="div" className="error" />
            </div>
            
            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <Field type="text" id="author" name="author" />
              <ErrorMessage name="author" component="div" className="error" />
            </div>
            
            <div className="form-group">
              <label htmlFor="genre">Genre *</label>
              <Field as="select" id="genre" name="genre">
                <option value="">Select a genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </Field>
              <ErrorMessage name="genre" component="div" className="error" />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <Field as="textarea" id="description" name="description" rows="4" />
              <ErrorMessage name="description" component="div" className="error" />
            </div>
            
            <div className="form-group">
              <label htmlFor="image_url">Image URL</label>
              <Field type="url" id="image_url" name="image_url" />
              <ErrorMessage name="image_url" component="div" className="error" />
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => navigate(`/books/${id}`)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? 'Updating...' : 'Update Book'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BookEdit;