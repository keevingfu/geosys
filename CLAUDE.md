# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**leapgeo-sys** is a Generative Engine Optimization (GEO) Operations Platform for Leap Company. It's a collection of standalone HTML pages that form a comprehensive content management and monitoring system for managing brand visibility across AI-powered search engines and platforms.

## Architecture

This is a static HTML-based project with no build process. Each HTML file is a self-contained single-page application that represents a different module of the GEO platform. The system is designed to monitor and optimize brand presence across AI-powered search engines like ChatGPT, Perplexity, Claude, and others.

### Core Modules
- `index.html` - Main dashboard and navigation hub
- `geo-platform-Intr.html` - Platform introduction and overview page

### Operational Tools
- `00a-geo-channel-diagnostic.html` - Channel diagnostics and health monitoring
- `00b-geo-strategy.html` - GEO strategy planning and management
- `01a-question-collector.html` - User question discovery and collection system
- `02a-content-orchestration-center.html` - Content planning and orchestration
- `03a-channel-config-manager.html` - Channel configuration management
- `04c-user-journey-tracker.html` - User journey tracking and analysis

### Analytics Dashboards
- `05a-realtime-monitoring.html` - Real-time system monitoring
- `05b_brand-performance.html` - Brand performance metrics
- `05c_visibility-analytics.html` - Visibility analytics
- `05d_perception-analytics.html` - Brand perception analytics
- `05e_citations-analytics.html` - Citations and references analytics
- `05f_questions-analytics.html` - Questions analytics
- `05g_seo_performance.html` - SEO performance tracking
- `05h-reddit-youtube-monitor.html` - Social media monitoring for Reddit and YouTube

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript
- **Charts**: ECharts v5.4.3 for data visualization
- **Icons**: Font Awesome 6.4.0
- **Animations**: AOS (Animate On Scroll) library (in some pages)
- **Styling**: CSS custom properties for theming, responsive design

## Development Guidelines

### Running the Project
Since this is a static HTML project, simply open any HTML file in a web browser. For better development experience with live reload:
```bash
# Using Python's built-in server
python3 -m http.server 8000

# Or using Node.js http-server (if available)
npx http-server -p 8000
```

### Code Structure
- Each HTML file contains inline CSS and JavaScript
- Common design patterns include:
  - CSS custom properties for consistent theming
  - Responsive grid layouts
  - Interactive charts using ECharts
  - Mock data for demonstration purposes

### Navigation System
The main `index.html` serves as the navigation hub with:
- Collapsible sidebar menu with categorized sections
- iframe-based content loading for individual modules
- Mobile-responsive hamburger menu
- Active state management for navigation items

### Styling Conventions
- CSS variables defined in `:root` for consistent theming
- Primary gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Color scheme includes primary, success, warning, error, purple, and cyan variants
- Responsive design with mobile-first approach
- Consistent shadow variables: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

### Key Features to Maintain
- All pages are standalone and don't require external dependencies beyond CDN libraries
- Chinese language UI (zh-CN) is the primary language
- Mock data and simulations are used for demonstrations
- Interactive elements include filters, search functionality, and data visualizations
- Real-time monitoring dashboard on the main page displays key metrics like AVI (AI Visibility Index), Coverage Rate, Share of Voice, etc.

## Common Development Tasks

### Adding a New Module
1. Create a new HTML file following the naming convention: `XX-module-name.html`
2. Include standard CDN dependencies (ECharts, Font Awesome)
3. Follow the existing CSS variable system for consistent theming
4. Add the module to the navigation in `index.html`

### Modifying Chart Data
1. Charts use ECharts v5.4.3
2. Chart configurations are typically found in `<script>` tags within each HTML file
3. Mock data is usually defined as JavaScript objects/arrays near the chart initialization

### Testing Responsive Design
- Test at common breakpoints: 768px (tablet), 1024px (desktop)
- Mobile menu toggle is handled in `index.html` for navigation
- Individual pages should maintain their own responsive layouts

## Important Notes

- No build process or package management required
- No server-side functionality - all features are client-side
- Data shown in the interfaces is typically mock/demo data
- The platform focuses on GEO (Generative Engine Optimization) for AI-powered search visibility
- Platform is designed for monitoring brand presence across AI platforms (ChatGPT, Perplexity, Claude, Gemini, You.com, Bing Chat)