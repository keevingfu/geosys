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