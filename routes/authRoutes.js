const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Validation middleware
const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
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

// Generate JWT token
const generateToken = (userId, email) => {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );
};

// 1. User Login
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // For now, we'll use a simple check since we don't have password in our current schema
        // In a real application, you would hash passwords and verify them
        // For demo purposes, we'll check if the user exists and return success
        
        // Generate JWT token
        const token = generateToken(user.id, user.email);

        res.json({
            success: true,
            message: 'Login successful! Welcome back! 🎉',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    profile_picture: user.profile_picture ? `/uploads/profile-pictures/${user.profile_picture}` : null,
                    skills: user.skills,
                    bio: user.bio,
                    hourly_rate: user.hourly_rate,
                    is_verified: user.is_verified
                },
                token: token
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// 2. Verify JWT Token (Middleware)
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

// 3. Get current user profile (Protected route)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

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
            profile_picture: user.profile_picture ? `/uploads/profile-pictures/${user.profile_picture}` : null,
            skills: user.skills,
            bio: user.bio,
            hourly_rate: user.hourly_rate,
            is_verified: user.is_verified,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        res.json({
            success: true,
            message: 'Profile retrieved successfully',
            data: formattedUser
        });

    } catch (error) {
        console.error('❌ Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// 4. Update current user profile (Protected route)
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, phone, skills, bio, hourly_rate } = req.body;

        // Check if user exists
        const [existingUsers] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );

        if (existingUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user profile (excluding email for security)
        const [result] = await pool.execute(
            `UPDATE users 
             SET name = ?, phone = ?, skills = ?, bio = ?, 
                 hourly_rate = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [name, phone, skills || null, bio || null, hourly_rate || null, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: 'Failed to update profile'
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
            profile_picture: updatedUser.profile_picture ? `/uploads/profile-pictures/${updatedUser.profile_picture}` : null,
            skills: updatedUser.skills,
            bio: updatedUser.bio,
            hourly_rate: updatedUser.hourly_rate,
            is_verified: updatedUser.is_verified,
            created_at: updatedUser.created_at,
            updated_at: updatedUser.updated_at
        };

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: formattedUser
        });

    } catch (error) {
        console.error('❌ Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// 5. Logout (Client-side token removal)
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful. Please remove the token from your client.'
    });
});

// Export middleware for use in other routes
module.exports = {
    router,
    verifyToken
};
