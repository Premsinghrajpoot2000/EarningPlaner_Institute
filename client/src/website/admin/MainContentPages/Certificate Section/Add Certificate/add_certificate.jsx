import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import './add_certificate.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import React Datepicker styles
import { format } from 'date-fns'; // Import date-fns format function
import { useNavigate } from 'react-router-dom';


const AddCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [name, setName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [grade, setGrade] = useState('');
  const [courseCompleteDate, setCourseCompleteDate] = useState(null); // Initially set to null
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  // Fetch certificates from backend using async/await
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/certificate/student_certificate_get_all`);
        if (Array.isArray(response.data)) {
          setCertificates(response.data);
        } else {
          console.error('Invalid data format', response.data);
          setCertificates([]); // Default to empty array if the data is not an array
        }
      } catch (error) {
        console.error('Error fetching certificates', error);
        setCertificates([]); // Default to empty array in case of error
      }
    };

    fetchCertificates();
  }, []);

  // Handle form submission (Add Certificate) using async/await
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ask user for confirmation before proceeding
    const isConfirmed = window.confirm("Are you sure you want to add this certificate?");

    if (!isConfirmed) {
      // If user cancels, do not proceed with the POST request
      return;
    }

    // Format the courseCompleteDate in the desired format (dd-MMM-yyyy)
    const formattedDate = courseCompleteDate ? format(courseCompleteDate, 'dd-MMM-yyyy') : '';

    const certificateData = {
      name,
      courseName,
      courseDuration,
      grade,
      courseCompleteDate: formattedDate, // Send formatted date
    };

    try {
      // Send POST request to add certificate
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/certificate/student_certificate_info_post`, certificateData);

      // After successful addition, fetch the updated certificates list
      const getResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/certificate/student_certificate_get_all`);
      if (Array.isArray(getResponse.data)) {
        setCertificates(getResponse.data); // Update the certificates state with the latest data
      } else {
        console.error('Invalid data format', getResponse.data);
        setCertificates([]); // Default to empty array if the data is not an array
      }

      // Inform user of success
      alert('Certificate added successfully!');

      clearForm(); // Clear the form after submission
    } catch (error) {
      console.error('Error adding certificate', error);
      alert('Error adding certificate. Please try again.');
    }
  };

  // Handle delete certificate using async/await
  const handleDelete = async (id) => {
    // Ask for the first confirmation
    const isFirstConfirmed = window.confirm("Are you sure you want to delete this certificate?");

    if (!isFirstConfirmed) {
      setDeletingId(null); // Reset deleting state if the user cancels
      return;
    }

    // Ask for the second confirmation
    const isSecondConfirmed = window.confirm("This action cannot be undone. Are you absolutely sure?");

    if (!isSecondConfirmed) {
      setDeletingId(null); // Reset deleting state if the user cancels
      return;
    }

    try {
      // Disable delete button by setting deletingId
      setDeletingId(id);

      // Send DELETE request to remove certificate
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/certificate/student_certificate_info_delete/?certificate_DB_id=${id}`);

      // Remove the deleted certificate from the local state
      setCertificates(certificates.filter((cert) => cert._id !== id));

      // Inform the user that the deletion was successful
      alert('Certificate deleted successfully!');

      setDeletingId(null); // Reset the deleting state
    } catch (error) {
      console.error('Error deleting certificate', error);
      alert('Error deleting certificate. Please try again.');
      setDeletingId(null); // Reset deleting state on error
    }
  };

  // Handle edit certificate using async/await (for this example, we assume editing involves updating the existing data)
  const handleEdit = (course) => {
    navigate('/admin/editCertificate', { state: { course } });
  };

  // Filter certificates based on search term, ensuring we don't try to call `.toLowerCase()` on undefined or null
  const filteredCertificates = Array.isArray(certificates)
    ? certificates.filter(
      (cert) =>
        (cert.name && cert.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cert.registrationNumber && cert.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];

  // Clear form after adding
  const clearForm = () => {
    setName('');
    setCourseName('');
    setCourseDuration('');
    setGrade('');
    setCourseCompleteDate(null); // Reset to null after adding
  };

  return (
    <div
      className='scroll_style' style={{
        background: "#dadada",
        paddingBottom: "20px",
        height: "100vh",
        overflow: "auto"
      }}
    >
      <div className="container my-4">
        <h2 className="mb-4">Add Certificate</h2>

        {/* Certificate form */}
        <form onSubmit={handleSubmit} className="border p-4 rounded bg-light mb-4">
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
            {/* React Datepicker */}
            <br />
            <DatePicker
              id="courseCompleteDate"
              className="form-control mb-3"
              selected={courseCompleteDate}
              onChange={(date) => setCourseCompleteDate(date)}
              dateFormat="dd-MMM-yyyy"  // Format the date picker as dd-MMM-yyyy
              placeholderText="Select a date"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Add Certificate</button>
        </form>

        {/* Search Field */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name or Registration Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Certificates List */}
        <h3>Certificates List</h3>
        <ul className="list-group">
          {filteredCertificates.reverse().map((cert, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center row">
              <span className='col-md-9 col-sm-8 col-6'>{cert.name} - {cert.registrationNumber}</span>
              <div className='col-md-3 col-sm-4 col-6'>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(cert)}
                >
                  Edit
                </button>
                <button
                  disabled={deletingId === cert._id}
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(cert._id)}
                >
                  {deletingId === cert._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddCertificate;
