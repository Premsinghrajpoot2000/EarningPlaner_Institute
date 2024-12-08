import './AdminPage.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCourses from './MainContentPages/Courses Section/Add Courses/addCourses';
import HeroSection from './MainContentPages/Hero Section/hero_section';
import AddReviews from './MainContentPages/Student Reviews/Add Reviews/addReviews';
import AddCertificate from './MainContentPages/Certificate Section/Add Certificate/add_certificate';
import { Button, Offcanvas } from 'react-bootstrap';  // Bootstrap components

function AdminPage() {
  const [target, setTarget] = useState('');
  const mediaQuery = window.matchMedia('(max-width: 283px)');

  const refFirst = useRef(null);
  const refSecond = useRef(null);
  const refThird = useRef(null);
  const refFourth = useRef(null);
  const [activeOption, setActiveOption] = useState('Courses'); // Default active option
  const [Adminside, setAdminside] = useState(refFirst);
  const [sidebarVisible, setSidebarVisible] = useState(false); // State for sidebar visibility

  const navigate = useNavigate();
  useEffect(() => {
    let getToken = sessionStorage.getItem('token');
    
    if (!getToken) {
      navigate('/adminLogin'); // Redirect if not authenticated
    }
  }, [navigate]);

  // Side bar click handler
  function sideBarFunction(event) {
    // Reset active class
    refFirst.current.classList.remove('active');
    refSecond.current.classList.remove('active');
    refThird.current.classList.remove('active');
    refFourth.current.classList.remove('active');

    // Add active class to selected menu option
    const option = event.currentTarget.innerText;
    if (option === 'Courses') {
      refFirst.current.classList.add('active');
      setActiveOption('Courses');
      setAdminside(refFirst);
    } else if (option === 'Hero Section') {
      refSecond.current.classList.add('active');
      setActiveOption('Hero Section');
      setAdminside(refSecond);
    } else if (option === 'Student Reviews') {
      refThird.current.classList.add('active');
      setActiveOption('Student Reviews');
      setAdminside(refThird);
    } else if (option === 'Student Certificates') {
      refFourth.current.classList.add('active');
      setActiveOption('Student Certificates');
      setAdminside(refFourth);
    }

    // Close the sidebar on mobile
    if (mediaQuery.matches) {
      setSidebarVisible(false);
    }
  }

  // Show sidebar menu
  const AdminPageMenuShow = () => {
    setSidebarVisible(true); // Show sidebar on button click
  };

  const handleSidebarClose = () => {
    setSidebarVisible(false); // Close sidebar when clicking outside
  };

  // Redirect based on active content
  const getActiveContent = () => {
    if (Adminside === refFirst) return <AddCourses />;
    if (Adminside === refSecond) return <HeroSection />;
    if (Adminside === refThird) return <AddReviews />;
    if (Adminside === refFourth) return <AddCertificate />;
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="d-none d-md-block AdminSidebar">
        <div className="bg-dark text-white vh-100 p-3">
          <div
            className={`sideBarButton ${activeOption === 'Courses' ? 'active' : ''}`}
            onClick={sideBarFunction}
            ref={refFirst}
          >
            Courses
          </div>
          <div
            className={`sideBarButton ${activeOption === 'Hero Section' ? 'active' : ''}`}
            onClick={sideBarFunction}
            ref={refSecond}
          >
            Hero Section
          </div>
          <div
            className={`sideBarButton ${activeOption === 'Student Reviews' ? 'active' : ''}`}
            onClick={sideBarFunction}
            ref={refThird}
          >
            Student Reviews
          </div>
          <div
            className={`sideBarButton ${activeOption === 'Student Certificates' ? 'active' : ''}`}
            onClick={sideBarFunction}
            ref={refFourth}
          >
            Student Certificates
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-100 vh-100" style={{ backgroundColor: 'rgb(218, 218, 218)' }}>
        {getActiveContent()}
      </div>

      {/* Mobile Sidebar (Offcanvas) */}
      <Offcanvas show={sidebarVisible} onHide={handleSidebarClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div
            className={`sideBarButton ${activeOption === 'Courses' ? 'active' : ''}`}
            onClick={sideBarFunction}
            ref={refFirst}
          >
            Courses
          </div>
          <div
            className={`sideBarButton ${activeOption === 'Hero Section' ? 'active' : ''}`}
            onClick={sideBarFunction}
            ref={refSecond}
          >
            Hero Section
          </div>
          <div
            className={`sideBarButton ${activeOption === 'Student Reviews' ? 'active' : ''}`}
            onClick={sideBarFunction}
            ref={refThird}
          >
            Student Reviews
          </div>
          <div
            className={`sideBarButton ${activeOption === 'Student Certificates' ? 'active' : ''}`}
            onClick={sideBarFunction}
            ref={refFourth}
          >
            Student Certificates
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Mobile Menu Icon */}
      <div className="d-block d-md-none position-absolute" style={{right:"10px",top:"10px"}}>
        <Button variant="primary" onClick={AdminPageMenuShow}>
          <i className="fa-solid fa-bars"></i>
        </Button>
      </div>
    </div>
  );
}

export default AdminPage;
