# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dymesty AI Glasses Content Intelligence Center** - A content management and monitoring platform for optimizing Dymesty AI Glasses' presence across AI-powered search platforms (ChatGPT, Perplexity, Claude, Gemini, You.com, Bing Chat).

Key focus: Managing content for Dymesty's 35g titanium smart glasses featuring real-time translation, privacy protection (no camera), meeting assistance, and 48-hour battery life.

## Running the Project

This is a static HTML project with no build process. To run locally:

```bash
# Using Python's built-in server
python3 -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000

# Then open http://localhost:8000/index.html
```

## Architecture

Static HTML platform with modular single-page applications:

1. **Authentication**: `login.html` → `index.html` via localStorage (demo-only)
2. **Navigation**: Sidebar in `index.html` loads modules via iframe
3. **Module Categories**:
   - `00x-` Diagnostic/strategy
   - `01x-` Content creation
   - `02x-` Content orchestration
   - `03x-` Channel config
   - `04x-` User journey
   - `05x-` Analytics dashboards
   - `06x-` System/settings
   - `07x-` Advanced features

## Project Directory Structure

### Overall Architecture

```
Dymestygeo-sys/
├── Frontend Modules (HTML files)
├── Backend Services (docker/ directory)
├── Configuration and Documentation
├── Automation Scripts
└── Tools and Test Files
```

### Detailed File Function Description

#### 1. Core Entry Files

**index.html**
- Function: Main console/dashboard
- Purpose:
  - Main interface after user login
  - Contains left navigation bar, loads functional modules via iframe
  - Manages user session and permission verification

**login.html**
- Function: User login page
- Purpose:
  - JWT authentication login interface
  - Supports demo and production account login
  - Redirects to index.html after successful login

#### 2. Functional Modules (Grouped by Series)

**01 Series - Platform Introduction**
- `01a-geo-platform-Intr.html`
  - Function: AI platform optimization introduction page
  - Purpose: Display system function overview and value proposition

**02 Series - Diagnostics and Strategy**
- `02a-geo-channel-diagnostic.html`
  - Function: AI platform channel diagnostic tool
  - Purpose: Analyze performance and opportunities across AI platforms
- `02b-geo-strategy.html`
  - Function: AI platform optimization strategy development
  - Purpose: Create optimization strategies based on diagnostic results

**03 Series - Content Management**
- `03a-content-library-example.html`
  - Function: Content library example display
  - Purpose: Show content management best practices
- `03a-question-collector.html`
  - Function: Question collector
  - Purpose: Collect common user questions from AI platforms
- `03b-asset-creation-studio.html`
  - Function: Content creation studio
  - Purpose: Create and edit AI-optimized content
- `03c-asset-library-management.html`
  - Function: Asset library management
  - Purpose: Manage all content resources and media files

**04 Series - Content Orchestration**
- `04a-content-orchestration-center.html`
  - Function: Content orchestration center
  - Purpose: Coordinate content publishing strategy across different AI platforms

**05 Series - Channel Configuration**
- `05a-channel-config-manager.html`
  - Function: AI platform configuration manager
  - Purpose: Manage API configurations and publishing settings for different AI platforms

**06 Series - User Journey**
- `06a-user-journey-tracker.html`
  - Function: User journey tracker
  - Purpose: Analyze user interaction paths on AI platforms

**07 Series - PR and Media Optimization**
- `07a-pr-media-scoring.html`
  - Function: PR media scoring system
  - Purpose: Evaluate AI platform friendliness of media content
- `07b-pr-geo-optimization.html`
  - Function: PR content AI optimization
  - Purpose: Optimize PR articles for increased AI platform visibility
- `07c-mattress-keyword-strategy.html`
  - Function: Competitor keyword strategy analysis (case study)
  - Purpose: Demonstrate keyword strategy development methods
- `07d-jsonld-content-strategy.html`
  - Function: JSON-LD structured data strategy
  - Purpose: Manage structured data to enhance AI understanding
- `07e-competitor-keyword-analysis.html`
  - Function: Competitor keyword analysis
  - Purpose: Analyze competitor performance on AI platforms
