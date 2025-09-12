# Dymesty AI Glasses Content Intelligence Center

A comprehensive content management and AI platform optimization system for Dymesty AI Glasses, enabling intelligent content distribution across AI-powered search engines and conversational platforms.

## 🚀 Features

- **Secure Authentication System**: JWT-based authentication with role-based access control
- **Content Management**: Create, manage, and distribute content across multiple AI platforms
- **AI Platform Integration**: Optimized for ChatGPT, Perplexity, Claude, Gemini, and more
- **Real-time Analytics**: Track content performance and visibility metrics
- **Production-Ready**: HTTPS, rate limiting, security headers, and monitoring

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+
- Domain with DNS configured (for production)

## 🛠️ Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/keevingfu/geosys.git dymestygeo-sys
cd dymestygeo-sys
```

2. Set up environment variables:
```bash
cd docker/api
cp .env.example .env
# Edit .env with your configuration
```

3. Start services:
```bash
cd ../
docker-compose up -d
```

4. Run database migrations:
```bash
docker-compose exec postgres psql -U dymesty_admin -d dymestydam -f /docker-entrypoint-initdb.d/01-create-schemas.sql
docker-compose exec postgres psql -U dymesty_admin -d dymestydam -f /docker-entrypoint-initdb.d/02-create-auth-schema.sql
docker-compose exec postgres psql -U dymesty_admin -d dymestydam -f /docker-entrypoint-initdb.d/03-create-content-schema.sql
```

5. Access the application:
- Frontend: http://localhost:8000
- API: http://localhost:4000
- pgAdmin: http://localhost:5051

### Production Deployment

1. Set up production environment:
```bash
cd docker
cp .env.production.example .env.production
# Edit .env.production with secure values
```

2. Run deployment script:
```bash
cd ..
./deploy.sh
```

## 🔐 Default Credentials

### Admin User
- Email: admin@dymesty.com
- Password: Admin@123!

### Demo User
- Email: demo@dymesty.com
- Password: Demo@123!

**⚠️ IMPORTANT: Change these passwords immediately after deployment!**

## 📁 Project Structure

```
dymestygeo-sys/
├── docker/                   # Docker configurations
│   ├── api/                 # API service
│   ├── nginx/              # Nginx reverse proxy
│   ├── init-scripts/       # Database initialization
│   └── docker-compose.yml   # Development compose file
├── js/                      # Frontend JavaScript
│   └── api.js              # API service layer
├── 01-*.html               # About Dymesty modules
├── 02-*.html               # Diagnostics modules
├── 03-*.html               # Content Database modules
├── 04-*.html               # Orchestration modules
├── 05-*.html               # Distribution modules
├── 06-*.html               # Engagement modules
├── 07-*.html               # PR & Media modules
├── 08-*.html               # Monitoring modules
├── 09-*.html               # Advanced Features modules
├── 10-*.html               # System modules
├── index.html              # Main dashboard
├── login.html              # Authentication page
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

Key environment variables for production:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db
DB_PASSWORD=strong_password_here

# JWT
JWT_SECRET=64_character_random_string
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://yourdomain.com

# SSL/Domain
DOMAIN=yourdomain.com
EMAIL_ADMIN=admin@yourdomain.com
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

#### Content Management
- `GET /api/content` - List content (paginated)
- `GET /api/content/:id` - Get single content
- `POST /api/content` - Create content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

#### Analytics
- `GET /api/analytics/overview` - Analytics dashboard
- `GET /api/ai-platforms/performance` - AI platform metrics

## 🚀 Deployment

### Using Docker Compose (Recommended)

```bash
# Production deployment
cd docker
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Manual Deployment

1. Set up PostgreSQL database
2. Configure Nginx with SSL
3. Deploy Node.js API with PM2
4. Serve static files via Nginx

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Rate limiting on API endpoints
- CORS protection
- Security headers via Helmet
- Input validation and sanitization
- SQL injection protection
- XSS protection

## 📊 Monitoring

- Health check endpoint: `/health`
- Database connection monitoring
- API response time tracking
- Error logging and alerting

## 🧪 Testing

```bash
# Run API tests
cd docker/api
npm test

# Run integration tests
npm run test:integration
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by Dymesty Inc.

## 🆘 Support

- Documentation: [docs.dymesty.com](https://docs.dymesty.com)
- Email: support@dymesty.com
- Issues: [GitHub Issues](https://github.com/keevingfu/geosys/issues)

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] AI-powered content recommendations
- [ ] Mobile application
- [ ] Webhook integrations
- [ ] Advanced user permissions

---

Built with ❤️ for Dymesty AI Glasses