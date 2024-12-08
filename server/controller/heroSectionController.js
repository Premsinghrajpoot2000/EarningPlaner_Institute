const cloudinary = require('cloudinary').v2;
const heroSectionModel = require("../model/heroSectionModel");
const streamifier = require('streamifier');

const heroGet = async (req, res) => {
    try {
        let data = await heroSectionModel.find()
        res.status(200).json({
            success: true,
            msg: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

const heroEdit = async (req, res) => {
    const uploadFileToCloudinary = (file, resourceType = 'image') => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                resource_type: resourceType,  // Default is 'image', 'video' for videos
                folder: 'courses',
                allowed_formats: resourceType === 'image' ? ['jpg', 'jpeg', 'png', 'gif','webp'] : ['mp4', 'mov'],  // Allowed formats
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
    try {
        const text = req.body.texts; // Use only the first text
        const objid = req.query.id; // Object ID from query parameters

        let existingData;

        // Check if objid is provided
        if (objid) {
            // Check if the document exists
            existingData = await heroSectionModel.findById(objid);
        }

        if (!existingData && req.files) {
            const imageUrl = await uploadFileToCloudinary(req.files.images, 'image');
            // If no data found and an image is uploaded, create a new document
            const newHeroSection = new heroSectionModel({
                typingText: text,
                images: imageUrl // Store the first image
            });
            await newHeroSection.save();
            return res.status(201).json({ message: 'New hero section created successfully', data: newHeroSection });
        }

        // If objid is provided and an image is uploaded, delete the old image from Cloudinary
        if (existingData) {
            if (req.files) {
                const oldImageId = existingData.images.split('/').pop().split('.')[0]; // Extract public ID
                await cloudinary.uploader.destroy(oldImageId); // Delete old image

                const imageUrl = await uploadFileToCloudinary(req.files.images, 'image');
                // Update with new image URL
                existingData.images = imageUrl; // Assuming req.file.path contains the new image URL
            }

            // Update the text field
            existingData.typingText = text; // Update with the first text

            // Save the updated document
            const updatedData = await existingData.save();
            return res.status(200).json({ message: 'Hero section updated successfully', data: updatedData });
        }

        // If no existing data and no image uploaded, return an appropriate response
        return res.status(400).json({ message: 'No existing hero section found and no image uploaded' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

const heroDelete = async (req, res) => {
    try {
        // Extract the objId from the request parameters or body
        const { objId } = req.query; // or req.body, depending on your setup
        // Check if objId is provided
        if (!objId) {
            return res.status(400).json({ message: "Object ID is required." });
        }
        
        // Find the hero section by objId
        const heroSection = await heroSectionModel.findById(objId);
        
        // Check if the hero section was found
        if (!heroSection) {
            return res.status(404).json({ message: "Hero section not found." });
        }
        const extractPublicId = (url) => {
            const segments = url.split('/');
            return segments[segments.length - 1].split('.')[0]; // This is a basic example
        };
        // Extract the image URL or public ID from the hero section
        const { images } = heroSection; // Adjust this to match your schema
        const publicId = extractPublicId(images); // Implement this function to extract public ID
        
        // Remove the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
        
        // Delete the hero section from the database
        const deletedHeroSection = await heroSectionModel.findByIdAndDelete(objId);

        // Respond with a success message
        return res.status(200).json({ message: "Hero section deleted successfully.", deletedHeroSection });
    } catch (error) {
        // Handle any errors
        console.error(error);
        return res.status(500).json({ message: "An error occurred while deleting the hero section." });
    }
};

module.exports = {
    heroEdit,
    heroGet,
    heroDelete
};
