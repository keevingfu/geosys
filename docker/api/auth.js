const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { validationResult } = require('express-validator');

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'dymesty-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://dymesty_admin:DymestyAI2025!@localhost:5432/dymestydam'
});

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token middleware
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const result = await pool.query(
      'SELECT id, email, username, role FROM auth.users WHERE id = $1 AND is_active = true',
      [decoded.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Login endpoint
const login = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    
    // Get user from database
    const result = await pool.query(
      'SELECT * FROM auth.users WHERE email = $1 AND is_active = true',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      // Log failed login attempt
      await pool.query(
        'INSERT INTO auth.login_attempts (user_id, ip_address, success) VALUES ($1, $2, $3)',
        [user.id, req.ip, false]
      );
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Log successful login
    await pool.query(
      'INSERT INTO auth.login_attempts (user_id, ip_address, success) VALUES ($1, $2, $3)',
      [user.id, req.ip, true]
    );
    
    // Update last login
    await pool.query(
      'UPDATE auth.users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Register endpoint
const register = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password, username } = req.body;
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM auth.users WHERE email = $1 OR username = $2',
      [email, username]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await pool.query(
      `INSERT INTO auth.users (email, username, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, username, role`,
      [email, username, passwordHash, 'user']
    );
    
    const user = result.rows[0];
    
    // Generate token
    const token = generateToken(user);
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Refresh token endpoint
const refreshToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify current token (even if expired)
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    
    // Get user from database
    const result = await pool.query(
      'SELECT id, email, username, role FROM auth.users WHERE id = $1 AND is_active = true',
      [decoded.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    
    // Generate new token
    const newToken = generateToken(user);
    
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Logout endpoint
const logout = async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token
    // For now, we'll just log the logout
    if (req.user) {
      await pool.query(
        'INSERT INTO auth.logout_log (user_id, logged_out_at) VALUES ($1, NOW())',
        [req.user.id]
      );
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

// Get current user endpoint
const getCurrentUser = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, role, created_at, last_login_at FROM auth.users WHERE id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change password endpoint
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // Get user from database
    const result = await pool.query(
      'SELECT password_hash FROM auth.users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await pool.query(
      'UPDATE auth.users SET password_hash = $1, password_changed_at = NOW() WHERE id = $2',
      [newPasswordHash, userId]
    );
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Password change failed' });
  }
};

module.exports = {
  verifyToken,
  requireRole,
  login,
  register,
  refreshToken,
  logout,
  getCurrentUser,
  changePassword
};