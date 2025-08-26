# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**leapgeo-sys** is the GEO (Generative Engine Optimization) Operations Platform for Leap Company. It's a comprehensive content management and monitoring system designed to manage brand visibility across AI-powered search engines and platforms including ChatGPT, Perplexity, Claude, Gemini, You.com, and Bing Chat.

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
- Primary language: Chinese (zh-CN)
- Key terminology maintained: 
  - GEO (生成式引擎优化)
  - AVI (AI能见度指数) 
  - Share of Voice (声量份额)

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