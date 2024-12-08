import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // New state for loading
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Set loading to true when the login process starts
        setIsLoading(true);
        
        try {
            let response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/admin_login_get?email_id=${email}&password=${password}`);
            
            if (response.data.message) {
                sessionStorage.setItem('token', true);
                navigate('/admin');
            }
        } catch (error) {
            console.error("Login failed", error);
            // Show error message in alert
            alert("An error occurred while logging in. Please try again.");
        } finally {
            // Set loading to false after the response or error is handled
            setIsLoading(false);
        }
    };

    return (
        <div style={{ background: "#dadada" }}>
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="card p-4 shadow " style={{ width: '400px' }}>
                    <h2 className="text-center mb-4">Admin Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100" 
                            disabled={isLoading}  // Disable button if loading
                        >
                            {isLoading ? 'Logging...' : 'Login'}  {/* Change button text */}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
