import React, { useEffect, useState } from 'react';
import Home from './website/user/Home/home';
import "./App.css"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import FreeCourses from './website/user/Courses/Free Courses/free_courses';
import PaidCourses from './website/user/Courses/Paid Courses/paid_courses';
import Footer from './website/user/Footer/footer';
import CourseModule from './website/user/Course Module/courseModule';
import AOS from 'aos';
import 'aos/dist/aos.css';
import YtPlaylist from './website/user/YT playlist/YT_playlist';
import Page_Not_Found from './website/user/Error page/page_Not_Found';
import SearchCourse from './website/user/Search Course/search_course';
import AdminPage from './website/admin/AdminPage';
import EditCourses from './website/admin/MainContentPages/Courses Section/Edit Courses/editCourses'
import EditReviews from './website/admin/MainContentPages/Student Reviews/Edit Reviews/editReviews'
import StudentCertificateInfo from './website/user/Student Certificate Info/student_certificate_info';
import EditCertificate from './website/admin/MainContentPages/Certificate Section/Edit Certificate/edit_certificate';
import AdminLogin from './website/admin/Admin Login/admin_login';
import AboutUs from './website/user/About Us/aboutUs';

const App = () => {

  useEffect(() => {
    AOS.init({
      offset: 0,
      duration: 500,
      easing: 'ease-in-out',
    });
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Allcontent />
      </BrowserRouter>
    </div>
  );
}

function Allcontent() {
  let location = useLocation()
  let [ShowHF, setShowHF] = useState(true)
  let index = location.pathname

  useEffect(() => {
    let indexToShowHF = location.pathname === '/admin' 
    || location.pathname === '/admin/' 
    || location.pathname === '/admin/editCertificate/' 
    || location.pathname === '/admin/editCertificate' 
    || location.pathname === '/adminLogin' 
    || location.pathname === '/adminLogin/' 
    || location.pathname === `/admin/edit` 
    || location.pathname === `/admin/edit/` ? false : location.pathname !== `/admin/editReviews`
    setShowHF(indexToShowHF)
  }, [location, index])

  return (
    <div className='body'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/free-courses/info" element={<YtPlaylist />} />
        <Route path='/course/info/:courseTitle' element={<CourseModule />} />
        <Route path='/free-courses' element={<FreeCourses />} />
        <Route path='/paid-courses' element={<PaidCourses />} />
        <Route path='/search' element={<SearchCourse />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/student-certificate' element={<StudentCertificateInfo />} />
        <Route path="/*" element={<Page_Not_Found />} />

        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/admin/edit" element={<EditCourses />} />
        <Route path="/admin/editReviews" element={<EditReviews />} />
        <Route path="/admin/editCertificate" element={<EditCertificate />} />
      </Routes>
      {ShowHF && <div>
        <div>
          <a href="https://wa.link/mzvlws">
            <img style={{ position: "fixed", right: 0, bottom: "10px", width: "70px" }} src="WhatsAppLogo.webp" alt="" />
          </a>
        </div>
        <Footer />
      </div>}
    </div>
  )
}

export default App;