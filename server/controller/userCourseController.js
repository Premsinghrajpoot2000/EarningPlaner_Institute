const cloudinary = require('cloudinary').v2;
const freeCourseModel = require("../model/freeCourseModel");
const paidCourseModel = require("../model/paidCourseModel");
const streamifier = require('streamifier');

const extractPublicId = (url) => {
    // Split the URL by '/' and get the last segment (which is the file path)
    const segments = url.split('/');
    // The public ID is the part before the file extension (in the last segment)
    const publicIdWithExtension = segments[segments.length - 1];
    const publicId = publicIdWithExtension.split('.')[0]; // Remove the file extension
    return publicId;
};
const uploadFileToCloudinary = (file, resourceType = 'image') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: resourceType,  // Default is 'image', 'video' for videos
            folder: 'courses',
            allowed_formats: resourceType === 'image' ? ['jpg', 'jpeg', 'png', 'gif', 'webp'] : ['mp4', 'mov'],  // Allowed formats
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


const userCourseSearch = async (req, res) => {
    try {
        const { search } = req.query; // Get the search query from the request
        if (!search) {
            return res.status(400).json({ message: "Search query is required." });
        }

        // Use a regular expression to perform a case-insensitive search
        const regex = new RegExp(search, 'i'); // 'i' makes the search case-insensitive

        // Find courses where the title matches or is similar to the search query
        const paid_courses = await paidCourseModel.find({ title: { $regex: regex } });
        const free_courses = await freeCourseModel.find({ title: { $regex: regex } });

        // Combine both arrays into total_courses
        const total_courses = [...paid_courses, ...free_courses];

        // Return the combined courses found
        return res.status(200).json(total_courses);
    } catch (error) {
        console.error("Error searching courses:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

const userCoursesGet = async (req, res) => {
    try {
        const courseType = req.params.id;
        let courses;

        if (courseType === "Free") {
            courses = await freeCourseModel.find();
        } else if (courseType === "Paid") {
            courses = await paidCourseModel.find();
        } else {
            return res.status(400).json({
                success: false,
                msg: "Invalid course type"
            });
        }

        return res.status(200).json({
            success: true,
            msg: courses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error_msg: error.message
        });
    }
};

const userPaidOneCourseGet = async (req, res) => {
    try {
        let course_id = req.query.course_id
        let courses = await paidCourseModel.findOne({ course_id });

        if (!courses) {
            return res.status(500).json({
                success: false,
                msg: "not found"
            })
        }

        return res.status(200).json({
            success: true,
            msg: courses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error_msg: error.message
        });
    }
};

const userAllCoursesGet = async (req, res) => {
    try {
        const paid_courses = await paidCourseModel.find();
        const free_courses = await freeCourseModel.find();
        const total_courses = [...paid_courses, ...free_courses];
        return res.status(200).json(total_courses);
    } catch (error) {
        console.error("Error searching courses:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

const userDeleteCourse = async (req, res) => {
    const { courseId } = req.params;
    const { courseImage_url, courseGif_url } = req.query;

    try {
        // Step 1: Remove the image from Cloudinary
        if (courseImage_url) {
            const courseImage_url_publicId = extractPublicId(courseImage_url);
            const publicIdWithFolder = `courses/${courseImage_url_publicId}`;
            await cloudinary.uploader.destroy(publicIdWithFolder);

            if (courseGif_url) {
                const courseGif_url_publicId = extractPublicId(courseGif_url);
                const publicIdWithFolder = `courses/${courseGif_url_publicId}`;
                await cloudinary.uploader.destroy(publicIdWithFolder);
            }

        }

        // Step 2: Delete the course from the database
        const deletedFreeCourse = await freeCourseModel.findByIdAndDelete(courseId);
        const deletedPaidCourse = await paidCourseModel.findByIdAndDelete(courseId);

        if (!deletedFreeCourse && !deletedPaidCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const userCoursePost = async (req, res) => {
    try {
        const { title, duration, mode, liveSessions, projects, modules, playlist_id, assignments } = req.body;
        let imageUrl;
        let gifImageUrl;
        let course_id = title.toLowerCase().replace(/\s+/g, '-')
        let isExist;
        if (modules && modules.length > 0) {
            isExist = await paidCourseModel.findOne({ course_id })
        } else {
            isExist = await freeCourseModel.findOne({ course_id })
        }

        if (isExist) {
            return res.status(500).json({ success: false, error_msg: 'Course Title Already Available', error: error.message });
        }

        // Upload the image if provided
        if (req.files && req.files.image) {
            console.log('Uploading image:', req.files.image.name);
            imageUrl = await uploadFileToCloudinary(req.files.image, 'image');  // Uploading image to Cloudinary
        } else {
            return res.status(400).json({ success: false, error_msg: 'Image is required' });
        }

        // Upload the gifImage if provided
        if (req.files && req.files.gifImage) {
            console.log('Uploading gifImage:', req.files.gifImage.name);
            gifImageUrl = await uploadFileToCloudinary(req.files.gifImage, 'image');  // Uploading gif to Cloudinary as 'image' type
        } else {
            gifImageUrl = null; // In case gifImage is optional, we set it to null if not provided
        }

        // If modules are present, it's a paid course
        if (modules && modules.length > 0) {
            const parsedModules = JSON.parse(modules); // Convert modules from string to object
            const paidCourseData = {
                title,
                course_id,
                duration,
                mode,
                liveSessions,
                projects,
                assignments,
                image: imageUrl,
                gifImage: gifImageUrl,  // Add gifImage URL if available
                modules: parsedModules.map((module, index) => ({
                    id: index + 1,  // Assigning an ID based on the index
                    title: module.title,
                    liveClasses: module.liveClasses,
                    projects: module.projects,
                    assignments: module.assignments,
                    content: module.content,
                })),
            };

            // Save to paidCourseModel
            const paidCourse = new paidCourseModel(paidCourseData);
            await paidCourse.save();
            return res.status(201).json({ message: 'Paid course added successfully!', course: paidCourse });
        } else {
            // If no modules, it's a free course
            const freeCourseData = {
                title,
                course_id,
                duration,
                image: imageUrl,
                playlist_id,  // Required for free courses
            };

            // Save to freeCourseModel
            const freeCourse = new freeCourseModel(freeCourseData);
            await freeCourse.save();
            return res.status(201).json({ message: 'Free course added successfully!', course: freeCourse });
        }
    } catch (error) {
        console.error('Error adding course:', error);
        return res.status(500).json({ success: false, error_msg: 'Internal server error', error: error.message });
    }
};

const userCourseEditPatch = async (req, res) => {
    const { courseId } = req.params; // Get course ID from URL parameters
    let updateData = req.body; // Get update data from the request body
    try {
        let updatedCourse;

        updateData.course_id = updateData.title.toLowerCase().replace(/\s+/g, '-')

        let isExist;
        if (updateData.modules && updateData.modules.length > 0) {
            isExist = await paidCourseModel.findOne({ course_id: updateData.course_id })
        } else {
            isExist = await freeCourseModel.findOne({ course_id: updateData.course_id })
        }

        if (isExist) {
            return res.status(500).json({ success: false, error_msg: 'Course Title Already Available' });
        }

        // Check if updateData contains modules
        if (updateData.modules && updateData.modules.length > 0) {
            // If modules exist, update in paidCourseModel
            updatedCourse = await paidCourseModel.findByIdAndUpdate(courseId, updateData, {
                new: true, // Return the updated document
                runValidators: true // Ensure validation is run on the updated data
            });
        } else {
            // If no modules, update in freeCourseModel
            updatedCourse = await freeCourseModel.findByIdAndUpdate(courseId, updateData, {
                new: true, // Return the updated document
                runValidators: true // Ensure validation is run on the updated data
            });
        }

        if (!updatedCourse) {
            return res.status(404).json({ error_msg: 'Course not found.' });
        }

        // Respond with the updated course data 
        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error_msg: 'Error updating course.', error: error.message });
    }
};

const userCourseImagesEditUploder = async (req, res) => {
    try {
        let { imageurl, userDb_id, confirm } = req.query;

        // Extract the public ID of the image (if exists)
        const courseImage_url_publicId = imageurl ? extractPublicId(imageurl) : null;

        // Check if files are being uploaded (either image or gifImage)
        const isImageUploaded = req.files && req.files.image;
        const isGifImageUploaded = req.files && req.files.gifImage;

        // Only remove the old image from Cloudinary if new image or gifImage is being uploaded
        if (isImageUploaded || isGifImageUploaded) {
            // If the old image URL public ID exists, delete the old image from Cloudinary
            if (courseImage_url_publicId) {
                // If the image is in a folder, ensure that the public ID includes the folder path
                const publicIdWithFolder = `courses/${courseImage_url_publicId}`;
                await cloudinary.uploader.destroy(publicIdWithFolder);
            }
        }

        // Choose the model based on the confirm value
        const courseModel = confirm === 'true' ? paidCourseModel : freeCourseModel;

        // Search for the course data in the selected model
        const courseData = await courseModel.findById(userDb_id);

        if (!courseData) {
            return res.status(404).json({ message: 'Course not found for the provided user ID.' });
        }

        // Update the course data with new image or gifImage if uploaded
        if (isImageUploaded) {
            const imageUrl = await uploadFileToCloudinary(req.files.image, 'image');
            courseData.image = imageUrl; // Update the image URL in course data
        }

        if (isGifImageUploaded) {
            const gifImageUrl = await uploadFileToCloudinary(req.files.gifImage, 'image');
            courseData.gifImage = gifImageUrl; // Update the gifImage URL in course data
        }

        // Save the updated course data
        await courseData.save();

        // Return success response
        res.status(200).json({ success: true, message: 'Image updated successfully.' });

    } catch (error) {
        console.error('Error processing the image update:', error);
        res.status(500).json({ message: 'Error updating image.', error: error.message });
    }
};

module.exports = {
    userCourseSearch,
    userCoursesGet,
    userAllCoursesGet,
    userDeleteCourse,
    userCoursePost,
    userCourseEditPatch,
    userCourseImagesEditUploder,
    userPaidOneCourseGet
}
