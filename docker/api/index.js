const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://dymesty_admin:DymestyAI2025!@localhost:5432/dymestydam'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy', 
      timestamp: result.rows[0].now,
      service: 'Dymesty FAQ DAM API'
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM faq.categories WHERE is_active = true ORDER BY display_order'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get FAQs by category
app.get('/api/faqs/category/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query(`
      SELECT 
        f.id, f.question, f.answer, f.question_variations,
        f.view_count, f.helpful_count, c.name as category_name,
        ARRAY_AGG(DISTINCT t.name) as tags
      FROM faq.faqs f
      JOIN faq.categories c ON f.category_id = c.id
      LEFT JOIN faq.faq_tags ft ON f.id = ft.faq_id
      LEFT JOIN faq.tags t ON ft.tag_id = t.id
      WHERE c.code = $1 AND f.is_active = true
      GROUP BY f.id, c.id
      ORDER BY f.created_at DESC
    `, [code]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all FAQs
app.get('/api/faqs', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const result = await pool.query(`
      SELECT 
        f.id, f.question, f.answer, f.is_featured, f.created_at,
        c.name as category_name, c.code as category_code, c.id as category_id,
        ARRAY_AGG(DISTINCT t.name) as tags
      FROM faq.faqs f
      LEFT JOIN faq.categories c ON f.category_id = c.id
      LEFT JOIN faq.faq_tags ft ON f.id = ft.faq_id
      LEFT JOIN faq.tags t ON ft.tag_id = t.id
      WHERE f.is_active = true
      GROUP BY f.id, c.id
      ORDER BY f.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search FAQs
app.get('/api/faqs/search', async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    // Use direct SQL query with full-text search
    let query = `
      SELECT 
        f.id, f.question, f.answer, f.is_featured, f.created_at,
        c.name as category_name, c.code as category_code, c.id as category_id,
        ARRAY_AGG(DISTINCT t.name) as tags,
        ts_rank(f.search_vector, plainto_tsquery('english', $1)) as rank
      FROM faq.faqs f
      LEFT JOIN faq.categories c ON f.category_id = c.id
      LEFT JOIN faq.faq_tags ft ON f.id = ft.faq_id
      LEFT JOIN faq.tags t ON ft.tag_id = t.id
      WHERE f.is_active = true 
        AND f.search_vector @@ plainto_tsquery('english', $1)
    `;
    
    const params = [q];
    
    if (category) {
      query += ` AND c.code = $${params.length + 1}`;
      params.push(category);
    }
    
    query += `
      GROUP BY f.id, c.id
      ORDER BY rank DESC, f.created_at DESC
      LIMIT $${params.length + 1}
    `;
    params.push(parseInt(limit));
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    // If full-text search fails, fallback to LIKE search
    try {
      let fallbackQuery = `
        SELECT 
          f.id, f.question, f.answer, f.is_featured, f.created_at,
          c.name as category_name, c.code as category_code, c.id as category_id,
          ARRAY_AGG(DISTINCT t.name) as tags
        FROM faq.faqs f
        LEFT JOIN faq.categories c ON f.category_id = c.id
        LEFT JOIN faq.faq_tags ft ON f.id = ft.faq_id
        LEFT JOIN faq.tags t ON ft.tag_id = t.id
        WHERE f.is_active = true 
          AND (
            LOWER(f.question) LIKE LOWER($1) 
            OR LOWER(f.answer) LIKE LOWER($1)
          )
      `;
      
      const searchPattern = `%${q}%`;
      const params = [searchPattern];
      
      if (category) {
        fallbackQuery += ` AND c.code = $${params.length + 1}`;
        params.push(category);
      }
      
      fallbackQuery += `
        GROUP BY f.id, c.id
        ORDER BY f.created_at DESC
        LIMIT $${params.length + 1}
      `;
      params.push(parseInt(limit));
      
      const fallbackResult = await pool.query(fallbackQuery, params);
      res.json(fallbackResult.rows);
    } catch (fallbackError) {
      res.status(500).json({ error: fallbackError.message });
    }
  }
});

