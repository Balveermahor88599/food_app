import { v2 as cloudinary } from 'cloudinary'

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        const result = await cloudinary.uploader.upload(filePath)  // Optional: specify a folder in Cloudinary
          fs.unlinkSync(filePath); // Delete the local file after upload
        return result.secure_url; // Return the URL of the uploaded image
    } catch (error) {
        fs.unlinkSync(filePath);
        console.error('Cloudinary Upload Error:', error);
        throw new Error('Image upload failed');
    }
};

export default uploadOnCloudinary;