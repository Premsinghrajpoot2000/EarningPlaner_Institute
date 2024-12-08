import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./courses.css";
import { Link } from "react-router-dom";

const Courses = ({ courses, heading, home, database }) => {
  const coursesPerPage = home ? 6 : 9; // Show 6 courses if 'home' is true, otherwise 10
  const [currentPage, setCurrentPage] = useState(1);
  const [shuffledCourses, setShuffledCourses] = useState([]);

  useEffect(() => {
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
      return array;
    };

    setShuffledCourses(shuffleArray([...courses])); // Shuffle and set courses
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = shuffledCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const totalPages = Math.ceil(shuffledCourses.length / coursesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    if (home || totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPageNumbers = 5;
    let startPage, endPage;

    if (totalPages <= maxPageNumbers) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxPageNumbers;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - (maxPageNumbers - 1);
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              onClick={() => paginate(currentPage - 1)}
              className="page-link"
            >
              &laquo;
            </button>
          </li>
          {startPage > 1 && (
            <>
              <li className="page-item">
                <button onClick={() => paginate(1)} className="page-link">
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${number === currentPage ? "active" : ""}`}
            >
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button
                  onClick={() => paginate(totalPages)}
                  className="page-link"
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              onClick={() => paginate(currentPage + 1)}
              className="page-link"
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container courses_container mt-2">
      <h2 className={`text-center mb-4 ${home ? "d-none" : "d-block"}`}>
        {heading}
      </h2>
      <div className="row courses_row w-100" >
        {currentCourses.map((course, index) => (
          <div
            key={index}
            data-aos="zoom-in-up"
            className="col-md-4 mb-4 courses_card"
          >
            <Link
              className="text-decoration-none text-black courses_link_card"
              to={
                course.playlist_id
                  ? `/free-courses/info?list=${course.playlist_id}&title=${course.title}`
                  : `/course/info/${course.title.toLowerCase().replace(/\s+/g, '-')}`
              }
            >
              <div className="courses_wrapper">
                {database && (
                  <div
                    className={`badge ${
                      course.modules ? "bg-success" : "bg-primary"
                    }`}
                  >
                    {course.modules ? "Paid" : "Free"}
                  </div>
                )}
                <img
                  src={course.image}
                  alt={course.title}
                  className="img-fluid mb-3 course-image"
                />
                {/* Course Title */}
                <h5 className="course-title">{course.title}</h5>

                {/* Course Duration */}
                <p className="course-duration">
                  <i className="fas fa-clock"></i> {course.duration}
                </p>

                <div className="row course-widgets">
                  {/* Left Column for Live Sessions and mode */}
                  <div className="col-lg-6 col-md-12 col-6">
                    {/* Live Sessions Widget */}
                    {course.liveSessions && course.liveSessions.length > 0 && (
                      <div className="course-widget live-session-widget">
                        <i className="fas fa-video"></i> {/* Icon */}
                        <span>
                          {course.liveSessions.length?"Live Session(s)":""}
                        </span>
                      </div>
                    )}
                    {/* Mode Widget */}
                    {course.mode && course.mode.length > 0 && (
                      <div className="course-widget assignment-widget">
                        <i className="fa-solid fa-laptop"></i> {/* Icon */}
                        <span>{course.mode}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column for Projects and Assignments */}
                  <div className="col-lg-6 col-md-12 col-6">
                    {/* Projects Widget */}
                    {course.projects && course.projects.length > 0 && (
                      <div className="course-widget project-widget">
                        <i className="fas fa-clipboard-list"></i> {/* Icon */}
                        <span>{course.projects.length?"Project(s)":""}</span>
                      </div>
                    )}

                    {/* Assignments Widget */}
                    {course.assignments && course.assignments.length > 0 && (
                      <div className="course-widget assignment-widget">
                        <i className="fas fa-tasks"></i> {/* Icon */}
                        <span>{course.assignments.length?"Assignment(s)":""}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {renderPagination()}
    </div>
  );}

export default Courses;