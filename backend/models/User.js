const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create(userData) {
    const userId = uuidv4();
    
    const query = `
      INSERT INTO users (user_id, user_name, email, phone, passwords, rol, objective, preferred_language, current_level, creation_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const values = [
      userId,
      userData.user_name,
      userData.email,
      userData.phone,
      userData.passwords, // Already hashed in controller
      userData.rol || 'user',
      userData.objective,
      userData.preferred_language,
      userData.current_level || 'beginner'
    ];

    try {
      const [result] = await pool.execute(query, values);
      return { user_id: userId, ...userData };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    
    try {
      const [rows] = await pool.execute(query, [email]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  static async findById(userId) {
    const query = 'SELECT * FROM users WHERE user_id = ?';
    
    try {
      const [rows] = await pool.execute(query, [userId]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  static async updateLastConnection(userId) {
    const query = 'UPDATE users SET last_connection = NOW() WHERE user_id = ?';
    
    try {
      await pool.execute(query, [userId]);
    } catch (error) {
      throw new Error(`Error updating last connection: ${error.message}`);
    }
  }

  static async updateCurrentLevel(userId, level) {
    const query = 'UPDATE users SET current_level = ? WHERE user_id = ?';
    
    try {
      await pool.execute(query, [level, userId]);
    } catch (error) {
      throw new Error(`Error updating current level: ${error.message}`);
    }
  }

  static async getAllUsers() {
    const query = 'SELECT user_id, user_name, email, rol, creation_date, current_level FROM users';
    
    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw new Error(`Error getting all users: ${error.message}`);
    }
  }

  static async comparePassword(password, hashedPassword) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;
