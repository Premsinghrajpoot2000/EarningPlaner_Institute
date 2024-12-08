const studentReviewsModel = require("../model/StudentReviewsModel")
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const extractPublicIdFromUrl = (url) => {
    // Check if the URL is valid and contains the expected structure
    const regex = /(?:image|video)\/upload\/([^\/]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1]; // Return the public_id
    }
    return null; // Return null if the URL is invalid or doesn't match
};
// Helper function to upload a file to Cloudinary
const uploadFileToCloudinary = (file, resourceType = 'image') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: resourceType,  // Default is 'image', 'video' for videos
            folder: 'courses',
            allowed_formats: resourceType === 'image' ? ['jpg', 'jpeg', 'png', 'gif','webp'] : ['mp4', 'mov'],  // Allowed formats
            max_file_size: 100 * 1024 * 1024,  // Set max file size to 100MB (in bytes)
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.secure_url);  // Return the Cloudinary URL of the uploaded file
            }
        });

        // Convert the file buffer to a stream and upload it
        streamifier.createReadStream(file.data).pipe(uploadStream);
    });
};

let studentReviewsGet = async (req, res) => {
    try {
        let allStudentsReviews = await studentReviewsModel.find()
        res.status(200).json({
            success: true,
            msg: allStudentsReviews
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error_msg: error.message
        })
    }
}

const studentReviewsPost = async (req, res) => {
    try {
        const { name, course, rating, comment } = req.body;

        // Initialize Cloudinary URLs for image and video
        let imageUrl = '';
        let videoUrl = '';

        // Upload the image if provided
        if (req.files && req.files.image) {
            console.log('Uploading image:', req.files.image.name);
            imageUrl = await uploadFileToCloudinary(req.files.image, 'image');  // Wait for the image upload to finish
        } else {
            return res.status(400).json({ success: false, error_msg: 'Image is required' });
        }

        // Upload the video if provided
        if (req.files && req.files.video) {
            console.log('Uploading video:', req.files.video.name);
            videoUrl = await uploadFileToCloudinary(req.files.video, 'video');  // Wait for the video upload to finish
        } else {
            return res.status(400).json({ success: false, error_msg: 'Video is required' });
        }

        // Proceed to save the review after both image and video are uploaded
        const newReview = new studentReviewsModel({
            name,
            image: imageUrl,
            video: videoUrl,
            comment,
            rating,
            course,
        });

        const savedReview = await newReview.save();

        // Respond with success and the saved review
        res.status(200).json({
            success: true,
            msg: savedReview,
        });

    } catch (error) {
        console.error('Error processing review:', error);
        res.status(500).json({
            success: false,
            error_msg: error.message,
        });
    }
};

const studentReviewsDelete = async (req, res) => {
    const { imagePublic_url, videoPublic_url, reviewDB_id } = req.query;
    try {
        // Step 1: Extract public IDs from the URLs
        const imagePublicId = imagePublic_url ? extractPublicIdFromUrl(imagePublic_url) : null;
        const videoPublicId = videoPublic_url ? extractPublicIdFromUrl(videoPublic_url) : null;

        // Step 2: Delete the image from Cloudinary (if imagePublicId is valid)
        if (imagePublicId) {
            await cloudinary.uploader.destroy(imagePublicId);
            console.log(`Image with public_id ${imagePublicId} deleted from Cloudinary.`);
        }

        // Step 3: Delete the video from Cloudinary (if videoPublicId is valid)
        if (videoPublicId) {
            await cloudinary.uploader.destroy(videoPublicId);
            console.log(`Video with public_id ${videoPublicId} deleted from Cloudinary.`);
        }

        // Step 4: Find and delete the review from the database using reviewDB_id
        const deletedReview = await studentReviewsModel.findByIdAndDelete(reviewDB_id);

        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // If everything goes well, send success response
        res.status(200).json({ message: 'Review and associated media deleted successfully' });

    } catch (error) {
        console.error('Error deleting review and media:', error);
        res.status(500).json({ message: 'Error deleting review and media' });
    }
};

const studentReviewsPatch = async (req, res) => {
    try {
        const { userDb_id, imageurl, videourl } = req.query;  // Extract query params

        if (!userDb_id) {
            return res.status(400).json({ success: false, error_msg: 'User ID is required' });
        }

        // Find the review data by userDb_id
        const reviewData = await studentReviewsModel.findOne({ _id: userDb_id });

        if (!reviewData) {
            return res.status(404).json({ success: false, error_msg: 'Review not found' });
        }

        let imageUrl = reviewData.image;  // Initialize with current image URL
        let videoUrl = reviewData.video;  // Initialize with current video URL

        // Step 1: Delete the old image if a new image is uploaded
        if (req.files && req.files.image) {
            if (imageurl) {
                // Delete old image from Cloudinary
                const publicId = imageurl.split('/').pop().split('.')[0];  // Extract public_id from URL
                await cloudinary.uploader.destroy(publicId);
                console.log('Old image removed from Cloudinary');
            }

            // Step 2: Upload the new image
            console.log('Uploading new image:', req.files.image.name);
            imageUrl = await uploadFileToCloudinary(req.files.image, 'image');  // Upload image and get URL
        }

        // Step 2: Delete the old video if a new video is uploaded
        if (req.files && req.files.video) {
            if (videourl) {
                // Delete old video from Cloudinary
                const publicId = videourl.split('/').pop().split('.')[0];  // Extract public_id from URL
                await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                console.log('Old video removed from Cloudinary');
            }

            // Step 3: Upload the new video
            console.log('Uploading new video:', req.files.video.name);
            videoUrl = await uploadFileToCloudinary(req.files.video, 'video');  // Upload video and get URL
        }

        // Step 4: Extract other form data (name, comment, course, rating, etc.) and update review data
        const updatedReviewData = {
            name: req.body.name || reviewData.name,
            comment: req.body.comment || reviewData.comment,
            course: req.body.course || reviewData.course,
            rating: req.body.rating || reviewData.rating,
            image: imageUrl,  // Update image URL if changed
            video: videoUrl,  // Update video URL if changed
        };

        // Step 5: Update the review data with the new fields
        const updatedReview = await studentReviewsModel.findByIdAndUpdate(
            userDb_id,
            {
                $set: updatedReviewData  // Set the updated data
            },
            { new: true } // Return the updated document
        );

        if (!updatedReview) {
            return res.status(500).json({ success: false, error_msg: 'Failed to update review' });
        }

        // Step 6: Respond with success
        res.status(200).json({
            success: true,
            message: 'Review updated successfully!',
            updatedReview
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error_msg: 'Server error' });
    }
};

module.exports = {
    studentReviewsGet,
    studentReviewsPost,
    studentReviewsDelete,
    studentReviewsPatch
}