- `07f-pr-geo-optimization-advanced.html`
  - Function: Advanced PR optimization tool
  - Purpose: Provide more complex optimization strategies

**08 Series - Monitoring and Analytics**
- `08a-realtime-monitoring.html`
  - Function: Real-time monitoring dashboard
  - Purpose: Track AI platform performance in real-time
- `08b-brand-performance.html`
  - Function: Brand performance analysis
  - Purpose: Analyze overall brand performance on AI platforms
- `08c-visibility-analytics.html`
  - Function: Visibility analytics
  - Purpose: Track content exposure on AI platforms
- `08d-perception-analytics.html`
  - Function: Perception analytics
  - Purpose: Analyze how AI understands and presents the brand
- `08e-citations-analytics.html`
  - Function: Citation analytics
  - Purpose: Track AI platform citations of the brand
- `08f-questions-analytics.html`
  - Function: Question analytics
  - Purpose: Analyze questions users ask through AI
- `08g-seo-performance.html`
  - Function: SEO performance analysis
  - Purpose: Compare traditional SEO vs AI SEO
- `08h-reddit-youtube-monitor.html`
  - Function: Reddit and YouTube monitor
  - Purpose: Monitor brand discussions on social media
- `08i-reddit-performance-dashboard.html`
  - Function: Reddit performance dashboard
  - Purpose: Detailed analysis of Reddit performance

**09 Series - Advanced Features**
- `09a-ai-platform-knowledge-graph.html`
  - Function: AI platform knowledge graph
  - Purpose: Visualize brand knowledge relationships in AI
- `09b-jsonld-ai-platform-connection.html`
  - Function: JSON-LD and AI platform connection
  - Purpose: Manage structured data associations with AI
- `09c-realtime-performance-metrics.html`
  - Function: Real-time performance metrics
  - Purpose: Display key performance indicators in real-time
- `09d-schema-node-mappings.html`
  - Function: Schema node mappings
  - Purpose: Manage knowledge graph node relationships

**10 Series - System Management**
- `10a-user-management.html`
  - Function: User management
  - Purpose: Manage system users and permissions
- `10b-notification-center.html`
  - Function: Notification center
  - Purpose: System notification and alert management
- `10c-data-tools.html`
  - Function: Data tools
  - Purpose: Data import/export and processing tools
- `10d-api-documentation.html`
  - Function: API documentation
  - Purpose: System API interface documentation
- `10e-system-settings.html`
  - Function: System settings
  - Purpose: Global system configuration
- `10f-help-support.html`
  - Function: Help and support
  - Purpose: User help documentation and support information

#### 3. Docker Containerization

**Docker Directory Structure**
```
docker/
├── api/                    # API service
│   ├── Dockerfile         # API container build file
│   ├── auth.js           # JWT authentication module
│   ├── index.js          # API main entry (dev)
│   ├── index-secure.js   # API main entry (prod)
│   └── package.json      # Node.js dependencies
├── nginx/                 # Web server
│   ├── Dockerfile        # Nginx container build file
│   └── nginx.conf        # Nginx configuration
├── init-scripts/         # Database initialization
│   ├── 01-schema.sql    # Basic table structure
│   ├── 02-create-auth-schema.sql  # Auth tables
│   ├── 02-data.sql      # Initial data
│   └── 03-create-content-schema.sql # Content tables
├── web-app/             # Standalone web app example
├── docker-compose.yml   # Development environment
└── docker-compose.prod.yml # Production environment
```

#### 4. Configuration and Documentation Files

- `CLAUDE.md`: Project documentation for Claude AI
- `CLAUDE.local.md`: Local development specific configuration
- `README.md`: Main project documentation
- `PRODUCTION_CHECKLIST.md`: Production deployment checklist
- `CI-CD-SETUP.md`: CI/CD configuration guide
- `.claude/settings.local.json`: Claude Code permission settings
- `.vscode/settings.json`: VSCode configuration

#### 5. Automation Scripts

- `auto-sync.sh`: Auto-sync to GitHub script
- `force-sync.sh`: Force sync script (with custom message)
- `deploy.sh`: Deployment script
- `docker/backup.sh`: Database backup script
- `docker/deploy.sh`: Docker deployment script

