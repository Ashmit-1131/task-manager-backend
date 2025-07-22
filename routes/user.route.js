

const express = require('express');
const router  = express.Router();
const { register, login } = require('../controllers/auth.controller');

/**
 *   POST /auth/register
 *    Register a new user by providing name, email, and password.
 *          Password will be hashed before saving.
 * Public
 */
router.post('/register', register);

/**
 * POST /auth/login
 *  Authenticate an existing user using email and password.
 *          Returns a JWT token if credentials are valid.
 * Public
 */
router.post('/login', login);

module.exports = router; // Export auth routes to be used in server.js
