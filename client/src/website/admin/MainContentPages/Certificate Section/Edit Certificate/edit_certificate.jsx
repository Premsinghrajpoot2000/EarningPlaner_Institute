import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import './edit_certificate.css';

const EditCertificate = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Check if token is present in session storage and redirect to login if not
    useEffect(() => {
        let getToken = sessionStorage.getItem('token');
        
        if (!getToken) {
            // If token is not found, redirect to /adminLogin
            navigate('/adminLogin');
        }
    }, [navigate]);

    // Destructure the certificate data from the state passed during navigation
    const { course } = location.state || {};

    // Redirect to /admin if course data is missing
    useEffect(() => {
        if (!course) {
            navigate('/admin');
        }
    }, [course, navigate]);

    // Parsing function for the date
    const parseDate = (dateString) => {
        const parsedDate = dateString ? parse(dateString, 'dd-MMM-yyyy', new Date()) : null;
        return parsedDate;
    };

    // Set initial state using the correct property name for the course_completed_date
    const [name, setName] = useState(course?.name || '');
    const [courseName, setCourseName] = useState(course?.courseName || '');
    const [courseDuration, setCourseDuration] = useState(course?.courseDuration || '');
    const [grade, setGrade] = useState(course?.grade || '');
    const [courseCompleteDate, setCourseCompleteDate] = useState(
        course?.course_completed_date ? parseDate(course.course_completed_date) : null
    );

    // Handle form submission for updating the certificate
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirm before submitting
        const isConfirmed = window.confirm("Are you sure you want to update this certificate?");
        if (!isConfirmed) return;

        const formattedDate = courseCompleteDate ? format(courseCompleteDate, 'dd-MMM-yyyy') : '';

        const updatedCertificate = {
            id: course._id,
            name,
            courseName,
            courseDuration,
            grade,
            course_completed_date: formattedDate, // Send formatted date
        };

        try {
            // Send PUT request to update the certificate
            await axios.patch(`${import.meta.env.VITE_SERVER_URL}/certificate/student_certificate_info_patch`, updatedCertificate);

            alert('Certificate updated successfully!');
            navigate('/admin');
        } catch (error) {
            console.error('Error updating certificate', error);
            alert('Error updating certificate. Please try again.');
        }
    };

    const handleExitButtonClick = () => {
        navigate('/admin');
    };

    return (
        <div
            className='scroll_style' style={{
                background: "#dadada",
                paddingBottom: "20px",
                height: "100vh",
                overflow: "auto"
            }}>
            <div className="container my-4">
                <button className='btn btn-secondary my-3' onClick={handleExitButtonClick}>
                    <i className="fa-solid fa-left-to-bracket"></i> Exit
                </button>

                {/* Edit certificate form */}
                <form onSubmit={handleSubmit} className="border p-4 rounded bg-light mb-4">
                    <h5 className='card-title mb-2'>Edit certificate Information</h5>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control mb-3"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="courseName">Course Name:</label>
                        <input
                            type="text"
                            id="courseName"
                            className="form-control mb-3"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="courseDuration">Course Duration:</label>
                        <input
                            type="text"
                            id="courseDuration"
                            className="form-control mb-3"
                            value={courseDuration}
                            onChange={(e) => setCourseDuration(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="grade">Grade:</label>
                        <input
                            type="text"
                            id="grade"
                            className="form-control mb-3"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="courseCompleteDate">Course Complete Date:</label>
                        <br />
                        <DatePicker
                            id="courseCompleteDate"
                            className="form-control mb-3"
                            selected={courseCompleteDate} // This now uses the correct state
                            onChange={(date) => setCourseCompleteDate(date)} // Updates state when the user selects a new date
                            dateFormat="dd-MMM-yyyy"
                            placeholderText="Select a date"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Update Certificate</button>
                </form>
            </div>
        </div>
    );
};

export default EditCertificate;
