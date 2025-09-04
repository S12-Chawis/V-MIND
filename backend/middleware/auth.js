const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Extract token from header and remove 'Bearer ' prefix
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
     // Verify a token is provided
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id in database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }

    // Add user to request object
    req.user = user;

    // Continue to the next middleware
    next();
  } catch (error) {
    // Handle token errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication.' 
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.rol !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. Admin privileges required.' 
        });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during admin authentication.' 
    });
  }
};

module.exports = { auth, adminAuth };
