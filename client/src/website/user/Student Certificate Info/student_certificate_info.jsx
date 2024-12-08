import "./student_certificate_info.css";
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../Loading/Loading';
import NavBar from '../Nav Bar/nav_bar';
import axios from "axios";

const StudentCertificateInfo = () => {
    const [studentDetails, setStudentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hook to access URL query params
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const studentId = searchParams.get('id');  // Get 'id' from query params

    useEffect(() => {
        if (!studentId) {
            setError('Student ID is missing in the URL.');
            setLoading(false);
            return;
        }

        const fetchStudentDetails = async () => {
            try {
                // Assuming you have an API endpoint like /api/students/:id
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/certificate/student_certificate_info_get/?studentId=${studentId}`);

                const data = await response.data;
                setStudentDetails(data);
                setLoading(false);
            } catch (error) {
                if (error.response.data.error == "No student found") {
                    setStudentDetails(false)
                } else {
                    setError(error.message);
                }
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [studentId]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    // Show invalid certificate message if no student data is found
    if (!studentDetails) {
        return (
            <div>
                <div>
                    <NavBar />
                </div>
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <div className="text-center">
                        <h3>This certificate is Invalid</h3>
                        <p className="fs-1">📛</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {/* Add the class for print-specific content */}
                        <div className="certificate-print-section card shadow-lg">
                            <div className="card-header bg-primary text-white text-center">
                                <h3>Student Certificate 
                                    <span className=""> Verified </span>
                                </h3>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title text-center">Certificate of Completion</h5>
                                <p className="text-center">This certifies that the student has completed the course.</p>

                                <div className="list-group">
                                    <div className="list-group-item">
                                        <strong>Student Registration ID:</strong> {studentDetails.registrationNumber}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Name:</strong> {studentDetails.name}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Course Name:</strong> {studentDetails.courseName}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Course Duration:</strong> {studentDetails.courseDuration}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Grade:</strong> {studentDetails.grade}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Course Complete Date:</strong> {studentDetails.course_completed_date}
                                    </div>
                                </div>

                                {/* Print Button (Visible on Screen Only) */}
                                <div className="text-center mt-4">
                                    <button className="btn btn-outline-primary print-button" onClick={() => window.print()}>
                                        Print <i className="fa-solid fa-print"></i>
                                    </button>
                                </div>

                                {/* Custom message for printing */}
                                <div className="print-message">
                                    © Earning Planer Ins. All rights reserved.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCertificateInfo;
