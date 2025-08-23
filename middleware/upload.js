const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads/profile-pictures';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = `profile-${uniqueSuffix}${fileExtension}`;
        cb(null, fileName);
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
        files: 1 // Only allow 1 file
    },
    fileFilter: fileFilter
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Only one file is allowed.'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'File upload error: ' + error.message
        });
    } else if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next();
};

// Helper function to delete old profile picture
const deleteProfilePicture = (filename) => {
    if (filename && filename !== 'default-profile.jpg') {
        const filePath = path.join(uploadDir, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Deleted old profile picture: ${filename}`);
        }
    }
};

// Helper function to get file URL
const getFileUrl = (filename) => {
    if (!filename) return null;
    return `/uploads/profile-pictures/${filename}`;
};

module.exports = {
    upload,
    handleUploadError,
    deleteProfilePicture,
    getFileUrl,
    uploadDir
};