#### 6. Styles and Utility Files

- `shared-ui-components.css`: Shared UI component styles
- `js/api.js`: Frontend API call wrapper
- `transform_to_dymesty.py`: Data transformation script

#### 7. Test and Example Files

- `test-echarts.html`: ECharts chart testing
- `test-minimal-graph.html`: Minimal chart testing
- `datrix-platform-complete.html`: Complete platform example
- `dymesty-geo-faq-dam.html`: FAQ and DAM example

### Key Technical Features

1. **Modular Architecture**: Each HTML file is an independent functional module
2. **Containerized Deployment**: Complete Docker support for dev and production environments
3. **Security Authentication**: JWT authentication system with role-based permissions
4. **Automated Workflows**: Git hooks and deployment scripts
5. **Data Visualization**: Uses ECharts for data display
6. **Responsive Design**: Adapts to multiple devices and screen sizes

This project is a complete enterprise-level content management and AI platform optimization system with excellent architectural design and extensibility.

## Key Technical Patterns

### Chart Implementation
All data visualizations use ECharts v5.4.3:
- Initialize: `echarts.init(document.getElementById('chart-id'))`
- Mock data defined inline as JavaScript objects/arrays
- Common types: line, bar, pie, scatter, heatmap
- Responsive handling: `window.addEventListener('resize', () => myChart.resize())`

### Styling Consistency
The platform uses CSS custom properties for theming:
```css
:root {
    --primary: #667eea;
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Key Terminology

- AI Platform Optimization (not "GEO")
- AVI (AI Visibility Index)
- Share of Voice
- Content Intelligence Center

## Development Workflow

### Adding New Modules

1. Create new HTML file following naming convention: `XXx-module-name.html`
2. Include standard dependencies:

   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
   <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
   ```

3. Add navigation entry in `index.html` under appropriate category

### Module Integration with Main Dashboard

To add a module to the navigation:

1. Find the appropriate `.nav-category` in `index.html`
2. Add `.nav-link` with correct `data-page` attribute
3. Module will load in iframe when clicked

## Development Commands

```bash
# Run local development server
python3 -m http.server 8000
# OR
npx http-server -p 8000

# Auto-sync to GitHub (commits and pushes automatically)
./auto-sync.sh

# Force sync with specific commit message
./force-sync.sh "Your commit message"

# Traditional git workflow (auto-push enabled via post-commit hook)
git add .
git commit -m "Your message"  # Push happens automatically
```

## Critical Constraints

- **No Build Process**: Direct HTML/CSS/JS editing only - no webpack/npm build
- **No Backend API**: All data must be mock/demo data defined inline
- **CDN Dependencies Only**: Use Font Awesome 6.4.0 and ECharts 5.4.3 via CDN
- **English Only**: NO Chinese characters anywhere. All UI text, labels, tooltips, console logs, and comments must be in English
- **Git Auto-Push**: Every commit automatically pushes to GitHub via post-commit hook

## Product Context

**Dymesty AI Glasses**: 35g titanium smart glasses, no camera (privacy-focused), $199 price point

- Core features: Real-time translation, AI meeting assistant, 48-hour battery
- Market position: Tier 2 specialist (12.5K monthly traffic, 342 keywords)
- Competitors: Ray-Ban Meta (13.6M traffic), XREAL AR (485K), Solos AirGo (156K)

All platform data/metrics are mock examples focused on AI glasses industry.

## Security & Version Control

- **Repository**: `https://github.com/keevingfu/geosys` (main branch)
- **Credentials**: GitHub token in `.env` file (git-ignored, never commit)
- **Auto-Push**: Enabled via git post-commit hook
- **Manual Sync**: Use `./auto-sync.sh` or `./force-sync.sh`

## Project Summary

This is a static HTML content management platform for Dymesty AI Glasses. Key points:

- 30+ self-contained HTML modules loaded via iframe navigation
- All data is mock/demo - no real backend or API
- ECharts for visualizations, Font Awesome for icons (CDN-only)
- English-only requirement strictly enforced
- Git commits auto-push to GitHub
- Focus on AI platform optimization for smart glasses market