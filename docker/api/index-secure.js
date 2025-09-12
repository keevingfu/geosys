const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { body, query, param } = require('express-validator');
require('dotenv').config();

const {
  verifyToken,
  requireRole,
  login,
  register,
  refreshToken,
  logout,
  getCurrentUser,
  changePassword
} = require('./auth');

const app = express();
const PORT = process.env.API_PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://dymesty_admin:DymestyAI2025!@localhost:5432/dymestydam',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:8000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// ===== Public Endpoints =====

// Health check
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy', 
      timestamp: result.rows[0].now,
      service: 'Dymesty Content Intelligence API',
      version: '2.0.0'
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// ===== Authentication Endpoints =====

// Login
app.post('/api/auth/login', 
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  login
);

// Register
app.post('/api/auth/register',
  body('email').isEmail().normalizeEmail(),
  body('username').isAlphanumeric().isLength({ min: 3, max: 30 }),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  register
);

// Refresh token
app.post('/api/auth/refresh', refreshToken);

// Logout
app.post('/api/auth/logout', verifyToken, logout);

// Get current user
app.get('/api/auth/me', verifyToken, getCurrentUser);

// Change password
app.post('/api/auth/change-password',
  verifyToken,
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  changePassword
);

// ===== Content Management Endpoints (Protected) =====

// Get content dashboard data
app.get('/api/dashboard', verifyToken, async (req, res) => {
  try {
    const [
      totalContent,
      publishedContent,
      draftContent,
      recentActivity
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM content.items'),
      pool.query('SELECT COUNT(*) FROM content.items WHERE status = $1', ['published']),
      pool.query('SELECT COUNT(*) FROM content.items WHERE status = $1', ['draft']),
      pool.query(`
        SELECT * FROM content.activity_log 
        ORDER BY created_at DESC 
        LIMIT 10
      `)
    ]);

    res.json({
      totalContent: parseInt(totalContent.rows[0].count),
      publishedContent: parseInt(publishedContent.rows[0].count),
      draftContent: parseInt(draftContent.rows[0].count),
      recentActivity: recentActivity.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all content items
app.get('/api/content', verifyToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status,
      type,
      search 
    } = req.query;
    
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM content.items WHERE 1=1';
    const params = [];
    
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    
    if (type) {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }
    
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${params.length} OR content ILIKE $${params.length})`;
    }
    
    // Add pagination
    params.push(limit, offset);
    query += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM content.items WHERE 1=1';
    const countParams = [];
    
    if (status) {
      countParams.push(status);
      countQuery += ` AND status = $${countParams.length}`;
    }
    
    if (type) {
      countParams.push(type);
      countQuery += ` AND type = $${countParams.length}`;
    }
    
    if (search) {
      countParams.push(`%${search}%`);
      countQuery += ` AND (title ILIKE $${countParams.length} OR content ILIKE $${countParams.length})`;
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      items: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create content item
app.post('/api/content', 
  verifyToken,
  requireRole(['admin', 'editor']),
  body('title').notEmpty().trim(),
  body('content').notEmpty(),
  body('type').isIn(['article', 'faq', 'guide', 'announcement']),
  async (req, res) => {
    try {
      const { title, content, type, metadata = {} } = req.body;
      
      const result = await pool.query(
        `INSERT INTO content.items (title, content, type, metadata, created_by, status) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [title, content, type, JSON.stringify(metadata), req.user.id, 'draft']
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update content item
app.put('/api/content/:id',
  verifyToken,
  requireRole(['admin', 'editor']),
  param('id').isInt(),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, status, metadata } = req.body;
      
      const result = await pool.query(
        `UPDATE content.items 
         SET title = COALESCE($1, title),
             content = COALESCE($2, content),
             status = COALESCE($3, status),
             metadata = COALESCE($4, metadata),
             updated_at = NOW(),
             updated_by = $5
         WHERE id = $6
         RETURNING *`,
        [title, content, status, metadata ? JSON.stringify(metadata) : null, req.user.id, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete content item
app.delete('/api/content/:id',
  verifyToken,
  requireRole(['admin']),
  param('id').isInt(),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        'DELETE FROM content.items WHERE id = $1 RETURNING id',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      res.json({ message: 'Content deleted successfully', id: result.rows[0].id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ===== Analytics Endpoints (Protected) =====

// Get analytics overview
app.get('/api/analytics/overview', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const [
      pageViews,
      uniqueVisitors,
      avgSessionDuration,
      topContent
    ] = await Promise.all([
      pool.query(`
        SELECT COUNT(*) as total,
               DATE_TRUNC('day', created_at) as date
        FROM analytics.page_views
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY date
        ORDER BY date
      `, [startDate || '2025-01-01', endDate || new Date()]),
      
      pool.query(`
        SELECT COUNT(DISTINCT session_id) as unique_visitors
        FROM analytics.page_views
        WHERE created_at BETWEEN $1 AND $2
      `, [startDate || '2025-01-01', endDate || new Date()]),
      
      pool.query(`
        SELECT AVG(duration) as avg_duration
        FROM analytics.sessions
        WHERE created_at BETWEEN $1 AND $2
      `, [startDate || '2025-01-01', endDate || new Date()]),
      
      pool.query(`
        SELECT content_id, COUNT(*) as views
        FROM analytics.page_views
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY content_id
        ORDER BY views DESC
        LIMIT 10
      `, [startDate || '2025-01-01', endDate || new Date()])
    ]);
    
    res.json({
      pageViews: pageViews.rows,
      uniqueVisitors: uniqueVisitors.rows[0]?.unique_visitors || 0,
      avgSessionDuration: avgSessionDuration.rows[0]?.avg_duration || 0,
      topContent: topContent.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== AI Platform Integration Endpoints =====

// Get AI platform performance
app.get('/api/ai-platforms/performance', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.name,
        p.platform_type,
        COUNT(DISTINCT c.id) as content_count,
        AVG(m.visibility_score) as avg_visibility,
        SUM(m.impressions) as total_impressions
      FROM ai_platforms.platforms p
      LEFT JOIN ai_platforms.content_performance c ON p.id = c.platform_id
      LEFT JOIN ai_platforms.metrics m ON c.id = m.content_id
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY total_impressions DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit content to AI platform
app.post('/api/ai-platforms/:platformId/submit',
  verifyToken,
  requireRole(['admin', 'editor']),
  param('platformId').isInt(),
  body('contentId').isInt(),
  async (req, res) => {
    try {
      const { platformId } = req.params;
      const { contentId } = req.body;
      
      // Check if content exists
      const contentCheck = await pool.query(
        'SELECT id FROM content.items WHERE id = $1',
        [contentId]
      );
      
      if (contentCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      // Record submission
      const result = await pool.query(
        `INSERT INTO ai_platforms.submissions 
         (content_id, platform_id, submitted_by, status) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [contentId, platformId, req.user.id, 'pending']
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ===== Error Handling =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: err.details });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Generic error
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== Server Startup =====

const server = app.listen(PORT, () => {
  console.log(`Dymesty Content Intelligence API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  
  server.close(() => {
    console.log('HTTP server closed');
  });
  
  await pool.end();
  console.log('Database pool closed');
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing connections...');
  
  server.close(() => {
    console.log('HTTP server closed');
  });
  
  await pool.end();
  console.log('Database pool closed');
  
  process.exit(0);
});

module.exports = app;