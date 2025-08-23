const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { sendRegistrationEmail } = require('../config/emailService');
const { upload, handleUploadError, deleteProfilePicture, getFileUrl } = require('../middleware/upload');
const router = express.Router();

// Validation middleware
const validateUserRegistration = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
    body('phone').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please provide a valid phone number'),
    body('skills').optional().trim().isLength({ max: 500 }).withMessage('Skills description too long'),
    body('bio').optional().trim().isLength({ max: 1000 }).withMessage('Bio description too long'),
    body('hourly_rate').optional().isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// 1. Register new user with profile picture
router.post('/register', 
    upload.single('profile_picture'),
    validateUserRegistration,
    handleValidationErrors,
    handleUploadError,
    async (req, res) => {
        try {
            const { name, email, phone, skills, bio, hourly_rate } = req.body;
            const profilePicture = req.file ? req.file.filename : null;

            // Check if user already exists
            const [existingUsers] = await pool.execute(
                'SELECT id FROM users WHERE email = ?',
                [email]
            );

            if (existingUsers.length > 0) {
                // Delete uploaded file if user already exists
                if (profilePicture) {
                    deleteProfilePicture(profilePicture);
                }
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            // Insert new user
            const [result] = await pool.execute(
                `INSERT INTO users (name, email, phone, profile_picture, skills, bio, hourly_rate) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, email, phone, profilePicture, skills || null, bio || null, hourly_rate || null]
            );

            const userId = result.insertId;

            // Send registration confirmation email
            try {
                await sendRegistrationEmail(email, name);
                console.log(`✅ Registration email sent to ${email}`);
            } catch (emailError) {
                console.error('⚠️ Failed to send registration email:', emailError.message);
                // Don't fail registration if email fails
            }

            // Get the created user
            const [newUser] = await pool.execute(
                'SELECT * FROM users WHERE id = ?',
                [userId]
            );

            res.status(201).json({
                success: true,
                message: 'User registered successfully! Welcome to Student Freelancer Workplace! 🎉',
                data: {
                    id: newUser[0].id,
                    name: newUser[0].name,
                    email: newUser[0].email,
                    phone: newUser[0].phone,
                    profile_picture: getFileUrl(newUser[0].profile_picture),
                    skills: newUser[0].skills,
                    bio: newUser[0].bio,
                    hourly_rate: newUser[0].hourly_rate,
                    created_at: newUser[0].created_at
                }
            });

        } catch (error) {
            console.error('❌ User registration error:', error);
            
            // Clean up uploaded file on error
            if (req.file) {
                deleteProfilePicture(req.file.filename);
            }

            res.status(500).json({
                success: false,
                message: 'Failed to register user. Please try again.',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// 2. Get all users (with pagination)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        let query = 'SELECT * FROM users';
        let countQuery = 'SELECT COUNT(*) as total FROM users';
        let params = [];

        if (search) {
            query += ' WHERE name LIKE ? OR email LIKE ? OR skills LIKE ?';
            countQuery += ' WHERE name LIKE ? OR email LIKE ? OR skills LIKE ?';
            const searchParam = `%${search}%`;
            params = [searchParam, searchParam, searchParam];
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        // Get total count
        const [countResult] = await pool.execute(countQuery, search ? params.slice(0, -2) : []);
        const totalUsers = countResult[0].total;

        // Get users
        const [users] = await pool.execute(query, params);

        // Format user data
        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profile_picture: getFileUrl(user.profile_picture),
            skills: user.skills,
            bio: user.bio,
            hourly_rate: user.hourly_rate,
            is_verified: user.is_verified,
            created_at: user.created_at,
            updated_at: user.updated_at
        }));

        res.json({
            success: true,
            message: 'Users retrieved successfully',
            data: {
                users: formattedUsers,
                pagination: {
                    current_page: page,
                    total_pages: Math.ceil(totalUsers / limit),
                    total_users: totalUsers,
                    limit: limit
                }
            }
        });

    } catch (error) {
        console.error('❌ Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve users',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// 3. Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const [users] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];
        const formattedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profile_picture: getFileUrl(user.profile_picture),
            skills: user.skills,
            bio: user.bio,
            hourly_rate: user.hourly_rate,
            is_verified: user.is_verified,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        res.json({
            success: true,
            message: 'User retrieved successfully',
            data: formattedUser
        });

    } catch (error) {
        console.error('❌ Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve user',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// 4. Update user
router.put('/:id', 
    upload.single('profile_picture'),
    validateUserRegistration,
    handleValidationErrors,
    handleUploadError,
    async (req, res) => {
        try {
            const userId = req.params.id;
            const { name, email, phone, skills, bio, hourly_rate } = req.body;
            const profilePicture = req.file ? req.file.filename : null;

            // Check if user exists
            const [existingUsers] = await pool.execute(
                'SELECT * FROM users WHERE id = ?',
                [userId]
            );

            if (existingUsers.length === 0) {
                if (profilePicture) {
                    deleteProfilePicture(profilePicture);
                }
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const existingUser = existingUsers[0];

            // Check if email is being changed and if it's already taken
            if (email !== existingUser.email) {
                const [emailCheck] = await pool.execute(
                    'SELECT id FROM users WHERE email = ? AND id != ?',
                    [email, userId]
                );

                if (emailCheck.length > 0) {
                    if (profilePicture) {
                        deleteProfilePicture(profilePicture);
                    }
                    return res.status(409).json({
                        success: false,
                        message: 'Email is already taken by another user'
                    });
                }
            }

            // Delete old profile picture if new one is uploaded
            if (profilePicture && existingUser.profile_picture) {
                deleteProfilePicture(existingUser.profile_picture);
            }

            // Update user
            const [result] = await pool.execute(
                `UPDATE users 
                 SET name = ?, email = ?, phone = ?, profile_picture = ?, 
                     skills = ?, bio = ?, hourly_rate = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [name, email, phone, profilePicture || existingUser.profile_picture, 
                 skills || null, bio || null, hourly_rate || null, userId]
            );

            if (result.affectedRows === 0) {
                if (profilePicture) {
                    deleteProfilePicture(profilePicture);
                }
                return res.status(400).json({
                    success: false,
                    message: 'Failed to update user'
                });
            }

            // Get updated user
            const [updatedUsers] = await pool.execute(
                'SELECT * FROM users WHERE id = ?',
                [userId]
            );

            const updatedUser = updatedUsers[0];
            const formattedUser = {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profile_picture: getFileUrl(updatedUser.profile_picture),
                skills: updatedUser.skills,
                bio: updatedUser.bio,
                hourly_rate: updatedUser.hourly_rate,
                is_verified: updatedUser.is_verified,
                created_at: updatedUser.created_at,
                updated_at: updatedUser.updated_at
            };

            res.json({
                success: true,
                message: 'User updated successfully',
                data: formattedUser
            });

        } catch (error) {
            console.error('❌ Update user error:', error);
            
            if (req.file) {
                deleteProfilePicture(req.file.filename);
            }

            res.status(500).json({
                success: false,
                message: 'Failed to update user',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// 5. Delete user
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user exists
        const [existingUsers] = await pool.execute(
            'SELECT profile_picture FROM users WHERE id = ?',
            [userId]
        );

        if (existingUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const existingUser = existingUsers[0];

        // Delete profile picture if exists
        if (existingUser.profile_picture) {
            deleteProfilePicture(existingUser.profile_picture);
        }

        // Delete user from database
        const [result] = await pool.execute(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: 'Failed to delete user'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('❌ Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;
