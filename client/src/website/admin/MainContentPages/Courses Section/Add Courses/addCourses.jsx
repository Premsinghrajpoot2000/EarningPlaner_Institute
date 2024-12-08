import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../../user/Loading/Loading';

function AddCourses() {
    const [courseType, setCourseType] = useState('free'); // Default to free course
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseDetails, setCourseDetails] = useState({
        title: '',
        duration: '',
        mode: '',
        liveSessions: '',
        projects: '',
        image: null,
        playlist_id: '', // Added for free courses
        modules: [], // Only for paid courses
    });
    const [imageError, setImageError] = useState('');
    const [gifImage, setGifImage] = useState(null);
    const [gifError, setGifError] = useState('');
    const [moduleContent, setModuleContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // State for managing submit state
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [deletingCourseId, setDeletingCourseId] = useState(null);  // State for tracking which course is being deleted


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/courses/userAllCoursesGet`);
                if (Array.isArray(response.data)) {
                    setCourses(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                    setCourses([]);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const aspectRatio = img.width / img.height;
                const targetRatio = 16 / 9;
                if (Math.abs(aspectRatio - targetRatio) > 0.01) { // Tolerance for slight variations
                    setImageError('Image aspect ratio must be 16:9.');
                    setCourseDetails((prevDetails) => ({ ...prevDetails, image: null }));
                    e.target.value = ''; // Clear the input
                } else {
                    setImageError('');
                    setCourseDetails((prevDetails) => ({ ...prevDetails, image: file }));
                }
            };
            
        }
    };

    const handleGifFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validExtensions = ['gif'];
            const isValidExtension = validExtensions.includes(file.name.split('.').pop().toLowerCase());

            if (!isValidExtension) {
                setGifError('Only GIF files are allowed.');
                setGifImage(null);
                e.target.value = '';
            } else {
                setGifError('');
                setGifImage(file);
            }
        }
    };

    const handleModuleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedModules = [...courseDetails.modules];
        updatedModules[index][name] = value; // Update only the specific field

        setCourseDetails((prevDetails) => ({
            ...prevDetails,
            modules: updatedModules,
        }));
    };

    const addModule = () => {
        setCourseDetails((prevDetails) => ({
            ...prevDetails,
            modules: [...prevDetails.modules, { title: '', liveClasses: '', projects: '', assignments: '', content: [] }],
        }));
    };

    const addContentToModule = (index) => {
        if (moduleContent.trim()) {
            const updatedModules = [...courseDetails.modules];
            updatedModules[index].content.push(moduleContent.trim());
            setCourseDetails((prevDetails) => ({
                ...prevDetails,
                modules: updatedModules,
            }));
            setModuleContent(''); // Clear input after adding content
        } else {
            alert("Please enter some content.");
        }
    };

    const removeContentFromModule = (moduleIndex, contentIndex) => {
        const updatedModules = [...courseDetails.modules];
        updatedModules[moduleIndex].content.splice(contentIndex, 1); // Remove the content at the specified index
        setCourseDetails((prevDetails) => ({
            ...prevDetails,
            modules: updatedModules,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirmation before submitting
        const confirmSubmit = window.confirm("Are you sure you want to add this course?");
        if (!confirmSubmit) {
            return; // Exit if the user cancels
        }

        // Validation for paid courses
        if (courseType === 'paid' && (!courseDetails.modules.length || !courseDetails.modules.some(module => module.title && module.liveClasses))) {
            alert('Please fill out at least one module completely.');
            return; // Exit if validation fails
        }

        setIsSubmitting(true); // Set loading state

        const courseData = { ...courseDetails };

        // If the course is free, remove modules from the data
        if (courseType === 'free') {
            delete courseData.modules;
            delete courseData.gifImage;
            delete courseData.mode;
            delete courseData.liveSessions;
            delete courseData.projects;
        } else {
            delete courseData.playlist_id;
        }

        // Prepare form data for image and GIF upload
        const formData = new FormData();
        Object.keys(courseData).forEach((key) => {
            if (key === 'image') {
                formData.append(key, courseData.image);
            } else if (key === 'modules') {
                formData.append(key, JSON.stringify(courseData.modules));
            } else {
                formData.append(key, courseData[key]);
            }
        });

        // Include gifImage in the form data
        if (gifImage) {
            formData.append('gifImage', gifImage);
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/courses/userCoursePost`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 201) {
                alert('Course added successfully!');
                setCourses((prevCourses) => [...prevCourses, response.data.course]);

                // Reset form fields after successful submission
                setCourseDetails({
                    title: '',
                    duration: '',
                    mode: '',
                    liveSessions: '',
                    projects: '',
                    image: null,
                    playlist_id: '',
                    modules: [],
                });
                document.querySelector('input[type=file]').value = '';
                setGifImage(null); // Reset GIF image
                setSearchTerm('');
                setCourseType('free'); // Reset course type to free
            }
        } catch (error) {
            console.error('Error adding course:', error);
            alert(error.response.data.error_msg);
        } finally {
            setIsSubmitting(false); // Reset loading state
        }
    };


    const handleEdit = (course) => {
        navigate('/admin/edit', { state: { course } });
    };

    const handleDelete = async (course) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            setDeletingCourseId(course._id); // Mark the course as being deleted
            try {
                let url = `${import.meta.env.VITE_SERVER_URL}/courses/userDeleteCourse/${course._id}?courseImage_url=${course.image}`;
                if (course.gifImage) {
                    url += `&courseGif_url=${course.gifImage}`;
                }
                await axios.delete(url);

                // Update the courses state to remove the deleted course
                setCourses((prevCourses) => prevCourses.filter(courses => courses._id !== course._id));

                // Show success alert
                alert('Course successfully deleted!');

                // Reset the deleting state after success
                setDeletingCourseId(null);
            } catch (error) {
                console.error('Error deleting course:', error);

                // Show error alert
                alert('There was an error deleting the course. Please try again.');

                // Reset the deleting state after error
                setDeletingCourseId(null);
            }
        }
    };

    const filteredCourses = courses.filter(course =>
        (courseType === 'free' && !course.modules) ||
        (courseType === 'paid' && course.modules)
    ).filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()));

    // Function to extract playlist ID from YouTube URL
    const extractPlaylistId = (url) => {
        const regex = /list=([a-zA-Z0-9_-]+)/;
        const match = url.match(regex);
        return match ? match[1] : '';
    };

    const handlePlaylistIdBlur = (e) => {
        const value = e.target.value;
        const playlistId = extractPlaylistId(value);
        if (playlistId) {
            [
                setCourseDetails((prevDetails) => ({
                    ...prevDetails,
                    playlist_id: playlistId,
                }))
            ]
        } else {
            setCourseDetails((prevDetails) => ({
                ...prevDetails,
                playlist_id: value,
            }))
        }
    };

    const deleteModule = (index) => {
        const updatedModules = [...courseDetails.modules];
        updatedModules.splice(index, 1); // Remove the module at the specified index
        setCourseDetails((prevDetails) => ({
            ...prevDetails,
            modules: updatedModules,
        }));
    };

    useEffect(() => {
        if (courseType === 'paid') {
            // Reset the file input if courseType is not 'paid'
            fileInputRef.current.value = '';
        }
    }, [courseType]);

    if (loading) {
        return <Loading />;
    }

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
                <h2 className="mb-4">Add Course</h2>
                <div className="mb-3">
                    <button className="btn btn-primary me-2" onClick={() => setCourseType('free')}>Free Course</button>
                    <button className="btn btn-success" onClick={() => setCourseType('paid')}>Paid Course</button>
                </div>
                <form onSubmit={handleSubmit} className="border p-4 rounded bg-light mb-4">
                    <div className="mb-3">
                        <label className="form-label">Title:</label>
                        <input type="text" className="form-control" name="title" value={courseDetails.title} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Duration:</label>
                        <input type="text" className="form-control" name="duration" value={courseDetails.duration} onChange={handleChange} required />
                    </div>

                    {courseType === 'paid' && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Mode:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="mode"
                                    value={courseDetails.mode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Live Sessions:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="liveSessions"
                                    value={courseDetails.liveSessions}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Projects:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="projects"
                                    value={courseDetails.projects}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Assignments:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="assignments"
                                    value={courseDetails.assignments}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    {courseType === 'free' && (
                        <div className="mb-3">
                            <label className="form-label">Playlist ID:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="playlist_id"
                                value={courseDetails.playlist_id}
                                onChange={handleChange}
                                onBlur={handlePlaylistIdBlur}
                                required
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Upload Image:</label>
                        <input type="file" className="form-control" onChange={handleFileChange} required />
                        {imageError && <div className="text-danger mt-2">{imageError}</div>}
                    </div>
                    {courseType === 'paid' && (
                        <div className="mb-3">
                            <label className="form-label">Upload GIF Image:</label>
                            <input type="file" ref={fileInputRef} className="form-control" onChange={handleGifFileChange} required />
                            {gifError && <div className="text-danger mt-2">{gifError}</div>}
                        </div>
                    )}

                    {courseType === 'paid' && (
                        <div>
                            <h3 className="mb-3">Modules</h3>
                            {courseDetails.modules.map((module, index) => (
                                <div key={index} className="mb-4 p-3 border rounded bg-light">
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h5>Module {index + 1}</h5>
                                        <button
                                            type="button"
                                            className="btn btn-danger mt-2"
                                            onClick={() => deleteModule(index)} // Call delete function on click
                                        >
                                            <i className="fa-regular fa-trash-can"></i>
                                        </button>
                                    </div>
                                    <label className="form-label">Module Title:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={module.title}
                                        onChange={(e) => handleModuleChange(index, e)}
                                        required
                                    />
                                    <label className="form-label">Live Classes:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="liveClasses"
                                        value={module.liveClasses}
                                        onChange={(e) => handleModuleChange(index, e)}
                                        required
                                    />
                                    <label className="form-label">Projects:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="projects"
                                        value={module.projects}
                                        onChange={(e) => handleModuleChange(index, e)}
                                    />
                                    <label className="form-label">Assignments:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="assignments"
                                        value={module.assignments}
                                        onChange={(e) => handleModuleChange(index, e)}
                                    />
                                    <label className="form-label">Content:</label>
                                    <div className="d-flex">
                                        <textarea
                                            className="form-control me-2"
                                            value={moduleContent}
                                            onChange={(e) => setModuleContent(e.target.value)}
                                            placeholder="Add content here..."
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <strong>Current Content:</strong>
                                        {module.content.map((content, contentIndex) => (
                                            <div key={contentIndex} className="d-flex justify-content-between align-items-center mb-2">
                                                <span>{content}</span>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm ms-2"
                                                    onClick={() => removeContentFromModule(index, contentIndex)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary mt-2 mx-2"
                                        onClick={() => addContentToModule(index)}
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="btn btn-dark" onClick={addModule}>Add Module</button>
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary mt-3 w-100" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <h3>Course List</h3>
                <ul className="list-group">
                    {filteredCourses.reverse().map((course, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center row">
                            <div className="col-md-9 col-sm-8 col-6">
                                {course.title}
                            </div>
                            <div className="col-md-3 col-sm-4 col-6">
                                <button className="btn btn-info btn-sm me-2" onClick={() => handleEdit(course)}>Edit</button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(course)}
                                    disabled={deletingCourseId === course._id} // Disable the button if the course is being deleted
                                >
                                    {deletingCourseId === course._id ? 'Deleting...' : 'Delete'} {/* Show Deleting... text */}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AddCourses;
