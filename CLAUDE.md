# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**leapgeo-sys** is now the **Dymesty AI Glasses Intelligence Center** - a comprehensive content management and monitoring system specifically designed for the Dymesty AI Glasses product. It's a Content Intelligence Center for managing and optimizing the Dymesty AI Glasses brand presence across AI-powered search engines and platforms including ChatGPT, Perplexity, Claude, Gemini, You.com, and Bing Chat.

The platform focuses on monitoring and optimizing content related to Dymesty's AI glasses features such as real-time translation, privacy protection, AR display capabilities, and developer tools.

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

The platform follows a modular architecture where each HTML file is a self-contained single-page application:

1. **Authentication Flow**: 
   - `login.html` → `index.html` (main dashboard)
   - Authentication state stored in localStorage (authToken, sessionExpiry)
   - Auto-redirect to login if session expired

2. **Main Navigation Hub** (`index.html`):
   - Collapsible sidebar navigation with categorized modules
   - iframe-based content loading for individual modules
   - Real-time monitoring widgets (AVI, Coverage Rate, Share of Voice)
   - Mobile-responsive design with hamburger menu

3. **Module Naming Convention**:
   - `00x-` - Diagnostic and strategy tools
   - `01x-` - Content creation and management tools
   - `02x-` - Content orchestration
   - `03x-` - Channel configuration
   - `04x-` - User journey tracking
   - `05x-` - Analytics and monitoring dashboards

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

### Language and Localization
- **Primary language**: English (MANDATORY)
- **Language Policy**: NO Chinese characters or any non-English text allowed in any files
- **UI Requirements**: All labels, buttons, messages, tooltips, and content must be in English
- **Code Comments**: All code comments must be written in English
- **Key terminology**: 
  - AI Platform Optimization (formerly GEO)
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

## Important Constraints

- **No Build Process**: Direct file editing only
- **No Backend API**: All data is mock/demo data defined inline
- **External Dependencies**: CDN-hosted libraries only (no npm/node_modules)
- **Browser Support**: Modern browsers with ES6+ support required
- **Language Requirements**: ALL CODE GENERATION MUST USE ENGLISH ONLY. No Chinese characters or text should appear in any page. All UI elements, labels, messages, comments, and content must be in English.

## Dymesty AI Glasses Focus

The entire platform has been transformed to focus on the Dymesty AI Glasses product as a case study. 

### Product Details
- **Brand**: Dymesty - Premium titanium smart glasses startup
- **Core Product**: Titanium AI Glasses (35g ultra-lightweight)
- **Key Features**:
  - Real-time translation (100+ languages)
  - AI meeting assistant with auto-summary
  - Voice-to-text capabilities
  - Open-ear audio design
  - 48-hour battery life
  - **No camera design** (privacy-focused)
  - Bluetooth connectivity
  - Phone loss prevention alerts
- **Target Market**: Professionals, business travelers, privacy-conscious users
- **Price Point**: $199 (competing with $2000+ premium brands)

### Market Position (2025)
- **Market Tier**: Tier 2 Specialist (Professional/Business Focus)
- **Market Growth**: Smart glasses market growing 110% YoY in 2025
- **Traffic Position**: 12.5K monthly visits (156.7% growth from crowdfunding)
- **Main Competitors by Tier**:
  - **Tier 1 (Mass Market Leaders)**: 
    - Ray-Ban Meta: 13.6M traffic, 39.5K keywords
    - Huawei Gentle Monster: 2.85M traffic
    - Xiaomi Smart Glasses: 1.92M traffic
  - **Tier 2 (Specialized/Professional)**:
    - Dymesty AI Glasses: 12.5K traffic, 342 keywords
    - XREAL AR Glasses: 485K traffic
    - Solos AirGo: 156K traffic
    - StarV Air, Loomos (similar positioning)
  - **Tier 3**: Small startups and experimental brands
- **Differentiation**: No-camera privacy design, 35g titanium, professional focus
- **Note**: Yanko Design is NOT a competitor - it's a design media platform that reviews products

### Channel Adaptations
- Developer Forums (replacing Social Media focus)
- Tech Reviews (specialized for AR/VR products)
- YouTube Demos (product demonstrations)
- Reddit Communities (tech enthusiast discussions)
- GitHub/Documentation (developer resources)

### Content Types
- Technical documentation for developers
- Product feature highlights
- Privacy and security whitepapers
- SDK integration guides
- User testimonials and case studies

All mock data and examples throughout the platform reflect AI glasses use cases and metrics relevant to the AR/VR industry.

## SEO Strategy and Keywords

