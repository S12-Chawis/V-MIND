const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

const register = async (req, res) => {
  try {
    const { user_name, email, phone, passwords, objective, preferred_language } = req.body;
    
    // Validate required fields
    if (!user_name || !email || !passwords) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(passwords, 10);
    
    // Prepare user data for database
    const userData = {
      user_name,
      email,
      phone: phone || null,
      passwords: hashedPassword,
      objective: objective || null,
      preferred_language: preferred_language || 'en',
      current_level: 'beginner',
      rol: 'user'
    };
    
    // Create user in database
    const newUser = await User.create(userData);
    
    // Generate JWT token
    const token = generateToken(newUser.user_id);
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          user_id: newUser.user_id,
          user_name: newUser.user_name,
          email: newUser.email,
          rol: newUser.rol
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, passwords } = req.body;

    // Validate required fields
    if (!email || !passwords) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await User.comparePassword(passwords, user.passwords);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last connection
    await User.updateLastConnection(user.user_id);

    // Generate token
    const token = generateToken(user.user_id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          user_id: user.user_id,
          user_name: user.user_name,
          email: user.email,
          rol: user.rol,
          current_level: user.current_level,
          objetive: user.objetive
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          user_name: user.user_name,
          email: user.email,
          phone: user.phone,
          rol: user.rol,
          objetive: user.objetive,
          current_level: user.current_level,
          preferred_language: user.preferred_language,
          creation_date: user.creation_date,
          last_connection: user.last_connection
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user profile',
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { user_name, phone, objetive, preferred_language } = req.body;
    
    const updateData = {};
    if (user_name) updateData.user_name = user_name;
    if (phone) updateData.phone = phone;
    if (objetive) updateData.objetive = objetive;
    if (preferred_language) updateData.preferred_language = preferred_language;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    const query = `
      UPDATE users 
      SET ${Object.keys(updateData).map(key => `${key} = ?`).join(', ')}
      WHERE user_id = ?
    `;
    
    const values = [...Object.values(updateData), req.user.user_id];
    
    const { pool } = require('../config/database');
    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updateData
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
