import './editReviews.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function EditReviews() {
    const location = useLocation();
    const navigate = useNavigate();  // useNavigate hook for redirection
    useEffect(() => {
        let getToken = sessionStorage.getItem('token');

        if (!getToken) {
            // If token is not found or is empty, redirect to /adminLogin
            navigate('/adminLogin');
        }
    }, [navigate]);  // Adding navigate to dependency array to ensure it's available in useEffect

    const reviewData = location.state?.review || {};  // Assuming review data is passed via location.state

    const [formData, setFormData] = useState({
        name: reviewData.name || '',
        comment: reviewData.comment || '',
        course: reviewData.course || '',
        rating: reviewData.rating || 1,
        video: reviewData.video || null,
        image: reviewData.image || null,
    });

    const [loading, setLoading] = useState(false);
    const [warnings, setWarnings] = useState({
        video: '',
        image: ''
    });

    const videoInputRef = useRef(null);  // Ref for video input to reset the input field

    useEffect(() => {
        if (!reviewData._id) {
            navigate('/admin'); // Redirect if no review data available
        }
    }, [reviewData, navigate]);

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
                    // Show warning if video is not portrait
                    setWarnings((prevWarnings) => ({
                        ...prevWarnings,
                        video: 'Please upload a portrait-oriented video.',
                    }));

                    // Reset the video input field manually using ref
                    if (videoInputRef.current) {
                        videoInputRef.current.value = ''; // Reset the input field
                    }

                    // Reset the video field in formData
                    setFormData((prevData) => ({
                        ...prevData,
                        video: null, // Clear the video state
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

                    // Reset the image input field and form data
                    setFormData((prevData) => ({ ...prevData, image: null }));
                    e.target.value = ''; // Reset image input field
                } else {
                    setWarnings((prevWarnings) => ({
                        ...prevWarnings,
                        image: '', // Clear the warning if image is valid
                    }));
                    setFormData((prevData) => ({ ...prevData, image: file }));
                }
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirm before submitting
        const isConfirmed = window.confirm("Are you sure you want to update this review?");
        if (!isConfirmed) {
            return; // Exit if user cancels
        }

        setLoading(true);

        // Prepare FormData to send
        const formDataToSend = new FormData();

        // Add text fields
        formDataToSend.append('name', formData.name);
        formDataToSend.append('comment', formData.comment);
        formDataToSend.append('course', formData.course);
        formDataToSend.append('rating', formData.rating);

        // Add file fields if present
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        if (formData.video) {
            formDataToSend.append('video', formData.video);
        }

        const queryParams = new URLSearchParams({
            imageurl: reviewData.image || '',
            userDb_id: reviewData._id,
            videourl: reviewData.video || ''
        });

        try {
            // Send PATCH request to update review
            await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/reviews/studentReviewsPatch?${queryParams}`,
                formDataToSend,
                {
                  headers: { 'Content-Type': 'multipart/form-data' },
                  timeout: 300000  // Set timeout to 5 minutes
                }
              );              

            // Show success alert
            alert('Review updated successfully!');
            // Optionally navigate to another page
            navigate('/admin');
        } catch (error) {
            console.error(error);
            // Show error alert
            alert('Error updating review. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    const handleExitButtonClick = () => {
        navigate('/admin');
    };

    return (
        <div className='scroll_style' style={{
            background: "#dadada",
            paddingBottom: "20px",
            height: "100vh",
            overflow: "auto"
        }}>
            <div className="container">
                <button className='btn btn-secondary my-3' onClick={handleExitButtonClick}>
                    <i className="fa-solid fa-left-to-bracket"></i> Exit
                </button>
                <div className="card mb-4" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
                    <div className="card-body">
                        <h5 className='card-title'>Edit Student Reviews</h5>
                        <form onSubmit={handleSubmit}>
                            {/* Student Name Field */}
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

                            {/* Comment Field */}
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

                            {/* Course Name Field */}
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

                            {/* Rating Field */}
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

                            {/* Video Upload Field */}
                            <div className="form-group mb-3">
                                <label htmlFor="video">Upload Portrait Video</label>
                                <input
                                    ref={videoInputRef} // Attach ref to video input
                                    type="file"
                                    className="form-control"
                                    id="video"
                                    name="video"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                />
                                {warnings.video && <small className="text-danger">{warnings.video}</small>}
                            </div>

                            {/* Image Upload Field */}
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

                            {/* Update Button */}
                            <button
                                type="submit"
                                className="btn btn-primary mt-4"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditReviews;
