import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './courseModule.css'; // Custom CSS for additional styling
import { useNavigate } from 'react-router-dom';
import NavBar from '../Nav Bar/nav_bar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import 'aos/dist/aos.css'; // AOS CSS
import Page_Not_Found from '../Error page/page_Not_Found';
import Loading from '../Loading/Loading';

const CourseModule = () => {
    let navigate = useNavigate();
    const { courseTitle } = useParams();
    const [modules, setModules] = useState([]);
    const [idNotFound, setIdNotFound] = useState(false);
    const [courseDetails, setCourseDetails] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0); // To manage which module is active
    const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Track screen width
    const contentRefs = useRef([]); // To reference each collapsible content
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [formData, setFormData] = useState({
        name: '',
        mobileNumber: '',
        courseName: '',
    });
    const [loading, setLoading] = useState(false); // Loading state to track submission progress
    const [loadingGetCourse, setLoadingGetCourse] = useState(false); // Loading state to track submission progress

    // Update screen width on window resize
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const renderContentColumns = (content) => {
        const chunkSize = 2; // 2 items per row (for larger screens)
        const columns = [];

        // Split content into chunks (each chunk will hold up to 2 items per row)
        for (let i = 0; i < content.length; i += chunkSize) {
            columns.push(content.slice(i, i + chunkSize));
        }

        return (
            <div className="table-like-container mt-3 mx-4">
                {columns.map((column, colIndex) => (
                    <div key={colIndex} className="table-like-row d-flex justify-content-start flex-wrap">
                        {column.map((item, index) => (
                            <div key={index} className="table-like-cell mb-2">
                                <ul className="m-0 p-0">
                                    <li style={{ lineHeight: '1.6' }}>
                                        {item}
                                    </li>
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    const handleToggle = (index) => {
        setActiveIndex(index === activeIndex ? null : index); // Toggle active state
    };

    useEffect(() => {
        // Ensure all collapsible content heights are adjusted on component mount
        modules.forEach((module, index) => {
            if (contentRefs.current[index]) {
                if (index === activeIndex) {
                    contentRefs.current[index].style.maxHeight = `${contentRefs.current[index].scrollHeight}px`;
                } else {
                    contentRefs.current[index].style.maxHeight = '0px';
                }
            }
        });
    }, [activeIndex, modules]);

    // Handle show modal
    const handleShowModal = () => {
        setShowModal(true);
        document.body.style.overflow = 'hidden'; // Prevent page scrolling when modal is open
        document.getElementById("background-blur").classList.add('background-blur'); // Add background blur class to body
    };
    // Handle close modal
    const handleCloseModal = () => {
        setShowModal(false);
        document.body.removeAttribute("style") // Re-enable page scrolling when modal is closed
        document.getElementById("background-blur").classList.remove('background-blur'); // Add background blur class to body
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        if (!courseTitle) {
            navigate('/');
        }
    }, [courseTitle, navigate]);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoadingGetCourse(true);
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/courses/userPaidOneCourseGet?course_id=${courseTitle}`);
                if (response.status === 200) {
                    setCourseDetails(response.data.msg);
                    setModules(response.data.msg.modules);
                    setLoadingGetCourse(false);
                    setFormData({
                        name: '',
                        mobileNumber: '',
                        courseName: response.data.msg.title || '',
                    })
                }
                setIdNotFound(false)
            } catch (error) {
                if (error.response.data.msg === "not found") {
                    setIdNotFound(true)
                }
                console.error('Error fetching course data:', error);
                setLoadingGetCourse(false); // Stop loading even if there's an error
            }
        };

        if (courseTitle) {
            fetchCourseData();
        }
    }, [courseTitle]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page
        setLoading(true); // Set loading to true when form is being submitted
        try {
            // Send POST request using axios
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/userGetCourseForm_route/studentGetCourseForm`, formData); // Replace 'YOUR_API_URL' with the actual API endpoint
            // Handle success response
            if (response.status === 200) {
                alert('Form submitted successfully!'); // Success alert
                handleCloseModal(); // Close the modal after successful submission
            }
        } catch (error) {
            if (error.response.data?.error) {
                return alert(error.response.data.error);
            }
            // Handle error if the request fails
            alert('There was an error submitting your form. Please try again.');
        } finally {
            setLoading(false); // Reset loading state after request completes (either success or failure)
            setFormData({
                name: '',
                mobileNumber: '',
                courseName: course?.title || '',
            })
            handleCloseModal()
        }
    };

    if (idNotFound) {
        return <Page_Not_Found />
    }

    return (
        <div>
            {loadingGetCourse && <Loading />}
            <div id='background-blur'>
                {/* Nav Section */}
                <div>
                    <NavBar />
                </div>
                <div>
                    <Helmet>
                        {/* Page Title with Dynamic Playlist Title */}
                        <title>{courseDetails?.title ? `${courseDetails.title} - Earning Planner` : "Earning Planner"}</title>

                        {/* Meta Description for SEO with Dynamic Playlist Title */}
                        <meta
                            name="description"
                            content={`Enroll in the premium ${courseDetails?.title} course at Earning Planner Institute. Gain in-demand tech skills with hands-on training and accelerate your career growth. Start your journey today!`}
                        />
                        {/* Open Graph Tags for social media preview */}
                        <meta property="og:title" content={`${courseDetails?.title} - Earning Planer`} />
                        <meta
                            property="og:description"
                            content={`Enroll in the premium ${courseDetails?.title} course at Earning Planner Institute. Gain in-demand tech skills with hands-on training and accelerate your career growth. Start your journey today!`}
                        />
                        <meta property="og:image" content={`https://earningplaner.com/${courseDetails?.image}`} /> {/* Replace with actual image URL */}
                        <meta property="og:url" content={`https://earningplaner.com/${courseDetails?.course_id}`} /> {/* Replace with actual dynamic URL */}
                        <meta property="og:type" content="website" />

                        {/* Twitter Card Tags for Twitter preview */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content={`${courseDetails?.title} - Earning Planer`} />
                        <meta
                            name="twitter:description"
                            content={`Enroll in the premium ${courseDetails?.title} course at Earning Planner Institute. Gain in-demand tech skills with hands-on training and accelerate your career growth. Start your journey today!`}
                        />
                        <meta name="twitter:image" content={`https://earningplaner.com/${courseDetails?.image}`} /> {/* Replace with actual image URL */}
                        <meta name="twitter:creator" content="@Earning_Planer" /> {/* Replace with your Twitter handle */}
                    </Helmet>
                </div>
                <div className="container mt-5">
                    <h2 className="text-center mb-4">{courseDetails.title} Syllabus</h2>
                    <div
                        id='course_module_top_details'
                        style={{
                            backgroundImage: screenWidth >= 768 ? `url('${courseDetails.gifImage}')` : 'none', // Apply background only if screen width is >= md
                            backgroundRepeat: `no-repeat`,
                            backgroundPosition: `right center`,
                            backgroundSize: "contain"
                        }}
                        className="p-4 mb-4"
                    >
                        <p><strong>Duration:</strong> {courseDetails.duration}</p>
                        <p><strong>Mode:</strong> {courseDetails.mode}</p>
                        <p><strong>Live Sessions:</strong> {courseDetails.liveSessions}</p>
                        {courseDetails.projects && <p><strong>Projects:</strong> {courseDetails.projects}</p>}
                        {courseDetails.assignments && <p><strong>Assignments:</strong> {courseDetails.assignments}</p>}
                    </div>
                    <div className="text-center mb-5">
                        <button
                            className="btn btn-primary"
                            onClick={handleShowModal}
                        >
                            Get Admission Now
                        </button>
                    </div>

                    <div className="accordion" id="moduleAccordion">
                        {modules.map((module, index) => (
                            <div className="accordion-item mb-3 rounded" key={index}>
                                <h2 className="accordion-header" id={`heading-${index}`}>
                                    <button
                                        className={`accordion-button ${index === activeIndex ? '' : 'collapsed'}`}
                                        type="button"
                                        onClick={() => handleToggle(index)} // Toggle on click
                                        aria-expanded={index === activeIndex ? 'true' : 'false'}
                                        aria-controls={`collapse-${index}`}
                                        style={{ zIndex: "0" }}
                                    >
                                        <div className="d-flex align-items-center justify-content-between flex-wrap" >
                                            <p className="mb-1 fs-5">
                                                <span className="d-lg-none d-inline-block">{index + 1}.</span>
                                                {module.title}
                                            </p>
                                            <ul id='courseModule_ul' className="d-flex align-items-center m-0 list-unstyled flex-wrap">
                                                <li className="d-flex align-items-center my-1 ">
                                                    <div className="text-center d-flex align-items-center justify-content-center">
                                                        {module.liveClasses}
                                                    </div>
                                                    Live Classes
                                                </li>
                                                {module.assignments && (
                                                    <li className="d-flex align-items-center my-1 ">
                                                        <div className="text-center d-flex align-items-center justify-content-center">
                                                            {module.assignments}
                                                        </div>
                                                        Assignments
                                                    </li>
                                                )}
                                                {module.projects && (
                                                    <li className="d-flex align-items-center my-1 ">
                                                        <div className="text-center d-flex align-items-center justify-content-center">
                                                            {module.projects}
                                                        </div>
                                                        Projects
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </button>
                                </h2>
                                <div
                                    id={`collapse-${index}`}
                                    aria-labelledby={`heading-${index}`}
                                    data-bs-parent="#moduleAccordion"
                                    ref={el => contentRefs.current[index] = el}
                                    style={{
                                        maxHeight: index === activeIndex ? `${contentRefs.current[index]?.scrollHeight}px` : '0px',
                                        overflow: 'hidden',
                                        transition: 'max-height 0.3s ease-in-out', // Smooth transition
                                    }}
                                >
                                    <div className="accordion-body">
                                        {renderContentColumns(module.content)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Modal for Get This Course Form */}
            {showModal && (
                <div
                    className="modal fade show z"
                    id="courseModal"
                    style={{ display: 'block' }}
                    tabIndex="-1"
                    aria-labelledby="courseModalLabel"
                    aria-hidden="true"
                    data-aos="zoom-in"
                    data-aos-duration="300"
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="courseModalLabel">Get This Course</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body d-block">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="mobileNumber" className="form-label">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="mobileNumber"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="courseName" className="form-label">
                                            Course Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="courseName"
                                            name="courseName"
                                            value={formData.courseName}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseModule;
