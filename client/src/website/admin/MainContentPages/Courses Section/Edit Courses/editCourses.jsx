import './editCourses.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function EditCourses() {
    const location = useLocation();
    const navigate = useNavigate();  // useNavigate hook for redirection
    useEffect(() => {
        let getToken = sessionStorage.getItem('token');

        if (!getToken) {
            // If token is not found or is empty, redirect to /adminLogin
            navigate('/adminLogin');
        }
    }, [navigate]);  // Adding navigate to dependency array to ensure it's available in useEffect

    const courseData = location.state?.course || {};

    const [title, setTitle] = useState(courseData.title || '');
    const [duration, setDuration] = useState(courseData.duration || '');
    const [mode, setMode] = useState(courseData.mode || '');
    const [liveSessions, setLiveSessions] = useState(courseData.liveSessions || '');
    const [projects, setProjects] = useState(courseData.projects || '');
    const [assignments, setAssignments] = useState(courseData.assignments || '');
    const [modules, setModules] = useState(courseData.modules || []);
    const [image, setImage] = useState(null);
    const [gifImage, setGifImage] = useState(null);
    const [imageError, setImageError] = useState('');
    const [gifError, setGifError] = useState('');
    const [playlistId, setPlaylistId] = useState(courseData.playlist_id || '');
    const [loading, setLoading] = useState(false);
    const [moduleErrors, setModuleErrors] = useState([]);  // Track errors for modules

    const handleInputChange = (setter) => (event) => setter(event.target.value);
    const handleModuleChange = (index, field) => (event) => {
        const updatedModules = [...modules];
        updatedModules[index][field] = event.target.value;
        setModules(updatedModules);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const input = event.target;

        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                const targetRatio = 16 / 9;

                // Check if the aspect ratio is 16:9 (with tolerance for slight variations)
                if (Math.abs(aspectRatio - targetRatio) > 0.01) { // Tolerance of 0.01
                    setImageError('Image must have a 16:9 aspect ratio.');
                    setImage(null);
                    input.value = ''; // Clear the input
                } else {
                    setImageError('');
                    setImage(file);
                }
            };

        }
    };

    const handleGifChange = (event) => {
        const file = event.target.files[0];
        const input = event.target;

        if (file && file.type === 'image/gif') {
            setGifError('');
            setGifImage(file);
        } else {
            setGifError('Please upload a valid GIF image.');
            setGifImage(null);
            input.value = ''; // Clear the input
        }
    };

    // Function to extract playlist ID from YouTube URL
    const extractPlaylistId = (url) => {
        const regex = /(?:list=)([^&]+)/;
        const match = url.match(regex);
        return match ? match[1] : ''; // Return the playlist ID or empty string if not found
    };

    const handlePlaylistIdChange = (event) => {
        const url = event.target.value;
        const extractedId = extractPlaylistId(url);
        if (extractedId) {
            setPlaylistId(extractedId); // Set the extracted playlist ID
        } else {
            setPlaylistId(event.target.value)
        }
    };

    const validateModules = () => {
        // Validate that every module has at least one content
        const errors = modules.map(module => module.content.length === 0);

        setModuleErrors(errors);  // Set the errors for each module
        setTimeout(() => {
            setModuleErrors(modules.map(module => !module.content.length === 0));
        }, 10000);
        return !errors.includes(true);  // Return true if no errors exist
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate modules before submitting
        if (!validateModules()) {
            return;
        }

        const confirmUpdate = window.confirm('Are you sure you want to update this course?');
        if (!confirmUpdate) return;

        setLoading(true); // Set loading to true

        const formData = {
            title,
            duration,
            mode,
            liveSessions,
            projects,
            assignments,
            playlist_id: playlistId, // Add playlist_id to the form data
            modules: modules.length ? modules : undefined,
        };

        try {
            const confirmValue = courseData.modules ? true : false;
            if (image) {
                const imageData = new FormData();
                imageData.append('image', image);
                await axios.patch(
                    `${import.meta.env.VITE_SERVER_URL}/courses/userCourseImagesEditUploder/?imageurl=${courseData.image}&userDb_id=${courseData._id}&confirm=${confirmValue}`,
                    imageData
                );
            }

            if (gifImage) {
                const gifData = new FormData();
                gifData.append('gifImage', gifImage);
                await axios.patch(`${import.meta.env.VITE_SERVER_URL}/courses/userCourseImagesEditUploder/?imageurl=${courseData.gifImage}&userDb_id=${courseData._id}&confirm=${confirmValue}`, gifData);
            }

            await axios.patch(`${import.meta.env.VITE_SERVER_URL}/courses/userCourseEditPatch/${courseData._id}`, formData);
            alert('Data successfully updated!'); // Show success message
        } catch (error) {
            console.error(error);
            alert(error.response.data.error_msg);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const handleExitButtonClick = () => {
        navigate('/admin');
    };

    const addModule = () => {
        setModules([...modules, { title: '', liveClasses: '', projects: '', assignments: '', content: [], isExpanded: true }]);
    };

    const deleteModule = (index) => {
        const confirmUpdate = window.confirm('Are you sure you want to Delete this Module?');
        if (!confirmUpdate) return;
        const updatedModules = modules.filter((_, i) => i !== index);
        setModules(updatedModules);
    };

    const addContentToModule = (index) => {
        const updatedModules = [...modules];
        updatedModules[index].content.push('');
        setModules(updatedModules);
    };

    const handleContentChange = (moduleIndex, contentIndex) => (event) => {
        const updatedModules = [...modules];
        updatedModules[moduleIndex].content[contentIndex] = event.target.value;
        setModules(updatedModules);
    };

    const deleteContentField = (moduleIndex, contentIndex) => {
        const updatedModules = [...modules];
        updatedModules[moduleIndex].content.splice(contentIndex, 1);
        setModules(updatedModules);
    };

    // Function to move the module up
    const moveModuleUp = (index) => {
        if (index > 0) {
            const updatedModules = [...modules];
            const [removedModule] = updatedModules.splice(index, 1);
            updatedModules.splice(index - 1, 0, removedModule);
            setModules(updatedModules);
        }
    };

    // Function to move the module down
    const moveModuleDown = (index) => {
        if (index < modules.length - 1) {
            const updatedModules = [...modules];
            const [removedModule] = updatedModules.splice(index, 1);
            updatedModules.splice(index + 1, 0, removedModule);
            setModules(updatedModules);
        }
    };

    const hasModuleName = modules.some(module => module.title); // Check if any module has a title

    const isPaidCourse = !!modules.length; // Check if the course is paid (has modules)

    const toggleModuleExpansion = (index) => {
        const updatedModules = [...modules];
        updatedModules[index].isExpanded = !updatedModules[index].isExpanded;
        setModules(updatedModules);
    };

    const handleOnDragEnd = (result, moduleIndex) => {
        if (!result.destination) return;

        const updatedModules = [...modules];
        const [reorderedItem] = updatedModules[moduleIndex].content.splice(result.source.index, 1);
        updatedModules[moduleIndex].content.splice(result.destination.index, 0, reorderedItem);
        setModules(updatedModules);
    };

    return (
        <div className='scroll_style' style={{
            background: "#dadada",
            paddingBottom: "20px",
            height: "100vh",
            overflow: "auto"
        }}>
            <div className='container'>
                <button className='btn btn-secondary my-3' onClick={handleExitButtonClick}>
                    <i className="fa-solid fa-left-to-bracket"></i> Exit
                </button>
                <div className='card mb-5'>
                    <div className='card-body'>
                        <h5 className='card-title'>Edit Course Information</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className='form-label'>Course Title</label>
                                <input type='text' className='form-control' value={title} onChange={handleInputChange(setTitle)} required />
                            </div>
                            <div className="mb-3">
                                <label className='form-label'>Duration</label>
                                <input type='text' className='form-control' value={duration} onChange={handleInputChange(setDuration)} required />
                            </div>

                            {/* Show Mode, Live Sessions, Projects, and Assignments only if the course is paid */}
                            {isPaidCourse && (
                                <>
                                    <div className="mb-3">
                                        <label className='form-label'>Mode</label>
                                        <input type='text' className='form-control' value={mode} onChange={handleInputChange(setMode)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>Live Sessions</label>
                                        <input type='text' className='form-control' value={liveSessions} onChange={handleInputChange(setLiveSessions)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>Projects</label>
                                        <input type='text' className='form-control' value={projects} onChange={handleInputChange(setProjects)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>Assignments</label>
                                        <input type='text' className='form-control' value={assignments} onChange={handleInputChange(setAssignments)} />
                                    </div>
                                </>
                            )}

                            {!isPaidCourse && (
                                <div className="mb-3">
                                    <label className="form-label">Playlist ID:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="playlist_id"
                                        value={playlistId}
                                        onChange={(e) => setPlaylistId(e.target.value)}
                                        onBlur={(e) => handlePlaylistIdChange(e)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label">Upload Image:</label>
                                <input type="file" className="form-control" onChange={handleImageChange} />
                                {imageError && <div className="text-danger mt-2">{imageError}</div>}
                            </div>
                            {/* Show Image Upload for paid courses */}
                            {isPaidCourse && (
                                <div className="mb-3">
                                    <label className='form-label'>Upload GIF Image</label>
                                    <input type='file' className='form-control' accept="gif" onChange={handleGifChange} />
                                    {gifError && <div className="text-danger mt-2">{gifError}</div>}
                                </div>
                            )}

                            {modules.length > 0 && (
                                <div>
                                    <h5 className='mt-4'>Modules</h5>
                                    {modules.map((module, moduleIndex) => (
                                        <div key={moduleIndex} className='mb-3 border p-3 rounded'>
                                            <div className="d-flex justify-content-between">
                                                <h6 className="mb-0">{module.title}</h6>
                                                <div>
                                                    {/* Show/Hide button */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-info btn-sm"
                                                        onClick={() => toggleModuleExpansion(moduleIndex)}
                                                    >
                                                        {module.isExpanded ? 'Hide' : 'Show'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Show/Hide content based on expansion */}
                                            {module.isExpanded && (
                                                <div className="mt-3">
                                                    <div className="mb-2">
                                                        <label className='form-label'>Module Title</label>
                                                        <input
                                                            type='text'
                                                            className='form-control'
                                                            value={module.title}
                                                            onChange={handleModuleChange(moduleIndex, 'title')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className='form-label'>Live Classes</label>
                                                        <input
                                                            type='text'
                                                            className='form-control'
                                                            value={module.liveClasses}
                                                            onChange={handleModuleChange(moduleIndex, 'liveClasses')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className='form-label'>Projects</label>
                                                        <input
                                                            type='text'
                                                            className='form-control'
                                                            value={module.projects}
                                                            onChange={handleModuleChange(moduleIndex, 'projects')}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className='form-label'>Assignments</label>
                                                        <input
                                                            type='text'
                                                            className='form-control'
                                                            value={module.assignments}
                                                            onChange={handleModuleChange(moduleIndex, 'assignments')}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className='form-label'>Content:</label>
                                                        {module.content.map((content, contentIndex) => (
                                                            <div key={contentIndex} className="d-flex mb-2">
                                                                <input
                                                                    type='text'
                                                                    className='form-control me-2'
                                                                    value={content}
                                                                    onChange={handleContentChange(moduleIndex, contentIndex)}
                                                                    placeholder="Add content here..."
                                                                    required
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger"
                                                                    onClick={() => deleteContentField(moduleIndex, contentIndex)}
                                                                >
                                                                    <i className="fa-regular fa-trash-can"></i>
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <br />
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary mt-2"
                                                            onClick={() => addContentToModule(moduleIndex)}
                                                        >
                                                            <i className="fa-solid fa-plus"></i> Add Content
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Delete Module and Up/Down Buttons */}
                                            <div className="d-flex justify-content-between align-items-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger mt-2"
                                                    onClick={() => deleteModule(moduleIndex)}
                                                >
                                                    <i className="fa-regular fa-trash-can"></i> Delete Module
                                                </button>
                                                {!module.isExpanded && <div>
                                                    {/* Move Up and Move Down buttons */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-sm mx-1"
                                                        onClick={() => moveModuleUp(moduleIndex)}
                                                    >
                                                        <i className="fa-solid fa-arrow-up"></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-sm mx-1"
                                                        onClick={() => moveModuleDown(moduleIndex)}
                                                    >
                                                        <i className="fa-solid fa-arrow-down"></i>
                                                    </button>
                                                </div>}
                                            </div>
                                            {moduleErrors[moduleIndex] && <p className="text-danger p-0 mt-2 m-0">Please add at least one content in this module.</p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {isPaidCourse && <button type="button" className='btn btn-success w-100 mb-3' onClick={addModule}>
                                Add Module
                            </button>}

                            <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditCourses;
