import { Link, useNavigate } from "react-router-dom";
import "./nav_bar.css";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);  // Track the window width
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchTerm) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    const togglePopup = () => {
        setShowPopup((prev) => !prev);
    };

    const handleFreeClick = () => {
        navigate("/free-courses");
        setShowPopup(false);
    };

    const handlePaidClick = () => {
        navigate("/paid-courses");
        setShowPopup(false);
    };

    const handleClickOutside = (event) => {
        const popup = document.getElementById("nav_popup");
        if (popup && !popup.contains(event.target)) {
            setShowPopup(false);
        }
    };

    useEffect(() => {
        // Update window width on resize
        const handleResize = () => setWindowWidth(window.innerWidth);
        
        window.addEventListener("resize", handleResize);
        document.addEventListener('scroll', handleClickOutside);
        document.getElementById("nav_courses").addEventListener('mouseleave', handleClickOutside);

        // Cleanup event listeners
        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener('scroll', handleClickOutside);
        };
    }, []);

    return ( 
        <div className="w-100" style={{ height: "60px" }}>
            <nav className="navbar navbar-expand-lg navbar-dark p-0" style={{ top: 0, height: "60px", position: "fixed", width: "100%", zIndex: "2" }}>
                <div style={{ background: "#2090f0" }} className="container">
                    <Link className="navbar-brand p-0" to="/">
                        <img src="/Logo.png" alt="Earning Planer Logo" style={{ width: "60px" }} />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" style={{ marginTop: windowWidth < 992 ? "10px" : "0" }} id="navbarNav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li id="nav_courses" className="nav-item position-relative">
                                <span className="nav-link" onClick={togglePopup} style={{ cursor: "pointer" }}>
                                    Courses
                                </span>
                                {showPopup && (
                                    <div className="position-relative" id="nav_popup" data-aos="fade-in" data-aos-delay="10" data-aos-duration="200">
                                        <div className="dropdown-menu show popup">
                                            <button className="dropdown-item" onClick={handleFreeClick}>Free</button>
                                            <button className="dropdown-item" onClick={handlePaidClick}>Paid</button>
                                        </div>
                                    </div>
                                )}
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/about-us">About Us</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="https://earningplaner.blogspot.com/">Blog</a>
                            </li>
                        </ul>
                        <form className="form-inline d-lg-none d-flex ml-3 mb-3" onSubmit={handleSearchSubmit}>
                            <input
                                className="form-control mr-2"
                                type="search"
                                placeholder="Search courses"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                aria-label="Search"
                            />
                            <button className="btn btn-outline-light mx-2" type="submit">Search</button>
                        </form>
                    </div>
                    <form className="form-inline d-none d-lg-flex ml-3" onSubmit={handleSearchSubmit}>
                        <input
                            className="form-control mr-2"
                            type="search"
                            placeholder="Search courses"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            aria-label="Search"
                        />
                        <button className="btn btn-outline-light mx-2" type="submit">Search</button>
                    </form>
                </div>
            </nav>
        </div>
    );
}

export default NavBar;
