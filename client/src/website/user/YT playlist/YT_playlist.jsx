import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import "./YT_playlist.css";
import Loading from '../Loading/Loading';
import NavBar from '../Nav Bar/nav_bar';
import { Helmet } from 'react-helmet';

const YtPlaylist = () => {
    const location = useLocation();
    const course = location.state;
    const query = new URLSearchParams(location.search);
    const playlistId = query.get('list');
    const playlistTitle = query.get('title');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [playingVideoId, setPlayingVideoId] = useState(null); // Track the currently playing video
    const [expandedDescription, setExpandedDescription] = useState(null); // Track expanded description state
    const videosPerPage = 9; // Set videos per page to 9
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY; // Accessing API key

    // Utility function to clean description and remove unwanted part after "*FOLLOW / CONTACT US ON SOCIAL MEDIA :-*"
    const cleanDescription = (description) => {
        const splitText = "*FOLLOW / CONTACT US ON SOCIAL MEDIA :-*";
        const index = description.indexOf(splitText);
        return index !== -1 ? description.slice(0, index).trim() : description;
    };

    useEffect(() => {
        const fetchPlaylistVideos = async () => {
            if (!playlistId) return; // Check if playlistId is available

            try {
                // Fetch playlist items (video IDs)
                const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
                    params: {
                        part: 'snippet',
                        maxResults: 50,
                        playlistId: playlistId,
                        key: apiKey,
                    },
                });

                // Get video details for each video in the playlist
                const videoDetailsPromises = response.data.items.map(async (item) => {
                    const videoId = item.snippet.resourceId.videoId;

                    const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                        params: {
                            part: 'snippet,statistics',
                            id: videoId,
                            key: apiKey,
                        },
                    });

                    const videoData = videoResponse.data.items[0];

                    return {
                        videoId,
                        title: videoData.snippet.title,
                        description: cleanDescription(videoData.snippet.description), // Clean description
                        views: videoData.statistics?.viewCount,  // Optional chaining
                        likes: videoData.statistics?.likeCount || 0,  // Ensure likes are returned or default to 0
                    };
                });

                // Resolve all video details and set the state
                const videoDetails = await Promise.all(videoDetailsPromises);
                setVideos(videoDetails);

            } catch (error) {
                console.error('Error fetching playlist videos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylistVideos();
    }, [playlistId, apiKey]);

    if (loading) {
        return <Loading />;
    }

    const totalPages = Math.ceil(videos.length / videosPerPage);
    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleVideoPlay = (videoId) => {
        // Set the new video as currently playing
        setPlayingVideoId(videoId);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

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
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button onClick={() => paginate(currentPage - 1)} className="page-link">&laquo;</button>
                    </li>
                    {startPage > 1 && (
                        <>
                            <li className="page-item">
                                <button onClick={() => paginate(1)} className="page-link">1</button>
                            </li>
                            {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                        </>
                    )}
                    {pageNumbers.map(number => (
                        <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                            <button onClick={() => paginate(number)} className="page-link">{number}</button>
                        </li>
                    ))}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                            <li className="page-item">
                                <button onClick={() => paginate(totalPages)} className="page-link">{totalPages}</button>
                            </li>
                        </>
                    )}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button onClick={() => paginate(currentPage + 1)} className="page-link">&raquo;</button>
                    </li>
                </ul>
            </nav>
        );
    };

    // Function to handle expanding the description
    const handleDescriptionToggle = (videoId) => {
        setExpandedDescription(expandedDescription === videoId ? null : videoId);
    };

    return (
        <div>
            {/* Nav Section */}
            <div>
                <NavBar />
            </div>
            <div>
                <Helmet>
                    {/* Page Title with Dynamic Playlist Title */}
                    <title>{playlistTitle} - Earning Planer</title>

                    {/* Meta Description for SEO with Dynamic Playlist Title */}
                    <meta
                        name="description"
                        content={`Explore the ${playlistTitle} course for free at Earning Planner Institute. Gain practical tech skills and boost your career with hands-on training.`}
                    />

                    {/* Open Graph Tags for social media preview */}
                    <meta property="og:title" content={`${playlistTitle} - Earning Planer`} />
                    <meta
                        property="og:description"
                        content={`Explore the ${playlistTitle} course for free at Earning Planner Institute. Gain practical tech skills and boost your career with hands-on training.`}
                    />
                    <meta property="og:image" content="https://earningplaner.com/YT-playlist-courses.jpg" /> {/* Replace with actual image URL */}
                    <meta property="og:url" content={`https://earningplaner.com/free-courses`} /> {/* Replace with actual dynamic URL */}
                    <meta property="og:type" content="website" />

                    {/* Twitter Card Tags for Twitter preview */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={`${playlistTitle} - Earning Planer`} />
                    <meta
                        name="twitter:description"
                        content={`Explore the ${playlistTitle} course for free at Earning Planner Institute. Gain practical tech skills and boost your career with hands-on training.`}
                    />
                    <meta name="twitter:image" content="https://earningplaner.com/YT-playlist-courses.jpg" /> {/* Replace with actual image URL */}
                    <meta name="twitter:creator" content="@Earning_Planer" /> {/* Replace with your Twitter handle */}
                </Helmet>
            </div>
            <div className="container yt-playlist mt-5">
                <h2 className="text-center mb-4">{playlistTitle}</h2>
                <div className="row">
                    {currentVideos.map((video) => (
                        <div key={video.videoId} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="video-wrapper">
                                    <ReactPlayer
                                        url={`https://www.youtube.com/watch?v=${video.videoId}`}
                                        playing={playingVideoId === video.videoId} // Control playback
                                        controls={true}
                                        width="100%"
                                        height="100%"
                                        className="react-player"
                                        key={playingVideoId} // Change key to reset player
                                        onPlay={() => handleVideoPlay(video.videoId)} // Handle video play
                                    />
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{video.title}</h5>

                                    {/* Description with Show More functionality */}
                                    <p style={{ whiteSpace: 'pre-wrap' }}>
                                        {expandedDescription === video.videoId
                                            ? video.description
                                            : video.description.slice(0, 150) // Limit to 2 lines (~150 characters)
                                        }
                                        {video.description.length > 150 && (
                                            <button
                                                onClick={() => handleDescriptionToggle(video.videoId)}
                                                className="btn btn-link"
                                            >
                                                {expandedDescription === video.videoId ? 'Show Less' : 'Show More'}
                                            </button>
                                        )}
                                    </p>
                                    {/* Views */}
                                    <p><strong>Views:</strong> {video.views ? video.views.toLocaleString() : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {renderPagination()}
            </div>
        </div>
    );
};

export default YtPlaylist;
