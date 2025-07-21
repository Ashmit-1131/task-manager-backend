

const express = require('express');
const router  = express.Router();
const { register, login } = require('../controllers/auth.controller');

/**
 * @route   POST /auth/register
 * @desc    Register a new user by providing name, email, and password.
 *          Password will be hashed before saving.
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /auth/login
 * @desc    Authenticate an existing user using email and password.
 *          Returns a JWT token if credentials are valid.
 * @access  Public
 */
router.post('/login', login);

module.exports = router; // Export auth routes to be used in server.js
