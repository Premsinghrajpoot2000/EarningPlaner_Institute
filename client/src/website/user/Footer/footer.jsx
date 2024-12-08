import React from 'react';
import './footer.css'; // Ensure you have the CSS file
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id='footer' className="footer bg-dark text-light py-4 w-100">
            <div className="container">
                <div className="text-center mb-3">
                    <a href="/">
                        <img src="/Footer_logo.png" alt="Earning PLaner Footer Logo" className="img-fluid footer-logo" />
                    </a>
                </div>
                <div className="row text-center">
                    <div className="col-md-4 mb-4">
                        <h5 className='fs-5'>Quick Links</h5>
                        <div className="quick-links">
                            <a href="/">Home</a>
                            <a href="https://earningplaner.blogspot.com/">Blog</a>
                            <Link to="/about-us">About Us</Link>
                            <a href="/terms">FAQ</a>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <h5 className='fs-5'>Follow Us</h5>
                        <div className="follow-us">
                            <a href="https://www.facebook.com/EarningPlaner/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i> Facebook</a>
                            <a href="https://twitter.com/Earning_Planer/" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i> Twitter</a>
                            <a href="https://www.instagram.com/EarningPlaner/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i> Instagram</a>
                            <a href="https://in.pinterest.com/earningplaner/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-pinterest"></i> Pinterest</a>
                            <a href="https://telegram.me/EarningPlaner" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-telegram"></i> Telegram</a>
                            <a href="https://www.linkedin.com/company/earningplaner" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i> LinkedIn</a>
                            <a href="https://www.youtube.com/@EarningPlaner" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i> YouTube</a>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <h5 className='fs-5'><i className="fa-solid fa-envelope"></i> Contact Us</h5>
                        <div className="follow-us">
                            <a href="tel:+91 8209801136" target="_blank" rel="noopener noreferrer">+91 8209801136</a>
                            <a href="tel:+91 9351130765" target="_blank" rel="noopener noreferrer">+91 8003398228</a>
                            <a href="mailto:Ep@earningplaner.com" target="_blank" rel="noopener noreferrer">Ep@earningplaner.com</a>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-3">
                    <p>&copy; {new Date().getFullYear()} <a href="/"> Earning Planer Ins.</a> All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