// Get single FAQ
app.get('/api/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        f.*, c.name as category_name, c.code as category_code,
        ARRAY_AGG(DISTINCT t.name) as tags
      FROM faq.faqs f
      JOIN faq.categories c ON f.category_id = c.id
      LEFT JOIN faq.faq_tags ft ON f.id = ft.faq_id
      LEFT JOIN faq.tags t ON ft.tag_id = t.id
      WHERE f.id = $1 AND f.is_active = true
      GROUP BY f.id, c.id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track FAQ view
app.post('/api/faqs/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, source = 'web' } = req.body;
    
    await pool.query(
      'SELECT analytics.track_faq_view($1, $2, $3)',
      [id, platform || null, source]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update FAQ helpfulness
app.post('/api/faqs/:id/feedback', async (req, res) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body;
    
    const column = helpful ? 'helpful_count' : 'not_helpful_count';
    await pool.query(
      `UPDATE faq.faqs SET ${column} = ${column} + 1 WHERE id = $1`,
      [id]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular FAQs
app.get('/api/faqs/popular', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const result = await pool.query(`
      SELECT 
        f.id, f.question, f.answer, c.name as category_name,
        f.view_count, f.helpful_count
      FROM faq.faqs f
      JOIN faq.categories c ON f.category_id = c.id
      WHERE f.is_active = true
      ORDER BY f.view_count DESC, f.helpful_count DESC
      LIMIT $1
    `, [parseInt(limit)]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured FAQs
app.get('/api/faqs/featured', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.id, f.question, f.answer, c.name as category_name,
        ARRAY_AGG(DISTINCT t.name) as tags
      FROM faq.faqs f
      JOIN faq.categories c ON f.category_id = c.id
      LEFT JOIN faq.faq_tags ft ON f.id = ft.faq_id
      LEFT JOIN faq.tags t ON ft.tag_id = t.id
      WHERE f.is_active = true AND f.is_featured = true
      GROUP BY f.id, c.id
      ORDER BY f.updated_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tags
app.get('/api/tags', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM faq.tags ORDER BY usage_count DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get FAQs by tag
app.get('/api/faqs/tag/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(`
      SELECT 
        f.id, f.question, f.answer, c.name as category_name
      FROM faq.faqs f
      JOIN faq.categories c ON f.category_id = c.id
      JOIN faq.faq_tags ft ON f.id = ft.faq_id
      JOIN faq.tags t ON ft.tag_id = t.id
      WHERE t.slug = $1 AND f.is_active = true
      ORDER BY f.view_count DESC
    `, [slug]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get AI platform optimization data
app.get('/api/ai-platforms', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM ai_platforms.platforms 
      WHERE is_active = true 
      ORDER BY priority
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export FAQs for AI platform
app.get('/api/export/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const result = await pool.query(`
      SELECT 
        f.question, f.answer, c.name as category,
        ARRAY_AGG(DISTINCT t.name) as tags
      FROM faq.faqs f
      JOIN faq.categories c ON f.category_id = c.id
      LEFT JOIN faq.faq_tags ft ON f.id = ft.faq_id
      LEFT JOIN faq.tags t ON ft.tag_id = t.id
      WHERE f.is_active = true
      GROUP BY f.id, c.id
      ORDER BY c.display_order, f.view_count DESC
    `);
    
    const exportData = {
      brand: 'Dymesty AI Glasses',
      platform: platform,
      exportDate: new Date().toISOString(),
      totalFAQs: result.rows.length,
      faqs: result.rows
    };
    
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics endpoint
app.get('/api/analytics/overview', async (req, res) => {
  try {
    const [totalFAQs, totalViews, popularCategories, recentSearches] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM faq.faqs WHERE is_active = true'),
      pool.query('SELECT COUNT(*) FROM analytics.faq_views'),
      pool.query(`
        SELECT c.name, COUNT(f.id) as faq_count
        FROM faq.categories c
        LEFT JOIN faq.faqs f ON c.id = f.category_id AND f.is_active = true
        GROUP BY c.id
        ORDER BY faq_count DESC
      `),
      pool.query(`
        SELECT query, results_count, searched_at
        FROM analytics.search_queries
        ORDER BY searched_at DESC
        LIMIT 10
      `)
    ]);
    
    res.json({
      totalFAQs: parseInt(totalFAQs.rows[0].count),
      totalViews: parseInt(totalViews.rows[0].count),
      popularCategories: popularCategories.rows,
      recentSearches: recentSearches.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Dymesty FAQ DAM API running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  await pool.end();
  process.exit(0);
});