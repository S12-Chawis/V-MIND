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
    
    if (!user_name || !email || !passwords) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    const hashedPassword = await bcrypt.hash(passwords, 10);
    
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
    
    const newUser = await User.create(userData);
    const token = generateToken(newUser.user_id);
    
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

    if (!email || !passwords) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isValidPassword = await User.comparePassword(passwords, user.passwords);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    await User.updateLastConnection(user.user_id);
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
          objective: user.objective
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
          objective: user.objective,
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
    // Extract user data from request body -> frontend sends data to backend via POST request
    const { user_name, phone, objective, preferred_language } = req.body;
    
    // Build update object with only provided fields -> prevents updating with undefined values
    const updateData = {};
    if (user_name) updateData.user_name = user_name;
    if (phone) updateData.phone = phone;
    if (objective) updateData.objective = objective;
    if (preferred_language) updateData.preferred_language = preferred_language;

    // Check if there are any fields to update -> Object.keys().length counts object properties
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    // Build dynamic SQL query -> only updates fields that were provided
    const query = `
      UPDATE users 
      SET ${Object.keys(updateData).map(key => `${key} = ?`).join(', ')}
      WHERE user_id = ?
    `;
    
    // Create values array for SQL query -> spread operator flattens array for proper SQL execution
    const values = [...Object.values(updateData), req.user.user_id];
    
    // Execute database update query
    const { pool } = require('../config/database');
    const [result] = await pool.execute(query, values);

    // Check if any rows were affected -> 0 means user not found or no changes made
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return success response with updated data
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