### Current SEO Performance
- **Monthly Traffic**: 12,500 visits (156.7% growth from crowdfunding)
- **Total Keywords**: 342 (vs Ray-Ban Meta's 39,500)
- **Average Position**: 28.5
- **Domain Authority**: 35 (startup level)
- **AI Platform Visibility**: 15%

### Keyword Categories (342 total)
- **Brand Keywords**: 45 keywords (e.g., "dymesty", "dymesty ai glasses")
- **Product Features**: 68 keywords (e.g., "titanium smart glasses", "ai translation glasses")
- **Use Scenarios**: 52 keywords (e.g., "glasses for meetings", "travel translation glasses")
- **Target Audience**: 38 keywords (e.g., "professional ai glasses", "business smart eyewear")
- **Generic Terms**: 139 keywords (competitive, lower rankings)

### Top Performing Keywords
**Google**:
- "dymesty ai glasses" (Position 4, Volume: 3,600)
- "ai meeting assistant glasses" (Position 3, Volume: 890)
- "lightweight ai glasses" (Position 5, Volume: 680)

**Amazon**:
- "dymesty" (Position 1, Volume: 2,800)
- "meeting summary glasses" (Position 6, Volume: 420)

**Long-tail Opportunities**:
- "titanium ai glasses for professionals" (Position 3, Volume: 340)
- "no-camera privacy smart glasses" (Position 4, Volume: 120)

## CI/CD and Security Setup

### Automated Deployment
The project now includes a comprehensive CI/CD system for automatic GitHub synchronization:

1. **Secure Token Management**
   - GitHub tokens stored in `.env` file (git-ignored)
   - Never hardcode credentials in code
   - Tokens only used locally for authentication

2. **Auto-Sync Features**
   - **Manual sync**: Run `./auto-sync.sh` for immediate push
   - **Automatic sync**: Git post-commit hook pushes changes automatically
   - No manual push required after commits

3. **Security Files**
   - `.env` - Secure credential storage (never uploaded to GitHub)
   - `.gitignore` - Comprehensive exclusion rules for sensitive files
   - `auto-sync.sh` - One-command synchronization script
   - `.git/hooks/post-commit` - Automatic push after every commit

### Version Control
- **Repository**: https://github.com/keevingfu/geosys
- **Branch**: main
- **Auto-push**: Enabled via git hooks

## Current Project Status

### Completed Features
- ✅ Full platform transformation to Dymesty AI Glasses branding
- ✅ Complete English localization (no Chinese characters)
- ✅ All 20+ modules updated with AI glasses context
- ✅ Secure CI/CD pipeline implemented
- ✅ Automatic GitHub synchronization
- ✅ Comprehensive documentation

### File Structure
```
leapgeo-sys/
├── index.html                    # Main dashboard
├── login.html                    # Authentication page
├── 00x-*.html                   # Diagnostic & strategy modules
├── 01x-*.html                   # Content creation modules
├── 02x-*.html                   # Content orchestration
├── 03x-*.html                   # Channel configuration
├── 04x-*.html                   # User journey tracking
├── 05x-*.html                   # Analytics dashboards
├── geo-platform-Intr.html       # Platform introduction
├── CLAUDE.md                    # This documentation
├── CI-CD-SETUP.md              # CI/CD documentation
├── auto-sync.sh                # Auto-sync script
├── .env                        # Secure tokens (git-ignored)
├── .gitignore                  # Git exclusion rules
└── transform_to_dymesty.py     # Transformation script
```

### Recent Updates (August 26, 2025)
- Changed platform title to "Dymesty AI Glasses Content Intelligence Center"
- Updated domain references from leapunion.com to dymesty.com
- Fixed AI Platform Performance chart with proper English labels
- Implemented secure token management system with `.env` file
- Added automated GitHub synchronization with CI/CD pipeline
- **SEO Performance Page (05g_seo_performance.html) Major Update**:
  - Updated with realistic market data showing Dymesty as startup (12.5K monthly traffic)
  - Added actual competitor data: Ray-Ban Meta (13.6M), Huawei (2.85M), Xiaomi (1.92M)
  - Implemented comprehensive keyword tracking system with Google and Amazon keywords
  - Added keyword strategy section with 342 tracked keywords
  - Created keyword category distribution chart
  - Added long-tail keyword opportunities focused on titanium AI glasses niche
- **Market Positioning Updates**:
  - Added Tier 2 market classification throughout platform
  - Updated competitor list with proper smart glasses brands (removed Yanko Design)
  - Added 2025 market growth context (110% YoY growth)
  - Emphasized privacy-focused professional positioning
- **Product Showcase Added**:
  - Detailed hardware specifications in geo-platform-Intr.html
  - AI capabilities and use cases
  - Market position context and growth opportunities