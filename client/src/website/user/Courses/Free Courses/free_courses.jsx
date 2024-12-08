import { useEffect, useState } from "react";
import Courses from "../courses";
import "./free_courses.css";
import axios from "axios";
import Loading from "../../Loading/Loading";
import { Helmet } from 'react-helmet';
import NavBar from "../../Nav Bar/nav_bar";

const FreeCourses = ({ home }) => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        let fetchData = async () => {
            try {
                let response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/courses/userCoursesGet/Free`)
                setCourses(response.data.msg)
            } catch (error) {
                console.error(error);
            }
        }
        fetchData()
    }, []);

    if (courses.length === 0) {
        return <Loading />
    }
    return (
        <div>
            {/* Nav Section */}
            {!home&&<div>
                <NavBar />
            </div>}
            <div>
                {!home && (
                    <Helmet>
                        {/* Page Title */}
                        <title>Free Courses - Earning Planer</title>

                        {/* Meta Description for SEO */}
                        <meta
                            name="description"
                            content="Learn IT skills for free with Earning Planner Institute’s online courses. Enhance your career with practical, hands-on training in tech."
                        />

                        {/* Open Graph Tags */}
                        <meta property="og:title" content="Free Courses - Earning Planer" />
                        <meta
                            property="og:description"
                            content="Learn IT skills for free with Earning Planner Institute’s online courses. Enhance your career with practical, hands-on training in tech."
                        />
                        <meta property="og:image" content="https://earningplaner.com/free%Courses.jpg" /> {/* Replace with actual image URL */}
                        <meta property="og:url" content="https://earningplaner.com/free-courses" /> {/* Replace with the actual page URL */}
                        <meta property="og:type" content="website" />

                        {/* Twitter Card Tags */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content="Free Courses - Earning Planer" />
                        <meta
                            name="twitter:description"
                            content="Learn IT skills for free with Earning Planner Institute’s online courses. Enhance your career with practical, hands-on training in tech."
                        />
                        <meta name="twitter:image" content="https://earningplaner.com/free%Courses.jpg" /> {/* Replace with actual image URL */}
                        <meta name="twitter:creator" content="@Earning_Planer" /> {/* Replace with your Twitter handle */}
                    </Helmet>
                )}

            </div>
            <div>
                <Courses courses={courses} heading="Free Courses" home={home} />
            </div>
        </div>
    );
}

export default FreeCourses;
