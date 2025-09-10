# Dymesty AI Glasses FAQ DAM - Docker Deployment

## Overview
This is a PostgreSQL-based FAQ Data Asset Management (DAM) system for Dymesty AI Glasses, designed for GEO/GEM content optimization across AI platforms.

## Architecture
- **PostgreSQL 15**: Main database with full-text search
- **pgAdmin 4**: Database administration interface
- **Node.js API**: RESTful API for FAQ access
- **Docker Compose**: Container orchestration

## Database Structure

### Schemas
- `faq`: Core FAQ content and categories
- `analytics`: Usage tracking and performance metrics
- `ai_platforms`: AI platform optimization settings

### Key Tables
- `faq.faqs`: Main FAQ entries with full-text search
- `faq.categories`: FAQ categorization (Product, Technology, Privacy, etc.)
- `faq.tags`: Keyword tagging for SEO/GEO optimization
- `analytics.faq_views`: View tracking for analytics
- `ai_platforms.platforms`: AI platform configurations

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- At least 2GB free disk space
- Port 5432, 5050, and 3000 available

### Deployment
```bash
# 1. Make scripts executable
chmod +x deploy.sh backup.sh

# 2. Run deployment
./deploy.sh
```

### Access Points
- **PostgreSQL**: `localhost:5432`
  - Database: `dymestydam`
  - User: `dymesty_admin`
  - Password: `DymestyAI2025!`

- **pgAdmin**: `http://localhost:5050`
  - Email: `admin@dymesty.com`
  - Password: `DymestyAdmin2025!`

- **API**: `http://localhost:3000`
  - Health check: `http://localhost:3000/health`

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/faqs/category/:code` - Get FAQs by category

### FAQs
- `GET /api/faqs/:id` - Get single FAQ
- `GET /api/faqs/search?q=query` - Search FAQs
- `GET /api/faqs/popular` - Get popular FAQs
- `GET /api/faqs/featured` - Get featured FAQs
- `POST /api/faqs/:id/view` - Track FAQ view
- `POST /api/faqs/:id/feedback` - Submit helpfulness feedback

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/faqs/tag/:slug` - Get FAQs by tag

### AI Platform Integration
- `GET /api/ai-platforms` - Get supported AI platforms
- `GET /api/export/:platform` - Export FAQs for specific platform

### Analytics
- `GET /api/analytics/overview` - Get analytics overview

## Database Operations

### Connect to Database
```bash
# Using Docker
docker exec -it dymesty-postgres psql -U dymesty_admin -d dymestydam

# Using psql directly
psql -h localhost -p 5432 -U dymesty_admin -d dymestydam
```

### Common Queries
```sql
-- Search FAQs
SELECT * FROM faq.search_faqs('battery life', NULL, 10);

-- Get FAQ with tags
SELECT * FROM faq.v_faq_complete WHERE id = 'faq-uuid';

-- Track view
SELECT analytics.track_faq_view('faq-uuid', 'chatgpt', 'api');

-- Performance analytics
SELECT * FROM analytics.v_faq_performance;
```

### Backup & Restore
```bash
# Backup database
./backup.sh

# Restore from backup
docker exec -i dymesty-postgres psql -U dymesty_admin -d dymestydam < backup/dymestydam_backup_20250826.sql
```

## Maintenance

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker logs -f dymesty-postgres
docker logs -f dymesty-api
```

### Update FAQ Content
```sql
-- Add new FAQ
INSERT INTO faq.faqs (category_id, question, answer)
VALUES (
  (SELECT id FROM faq.categories WHERE code = 'product'),
  'Your question here',
  'Your answer here'
);

-- Update existing FAQ
UPDATE faq.faqs 
SET answer = 'Updated answer'
WHERE id = 'faq-uuid';
```

### Refresh Materialized Views
```sql
REFRESH MATERIALIZED VIEW faq.mv_ai_platform_content;
```

## Security Notes
1. Change default passwords in production
2. Use environment variables for sensitive data
3. Enable SSL for database connections
4. Implement rate limiting on API
5. Add authentication to API endpoints

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker logs dymesty-postgres
```

### API Connection Issues
```bash
# Check if API is running
docker ps | grep api

# Check API logs
docker logs dymesty-api
```

### Reset Everything
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Redeploy
./deploy.sh
```

## Support
For issues or questions about the Dymesty FAQ DAM system:
- GitHub: https://github.com/keevingfu/geosys
- Email: support@dymesty.com