import { useEffect, useState } from "react";
import Courses from "../courses";
import "./paid_courses.css";
import Loading from "../../Loading/Loading";
import axios from "axios";
import { Helmet } from 'react-helmet';
import NavBar from "../../Nav Bar/nav_bar";

const PaidCourses = ({ home }) => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        let fetchData = async () => {
            try {
                let response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/courses/userCoursesGet/Paid`)
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
                        <title>Paid Courses - Earning Planer</title>

                        {/* Meta Description for SEO */}
                        <meta
                            name="description"
                            content="Boost your career with affordable paid IT courses at Earning Planner Institute. Get certified, hands-on training in high-demand tech skills."
                        />

                        {/* Open Graph Tags */}
                        <meta property="og:title" content="Paid Courses - Earning Planer" />
                        <meta
                            property="og:description"
                            content="Boost your career with affordable paid IT courses at Earning Planner Institute. Get certified, hands-on training in high-demand tech skills."
                        />
                        <meta property="og:image" content="https://earningplaner.com/Paid%Courses.jpg" /> {/* Replace with your actual image URL */}
                        <meta property="og:url" content="https://earningplaner.com/paid-courses" /> {/* Replace with actual URL */}
                        <meta property="og:type" content="website" />

                        {/* Twitter Card Tags */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content="Paid Courses - Earning Planer" />
                        <meta
                            name="twitter:description"
                            content="Boost your career with affordable paid IT courses at Earning Planner Institute. Get certified, hands-on training in high-demand tech skills."
                        />
                        <meta name="twitter:image" content="https://earningplaner.com/Paid%Courses.jpg" /> {/* Replace with your actual image URL */}
                        <meta name="twitter:creator" content="@Earning_Planer" /> {/* Replace with your Twitter handle */}
                    </Helmet>
                )}

            </div>
            <div>
                <Courses courses={courses} heading="Paid Courses" home={home} />
            </div>
        </div>
    );
}

export default PaidCourses;
