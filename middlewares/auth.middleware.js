const jwt = require('jsonwebtoken');

/**
 * verifyToken Middleware
 * Protects routes by verifying the presence and validity of a JWT.
 * Extracts the token from the Authorization header ("Bearer <token>").
 * If the token is valid, attaches the user's ID to req.userId and calls next().
 * Otherwise, responds with 401 Unauthorized.
 * @param {object} req  - Express request object; expects `Authorization` header
 * @param {object} res  - Express response object used to send errors
 * @param {function} next - Callback to pass control to the next middleware
 */
exports.verifyToken = (req, res, next) => {
  // Get the Authorization header value
  const authHeader = req.headers['authorization'];
  // Header format: "Bearer <token>"; split and get the token part
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided,deny access
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  //verify the token against our secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      //token is invalid or expired
      return res.status(401).json({ error: 'Invalid token' });
    }

    //token is valid; store user ID for downstream handlers
    req.userId = decoded.id;
    next();
  });
};
