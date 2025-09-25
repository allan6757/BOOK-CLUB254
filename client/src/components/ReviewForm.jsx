import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createReview } from '../api/reviews';
import StarRating from './StarRating';

const validationSchema = Yup.object({
  rating: Yup.number().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5').required('Rating is required'),
  comment: Yup.string().min(5, 'Comment must be at least 5 characters').required('Comment is required')
});

function ReviewForm({ bookId, onReviewAdded }) {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const review = await createReview(bookId, values);
      onReviewAdded(review);
      resetForm();
    } catch (error) {
      console.error('Error creating review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ rating: 5, comment: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="review-form">
          <h4>Write a Review</h4>
          <div className="form-group">
            <label>Rating:</label>
            <Field name="rating">
              {({ field, form }) => (
                <StarRating 
                  rating={field.value} 
                  onRatingChange={(rating) => form.setFieldValue('rating', rating)} 
                />
              )}
            </Field>
            <ErrorMessage name="rating" component="div" className="error" />
          </div>
          <div className="form-group">
            <label htmlFor="comment">Comment:</label>
            <Field as="textarea" id="comment" name="comment" />
            <ErrorMessage name="comment" component="div" className="error" />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default ReviewForm;