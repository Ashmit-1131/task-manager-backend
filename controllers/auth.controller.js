const User   = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

/**
 * register
 * --------
 * Registers a new user by validating that the email isn't already in use,
 * hashing the provided password, and saving the user record in the database.
 * Responds with a success message or an error if registration fails.
 *
 * @param {object} req  - Express request object containing `name`, `email`, and `password` in body
 * @param {object} res  - Express response object used to send status and JSON
 * @returns {Promise<void>}
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if the email is already registered
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // hash the password before storing
    const hashedPw = await bcrypt.hash(password, 10);

    // create a new user document with an empty tasks array
    user = new User({ name, email, password: hashedPw, tasks: [] });
    await user.save();

    // Respond with a 201 Created status
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    // In case of any server error, log and respond with 500
    res.status(500).json({ error: err.message });
  }
};

/**
 * login
 * -----
 * Authenticates an existing user by comparing the provided password with the
 * stored hashed password. If valid, issues a JWT token for future requests.
 * Responds with the token or an error if authentication fails.
 *
 * @param {object} req  - Express request object containing `email` and `password` in body
 * @param {object} res  - Express response object used to send status and JSON
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare provided password with the stored hash
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT with user ID payload
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token back to the client
    res.json({ token });
  } catch (err) {
    // Handle unexpected server errors
    res.status(500).json({ error: err.message });
  }
};
