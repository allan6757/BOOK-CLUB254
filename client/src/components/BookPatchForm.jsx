import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { patchBook } from '../api/books';

const validationSchema = Yup.object({
  title: Yup.string().min(1, 'Title must be at least 1 character'),
  author: Yup.string().min(2, 'Author must be at least 2 characters'),
  genre: Yup.string(),
  description: Yup.string().min(10, 'Description must be at least 10 characters')
});

function BookPatchForm({ bookId, onUpdate }) {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const updatedBook = await patchBook(bookId, values);
      onUpdate(updatedBook);
      resetForm();
    } catch (error) {
      console.error('Error updating book:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ title: '', author: '', genre: '', description: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="patch-form">
          <h4>Quick Update</h4>
          <div className="form-group">
            <Field type="text" name="title" placeholder="Update title" />
            <ErrorMessage name="title" component="div" className="error" />
          </div>
          <div className="form-group">
            <Field type="text" name="author" placeholder="Update author" />
            <ErrorMessage name="author" component="div" className="error" />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default BookPatchForm;