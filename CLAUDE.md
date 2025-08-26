# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**leapgeo-sys** is a Generative Engine Optimization (GEO) Operations Platform for Leap Company. It's a collection of standalone HTML pages that form a comprehensive content management and monitoring system for managing brand visibility across AI-powered search engines and platforms. The system is designed for monitoring and optimizing brand presence across AI platforms including ChatGPT, Perplexity, Claude, Gemini, You.com, and Bing Chat.

## Running the Project

Since this is a static HTML project with no build process:
```bash
# Using Python's built-in server
python3 -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000

# Then open http://localhost:8000/index.html in your browser
```

## Architecture

This is a static HTML-based project where each HTML file is a self-contained single-page application. Key architectural patterns:

1. **Main Navigation Hub**: `index.html` serves as the central dashboard with:
   - Collapsible sidebar navigation with categorized sections
   - iframe-based content loading for individual modules
   - Real-time monitoring widgets displaying key metrics (AVI, Coverage Rate, Share of Voice)
   - Mobile-responsive hamburger menu

2. **Module Structure**: Each module is numbered with a prefix indicating its category:
   - `00x-` - Diagnostic and strategy tools
   - `01x-` - Content creation and management tools  
   - `02x-` - Content orchestration
   - `03x-` - Channel configuration
   - `04x-` - User journey tracking
   - `05x-` - Analytics dashboards

3. **Data Flow**: All modules use mock/demo data defined inline within JavaScript. No server-side API integration.

## Common Development Tasks

### Adding New Modules
When creating a new module:
1. Follow the naming convention: `XXx-module-name.html` (where XX is the category number)
2. Copy the basic structure from an existing module to ensure consistency
3. Add navigation entry in `index.html` under the appropriate category section
4. Include standard dependencies:
   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
   <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
   ```

### Working with Charts
All data visualizations use ECharts v5.4.3:
- Chart instances are typically initialized with `echarts.init(document.getElementById('chart-id'))`
- Mock data is defined as JavaScript objects/arrays near chart initialization
- Common chart types: line, bar, pie, scatter, heatmap
- Charts should be responsive: use `window.addEventListener('resize', () => myChart.resize())`

### Maintaining Consistent Styling
The platform uses CSS custom properties for theming. Key variables to maintain:
```css
:root {
    --primary: #667eea;
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
}
```

### Language and Localization
- The UI is primarily in Chinese (zh-CN)
- Key terminology: GEO (生成式引擎优化), AVI (AI能见度指数), Share of Voice (声量份额)
- Maintain bilingual labels where appropriate (e.g., "GEO Strategy 策略规划")

## Key Technical Patterns

### Navigation System Integration
To add a new page to the navigation:
1. Locate the appropriate category in `index.html` (e.g., `.nav-category[data-category="analytics"]`)
2. Add a new `.nav-link` entry with the correct `data-page` attribute
3. Ensure the iframe loading mechanism will work: `document.getElementById('contentFrame').src = 'your-page.html'`

### Mock Data Structure
Mock data typically follows these patterns:
- Time series data: Arrays of objects with `date` and metric values
- Category data: Objects with labels and corresponding values
- Real-time data: Simulated with `setInterval()` updating chart data

### Responsive Design Breakpoints
- Mobile: < 768px (sidebar hidden, hamburger menu visible)
- Tablet: 768px - 1024px
- Desktop: > 1024px (full sidebar visible)

## Important Constraints

- **No Build Process**: Direct file editing only, no compilation or bundling
- **No Backend**: All data is mock/simulated, no API calls
- **Browser Compatibility**: Modern browsers only (ES6+ JavaScript)
- **External Dependencies**: Only CDN-hosted libraries (no npm/node_modules)