import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './search_course.css';
import Courses from "../Courses/courses";
import Loading from '../Loading/Loading'; // Assume you have a Loading component
import { Helmet } from 'react-helmet';
import NavBar from '../Nav Bar/nav_bar';

const SearchCourse = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('query');

        if (!query) {
            navigate('/'); // Redirect to home if no query
            return;
        }

        const fetchCourses = async () => {
            setLoading(true); // Start loading before fetching data
            setNotFound(false); // Reset notFound state

            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/courses/userCourseSearch?search=${encodeURIComponent(query)}`);
                if (response.data && response.data.length > 0) {
                    setCourses(response.data); // Set courses if found
                } else {
                    setNotFound(true); // Set notFound if no courses found
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setNotFound(true); // Set notFound if there's an error
            } finally {
                setLoading(false); // Stop loading after request is done
            }
        };

        fetchCourses();
    }, [location.search, navigate]); // Fetch on query change

    if (loading) {
        return <Loading />; // Show loading indicator while fetching data
    }

    if (notFound) {
        return <div>Not Found</div>; // Show "Not Found" if no courses are available
    }

    return (
        <div>
            <div>
                <NavBar />
            </div>
            <div>
                <Helmet>
                    {/* Page Title */}
                    <title>Search Courses - Earning Planer</title>

                    {/* Meta Description for SEO */}
                    <meta
                        name="description"
                        content="Easily search and explore IT courses at Earning Planner Institute. Find both free and paid courses with certificates to boost your tech skills."
                    />

                    {/* Open Graph Tags for social media preview */}
                    <meta property="og:title" content="Search Courses - Earning Planer" />
                    <meta
                        property="og:description"
                        content="Easily search and explore IT courses at Earning Planner Institute. Find both free and paid courses with certificates to boost your tech skills."
                    />
                    <meta property="og:image" content="https://earningplaner.com/searct-courses.jpg" /> {/* Replace with actual image URL */}
                    <meta property="og:url" content="https://earningplaner.com/search-courses" /> {/* Replace with actual page URL */}
                    <meta property="og:type" content="website" />

                    {/* Twitter Card Tags for Twitter preview */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Search Courses - Earning Planer" />
                    <meta
                        name="twitter:description"
                        content="Easily search and explore IT courses at Earning Planner Institute. Find both free and paid courses with certificates to boost your tech skills."
                    />
                    <meta name="twitter:image" content="https://earningplaner.com/searct-courses.jpg" /> {/* Replace with actual image URL */}
                    <meta name="twitter:creator" content="@Earning_Planer" /> {/* Replace with your Twitter handle */}
                </Helmet>
            </div>
            <div>
                <Courses database={true} courses={courses} heading="Search Courses" />
            </div>
        </div>
    );
};

export default SearchCourse;
