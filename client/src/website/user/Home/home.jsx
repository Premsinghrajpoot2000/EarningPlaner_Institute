// src/Home.js
import React, { useEffect, useState } from "react";
import "./home.css";
import { Link } from "react-router-dom";
import PaidCourses from "../Courses/Paid Courses/paid_courses";
import FreeCourses from "../Courses/Free Courses/free_courses";
import NavBar from '../Nav Bar/nav_bar';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import StudentReviews from "../student reviews/student_reviews";

const Home = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [displayText, setDisplayText] = useState("");
    const [typingIndex, setTypingIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [channelData, setChannelData] = useState(null);
    const [headings, setHeadings] = useState([]);
    const [images, setImages] = useState([]);

    const getDataBaseHero = async (req, res) => {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/hero/heroGet`);
        setHeadings(response.data.msg.map(obj => obj.typingText).reverse());
        setImages(response.data.msg.map(obj => obj.images).reverse());
    }

    useEffect(() => {
        getDataBaseHero()
    }, []);

    const reasons = [
        "Experienced Instructors with Industry Knowledge",
        "Hands-on Training with Real-world Projects",
        "Regular Assignments for Skill Development",
        "Interview Preparation and Job Guidance",
        "Comprehensive Course Materials and Resources",
        "Ongoing Support for Career Development",
        "Networking Opportunities with Industry Professionals",
        "Access to Online Learning Platforms and Resources",
        "Feedback and Mentorship from Experienced Peers",
        "Flexible Course Duration to Fit Your Schedule"
    ];

    const channelId = 'UCrJcJFwtn7LpA8HdW5BGbsw';
    const apiKey = 'AIzaSyAah4lGfFj_2a6jcofVFkzxAiI43Ajcyy0';

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`);
                const data = await response.json();
                setChannelData(data.items[0]);
            } catch (error) {
                console.error('Error fetching channel data:', error);
            }
        };

        fetchChannelData();
        const interval = setInterval(fetchChannelData, 60000);
        return () => clearInterval(interval);
    }, [channelId, apiKey]);

    const updateCount = (newCount) => {
        return newCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "", // Add mobile field
        subject: "",
        message: "",
        consent: false,
    });

    let [submitProcessState, setSubmitProcessState] = useState(true);

    useEffect(() => {
        const typingTimeout = setTimeout(() => {
            if (isTyping && typingIndex < headings[currentImageIndex].length) {
                setDisplayText((prev) => prev + headings[currentImageIndex][typingIndex]);
                setTypingIndex((prev) => prev + 1);
            } else if (typingIndex === headings[currentImageIndex].length) {
                setIsTyping(false);
            }
        }, 100); // Typing speed

        if (!isTyping && typingIndex === headings[currentImageIndex].length) {
            const timeout = setTimeout(() => {
                setFade(false); // Start fading out
            }, 2000); // Wait before fading out

            const transitionTimeout = setTimeout(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                setDisplayText(""); // Clear text
                setTypingIndex(0); // Reset typing index
                setIsTyping(true); // Start typing next heading
                setFade(true); // Fade in
            }, 2500); // Time for fade out

            return () => {
                clearTimeout(timeout);
                clearTimeout(transitionTimeout);
            };
        }
        return () => clearTimeout(typingTimeout);
    }, [typingIndex, isTyping, currentImageIndex, headings]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitProcessState(false);
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/add_to_sheet`, formData);
            alert('Message sent successfully!');
            setFormData({
                name: "",
                email: "",
                mobile: "", // Reset mobile field
                subject: "",
                message: "",
                consent: false,
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSubmitProcessState(true);
        }
    };

    return (
        <div>
            {/* Nav Section */}
            <div>
                <NavBar />
            </div>
            <div>
                <Helmet>
                    {/* Page Title */}
                    <title>Earning Planer</title>

                    {/* Meta Description for SEO */}
                    <meta
                        name="description"
                        content="EarningPlaner.com offers a wide range of free and affordable computer courses with certificates. Enhance your skills, boost your career, and learn at your own pace with high-quality courses at low prices. Start learning today!"
                    />

                    {/* Open Graph Tags for social media preview */}
                    <meta property="og:title" content="Earning Planer" />
                    <meta
                        property="og:description"
                        content="EarningPlaner.com offers a wide range of free and affordable computer courses with certificates. Enhance your skills, boost your career, and learn at your own pace with high-quality courses at low prices. Start learning today!"
                    />
                    <meta property="og:image" content="https://earningplaner.com/Logo.png" /> {/* Replace with actual image URL */}
                    <meta property="og:url" content="https://earningplaner.com" /> {/* Replace with actual URL */}
                    <meta property="og:type" content="website" />

                    {/* Twitter Card Tags for Twitter preview */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Earning Planer" />
                    <meta
                        name="twitter:description"
                        content="EarningPlaner.com offers a wide range of free and affordable computer courses with certificates. Enhance your skills, boost your career, and learn at your own pace with high-quality courses at low prices. Start learning today!"
                    />
                    <meta name="twitter:image" content="https://earningplaner.com/Logo.png" /> {/* Replace with actual image URL */}
                    <meta name="twitter:creator" content="@Earning_Planer" /> {/* Replace with your Twitter handle */}
                </Helmet>
            </div>
            {/* Hero Section */}
            <div className="hero-section hero_div">
                <div
                    className={`hero-image ${fade ? 'fade-in' : 'fade-out'}`}
                    style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
                />
                <div className="hero-content">
                    <h2 className="m-0">{displayText}</h2>
                </div>
            </div>

            {/* Paid Courses Section */}
            <div className="container mt-5 text-center">
                <hr />
                <h2 className="mb-4 style_underline" data-aos="zoom-in" data-aos-once="true">Our Paid Courses</h2>
                <div className="row">
                    <PaidCourses home={true} />
                </div>
                <Link to="/paid-courses" className="btn btn-primary">View Courses</Link>
            </div>

            {/* Why Choose Us Section */}
            <div id="why_choose_us" className="container mt-5">
                <div className="text-center">
                    <hr />
                    <h2 className="mb-4 style_underline" data-aos="zoom-in" data-aos-once="true">Why Choose Us?</h2>
                </div>
                <div className="d-flex">
                    <ul className="mt-4 fs-5 custom-list">
                        {reasons.map((reason, index) => (
                            <li key={index} className="mb-2"
                                data-aos="fade-right"
                                data-aos-once="true"
                                data-aos-delay={index * 100}
                                data-aos-anchor-placement="top-bottom">
                                {reason}
                            </li>
                        ))}
                    </ul>
                    <div className="d-none d-md-inline-block" data-aos="fade-left" data-aos-once="true" data-aos-anchor-placement="top-bottom">
                        <img src="WhyChooseUs.gif" alt="Why Choose Us" className="img-fluid" />
                    </div>
                </div>
            </div>

            {/* Free Courses Section */}
            <div className="container mt-5 text-center">
                <hr />
                <h2 className="mb-4 style_underline" data-aos="zoom-in" data-aos-once="true">Our Free Courses</h2>
                <div className="row">
                    <FreeCourses home={true} />
                </div>
                <Link to="/free-courses" className="btn btn-primary">View Courses</Link>
            </div>

            {/* Subscribe Our Channel */}
            <div className="container mt-5">
                <div className="channel-info card shadow-sm p-4">
                    <div className="text-center">
                        <h2 className="mb-4 style_underline" data-aos="zoom-in" data-aos-once="true">Subscribe Our Channel</h2>
                    </div>
                    {channelData && (
                        <div className="row align-items-center" style={{ height: '100%' }}>
                            <div className="col-md-3 d-flex flex-column align-items-center justify-content-center">
                                <img
                                    src={channelData.snippet.thumbnails.default.url}
                                    alt="Channel Logo"
                                    className="img-fluid rounded-circle mb-3"
                                    style={{ width: '150px', height: '150px' }}
                                />
                                <h2 className="channel-title mt-2">{channelData.snippet.title}</h2>
                            </div>
                            <div className="col-md-2 d-flex flex-column align-items-center justify-content-center">
                                <div className="channel-stats mb-3 text-center">
                                    <div className="subscriber-count text-muted mb-2">
                                        <strong>Subscribers:</strong> <span className="animated-count">{updateCount(channelData.statistics.subscriberCount)}</span>
                                    </div>
                                    <div className="views-count text-muted mb-2">
                                        <strong>Views:</strong> <span className="animated-count">{updateCount(channelData.statistics.viewCount)}</span>
                                    </div>
                                    <div className="videos-count text-muted mb-2">
                                        <strong>Videos:</strong> {channelData.statistics.videoCount}
                                    </div>
                                </div>
                                <a
                                    href={`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-danger w-100 shake-button"
                                >
                                    Subscribe
                                </a>
                            </div>
                            <div className="col-md-7">
                                <div className="description">
                                    <h5 className="mt-3">Description:</h5>
                                    <pre style={{ whiteSpace: 'pre-wrap' }} className="text-muted">{channelData.snippet.description}</pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Form */}
            <div id="contactForm" className="container my-5">
                <div className="text-center">
                    <h2 className="text-center mb-4 style_underline" data-aos="zoom-in" data-aos-once="true">Send Us A Message</h2>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="flex-fill me-3" data-aos="fade-right" data-aos-once="true" data-aos-delay="200">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name:</label>
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
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="mobile" className="form-label">Mobile Number:</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="mobile"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="subject" className="form-label">Subject:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message" className="form-label">Message:</label>
                                <textarea
                                    className="form-control"
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="consent"
                                    name="consent"
                                    checked={formData.consent}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="consent" className="form-check-label">
                                    I agree to the terms and conditions and the privacy policy.
                                </label>
                            </div>
                            <button type="submit" className="btn btn-dark w-100" disabled={!submitProcessState}>
                                {submitProcessState ? "Submit" : "Submitting..."}
                            </button>
                        </form>
                    </div>
                    <div className="flex-shrink-0 d-none d-lg-block" data-aos="fade-left" data-aos-once="true" data-aos-delay="500">
                        <img src="ContactUs.gif" alt="Contact Us" className="img-fluid" style={{ marginTop: "20px" }} />
                    </div>
                </div>
            </div>

            {/* Student Reviews */}
            <div className="container my-5">
                <hr className="mb-5" />
                <div className="text-center">
                    <h2 className="text-center mb-4 style_underline">Students Reviews</h2>
                </div>
                <StudentReviews />
            </div>
        </div>
    );
};

export default Home;
