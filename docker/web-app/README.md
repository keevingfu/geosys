# Dymesty FAQ Web Applications

This directory contains three web applications built for the Dymesty AI Glasses FAQ DAM system.

## Applications Overview

### 1. Basic FAQ Web Application (`index.html`)
A comprehensive FAQ browsing and search interface with the following features:

- **Smart Search**: Real-time search with keyword highlighting
- **Category Navigation**: Sidebar navigation with category icons
- **Advanced Filtering**: Filter by category, tags, and search terms
- **Responsive Design**: Mobile-optimized interface
- **User Analytics**: View tracking and engagement metrics
- **Export Functionality**: FAQ data export capabilities

**Key Features**:
- Real-time FAQ search and filtering
- Category-based organization
- Tag-based content discovery
- FAQ view tracking
- Mobile-responsive design
- Statistics dashboard (total FAQs, categories, tags)

### 2. AI-Powered Search (`ai-search.html`)
Advanced intelligent search system with AI-powered recommendations:

- **Natural Language Search**: Ask questions in plain English
- **Semantic Analysis**: Understand context and meaning
- **Smart Recommendations**: Personalized content suggestions
- **Search Modes**: Natural language, semantic, and contextual search
- **Analytics Integration**: Search trends and user behavior tracking
- **Machine Learning**: Pattern recognition and user preference learning

**AI Features**:
- Natural language query processing
- Semantic search with relevance scoring
- Contextual recommendations based on user behavior
- Search history and trending queries
- Confidence scoring for AI responses
- Personalized content suggestions

### 3. Analytics Dashboard (`analytics-dashboard.html`)
Comprehensive analytics and reporting dashboard:

- **Real-time Metrics**: FAQ views, user engagement, satisfaction scores
- **Interactive Charts**: ECharts-powered visualizations
- **Content Performance**: FAQ effectiveness and user satisfaction
- **User Journey Analysis**: Behavior patterns and engagement tracking
- **AI Insights**: Performance optimization recommendations
- **Export Functionality**: PDF, Excel, CSV, and JSON exports

**Analytics Features**:
- FAQ performance metrics and trends
- User engagement heatmaps
- Content gap analysis
- AI vs traditional search comparison
- Export capabilities for all data formats
- Real-time dashboard updates

## Getting Started

### Prerequisites
- Docker Desktop with the Dymesty PostgreSQL database running
- API server running on `http://localhost:4000`
- Modern web browser with JavaScript enabled

### Running the Applications

1. **Start the Database and API**:
   ```bash
   cd /Users/cavin/Desktop/dev/Dymestygeo-sys/docker
   ./deploy.sh
   ```

2. **Access the Applications**:
   - Open the HTML files directly in your browser, or
   - Use a local web server:
   ```bash
   # Using Python
   python3 -m http.server 8080
   
   # Using Node.js
   npx http-server -p 8080
   ```

3. **Application URLs**:
   - Basic FAQ App: `http://localhost:8080/index.html`
   - AI Search: `http://localhost:8080/ai-search.html`
   - Analytics Dashboard: `http://localhost:8080/analytics-dashboard.html`

## API Integration

All applications connect to the Dymesty FAQ API running on `http://localhost:4000/api`.

### API Endpoints Used:
- `GET /api/faqs` - Retrieve all FAQs
- `GET /api/categories` - Get FAQ categories
- `GET /api/tags` - Get available tags
- `GET /api/faqs/search?q={query}` - Search FAQs
- `POST /api/faqs/{id}/view` - Track FAQ views
- `GET /api/analytics/overview` - Get analytics data

## Features by Application

### Basic FAQ App
- ✅ FAQ browsing and search
- ✅ Category navigation
- ✅ Tag filtering
- ✅ View tracking
- ✅ Responsive design
- ✅ Export functionality

### AI Search App
- ✅ Natural language processing
- ✅ Semantic search
- ✅ Smart recommendations
- ✅ Search history
- ✅ Trending queries
- ✅ Personalization features

### Analytics Dashboard
- ✅ Real-time metrics
- ✅ Interactive visualizations
- ✅ Performance analysis
- ✅ User behavior tracking
- ✅ Content optimization insights
- ✅ Data export capabilities

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Icons**: Font Awesome 6.4.0
- **Charts**: ECharts 5.4.3
- **API**: RESTful API with Node.js/Express
- **Database**: PostgreSQL with full-text search
- **Storage**: LocalStorage for user preferences

## Browser Compatibility

- Chrome/Chromium 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Notes

### AI Search Simulation
The AI search features are currently simulated for demonstration purposes. In a production environment, you would integrate with:
- OpenAI GPT API for natural language processing
- Google Cloud Natural Language API for semantic analysis
- Custom ML models for personalization
- Vector databases for semantic search

### Real-time Analytics
The analytics dashboard shows simulated data. For production deployment:
- Implement real-time data pipelines
- Add database triggers for metrics collection
- Set up automated report generation
- Integrate with external analytics services

### Performance Optimization
- Lazy loading for large FAQ datasets
- Client-side caching for frequently accessed data
- Progressive web app (PWA) features
- CDN integration for assets

## Future Enhancements

1. **Authentication & Authorization**
   - User accounts and profiles
   - Role-based access control
   - Session management

2. **Advanced AI Features**
   - Voice search integration
   - Multi-language support
   - Advanced NLP processing
   - Machine learning recommendations

3. **Enhanced Analytics**
   - A/B testing capabilities
   - Conversion tracking
   - Heat mapping
   - User flow analysis

4. **Mobile Applications**
   - React Native apps
   - Progressive Web App (PWA)
   - Offline functionality
   - Push notifications

## Support and Documentation

For technical support or questions about these applications:
- GitHub Repository: https://github.com/keevingfu/geosys
- Email: support@dymesty.com
- API Documentation: Available at `/api/docs` when server is running

## License

These applications are part of the Dymesty AI Glasses FAQ DAM system and are proprietary software of Dymesty Inc.