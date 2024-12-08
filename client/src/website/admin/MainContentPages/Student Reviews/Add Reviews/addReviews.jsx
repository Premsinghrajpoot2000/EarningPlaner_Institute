import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './addReviews.css';

function AddReviews() {
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        comment: '',
        course: '',
        rating: '1',
        video: null,
        image: null,
    });
    const [warnings, setWarnings] = useState({
        video: '',
        image: '',
    });
    const [loading, setLoading] = useState(false); // Track loading status for form submit
    const [deletingReviewId, setDeletingReviewId] = useState(null); // Track the review being deleted

    const videoInputRef = useRef(null); // Create a ref for the video input

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                let response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/reviews/studentReviewsGet`);
                if (Array.isArray(response.data.msg)) {
                    setReviews(response.data.msg.reverse());  // Reverse reviews here to show the latest first
                } else {
                    console.warn('Expected an array but received:', response.data.msg);
                    setReviews([]);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => {
                const isPortrait = video.videoHeight > video.videoWidth;
                if (!isPortrait) {
                    setWarnings((prevWarnings) => ({
                        ...prevWarnings,
                        video: 'Please upload a portrait-oriented video.',
                    }));

                    // Reset the video input field
                    if (videoInputRef.current) {
                        videoInputRef.current.value = ''; // Reset the input value
                    }

                    setFormData((prevData) => ({
                        ...prevData,
                        video: null, // Reset the formData
                    }));
                } else {
                    setWarnings((prevWarnings) => ({
                        ...prevWarnings,
                        video: '', // Clear the warning
                    }));
                    setFormData((prevData) => ({
                        ...prevData,
                        video: file, // Set the valid video file
                    }));
                }
            };
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width !== 128 || img.height !== 128) {
                    setWarnings((prevWarnings) => ({
                        ...prevWarnings,
                        image: 'Please upload an image of size 128px x 128px.',
                    }));
                    setFormData((prevData) => ({ ...prevData, image: null })); // Reset the formData
                } else {
                    setWarnings((prevWarnings) => ({
                        ...prevWarnings,
                        image: '', // Clear the warning
                    }));
                    setFormData((prevData) => ({ ...prevData, image: file })); // Set the valid image file
                }
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirmation dialog
        const userConfirmed = window.confirm('Are you sure you want to submit the review?');
        if (!userConfirmed) return; // If user clicks 'Cancel', prevent form submission

        const data = new FormData();
        data.append('name', formData.name);
        data.append('comment', formData.comment);
        data.append('course', formData.course);
        data.append('rating', formData.rating);
        if (formData.video) data.append('video', formData.video);
        if (formData.image) data.append('image', formData.image);

        try {
            // Set loading to true to disable the button
            setLoading(true);

            // Send POST request to submit the review
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/reviews/studentReviewsPost`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                maxContentLength: 200 * 1024 * 1024,  // Increase max content length to 200MB
                maxBodyLength: 200 * 1024 * 1024     // Increase max body length to 200MB
              });              

            // Show success alert
            if (response.status === 200) {
                alert('Review submitted successfully!');
            }

            // Fetch updated reviews after submission
            const updatedReviews = await axios.get(`${import.meta.env.VITE_SERVER_URL}/reviews/studentReviewsGet`);
            setReviews(Array.isArray(updatedReviews.data.msg) ? updatedReviews.data.msg.reverse() : []);

            // Reset the form data after successful submission
            setFormData({ name: '', comment: '', course: '', rating: '1', video: null, image: null });

        } catch (error) {
            // Handle error during submission and show an error alert
            console.error('Error submitting review:', error);
            alert('There was an error submitting your review. Please try again later.');
        } finally {
            // Reset loading state
            setLoading(false);
        }
    };

    const handleEdit = (review) => {
        navigate('/admin/editReviews', { state: { review } });
    };

    const handleDelete = async (review) => {
        // Step 1: Ask the user for confirmation before deleting
        const userConfirmed = window.confirm('Are you sure you want to delete this review?');

        // Step 2: If the user confirms, send the delete request
        if (userConfirmed) {
            try {
                // Set the review ID as deleting to disable its button
                setDeletingReviewId(review._id);

                // Send the DELETE request with reviewDB_id in the query string
                const response = await axios.delete(
                    `${import.meta.env.VITE_SERVER_URL}/reviews/studentReviewsDelete?reviewDB_id=${review._id}&imagePublic_url=${review.image}&videoPublic_url=${review.video}`
                );

                // Step 3: If delete is successful, update the state to remove the review
                if (response.status === 200) {
                    // Remove the deleted review from the reviews state
                    setReviews((prevReviews) => prevReviews.filter((r) => r._id !== review._id));

                    // Show success alert
                    alert('Review deleted successfully!');
                }
            } catch (error) {
                // Step 4: If there is an error, show an error alert
                console.error('Error deleting review:', error);
                alert('There was an error deleting the review. Please try again later.');
            } finally {
                // Reset the deleting state
                setDeletingReviewId(null);
            }
        } else {
            // If the user cancels, just log it or show a message
            console.log('Delete action cancelled.');
        }
    };

    return (
        <div
            className='scroll_style' style={{
                background: "#dadada",
                paddingBottom: "20px",
                height: "100vh",
                overflow: "auto"
            }}
        >
            <div className="container my-4">
                <h2>Add a Review</h2>
                <div className="card mb-4" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="name">Student Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="comment">Comment</label>
                                <textarea
                                    className="form-control"
                                    id="comment"
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="course">Course Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="course"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="rating">Rating</label>
                                <select
                                    className="form-control"
                                    id="rating"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    required
                                >
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <option key={star} value={star}>
                                            {star}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="video">Upload Portrait Video</label>
                                <input
                                    ref={videoInputRef} // Attach the ref to the video input
                                    type="file"
                                    className="form-control"
                                    id="video"
                                    name="video"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                />
                                {warnings.video && <small className="text-danger">{warnings.video}</small>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="image">Upload Profile Image (Square)</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {warnings.image && <small className="text-danger">{warnings.image}</small>}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary mt-4"
                                disabled={loading} // Disable the button while loading
                            >
                                {loading ? 'Submitting...' : 'Submit'}  {/* Change button text */}
                            </button>
                        </form>
                    </div>
                </div>

                <h3>Reviews</h3>
                <ul className="list-group row">
                    {reviews.map((review) => (
                        <li key={review._id} className="list-group-item d-flex justify-content-between align-items-center flex-md-row flex-column">
                            <div className="col-lg-10 col-md-7">
                                <strong>{review.name}</strong> - {review.course}
                                <p>{review.comment}</p>
                                <small>Rating: {review.rating} stars</small>
                            </div>
                            <div className="col-lg-2 col-md-5">
                                <button className="btn btn-warning btn-sm float-end" onClick={() => handleEdit(review)}>Edit</button>
                                <button
                                    className="btn btn-danger btn-sm mx-2 float-end"
                                    onClick={() => handleDelete(review)}
                                    disabled={deletingReviewId === review._id} // Disable the button while deleting
                                >
                                    {deletingReviewId === review._id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AddReviews;
