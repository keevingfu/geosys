# Google AI Overview API Setup Guide

## Overview
This guide explains how to use the integrated Google AI Overview API with the Dymestygeo-sys project.

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key
Your SerpAPI key is already configured in the `.env` file. The key is protected and will not be committed to version control.

### 3. Start the Proxy Server
Since SerpAPI doesn't support direct browser calls (CORS), we need to run a local proxy server:

```bash
node serpapi-proxy.js
```

The server will run on `http://localhost:3001` and show:
- API Key configured: Yes
- Available endpoints

### 4. Test the API
Open the test page in your browser:
```bash
open test-google-ai-overview.html
```

Or visit: `http://localhost:8000/test-google-ai-overview.html` if running the Python server.

## Available Features

### 1. Single Query Search
- Enter any search query
- Get AI Overview content if available
- See brand analysis including:
  - Mention detection
  - Feature extraction
  - Competitor analysis
  - Sentiment analysis

### 2. Batch Query Testing
- Test multiple queries at once
- Get aggregated metrics:
  - Presence rate
  - Feature coverage
  - Competitor comparison

### 3. Integrated Monitor Page
Access the full monitoring dashboard:
- Navigate to "Monitoring" → "Google AI Overview Monitor" in the main application
- Or directly open: `08j-google-ai-overview-monitor.html`

## API Endpoints

The proxy server provides these endpoints:

1. **Health Check**: `GET http://localhost:3001/health`
2. **Single Search**: `POST http://localhost:3001/api/google-ai-overview/search`
   ```json
   {
     "query": "smart glasses without camera"
   }
   ```

3. **Batch Tracking**: `POST http://localhost:3001/api/google-ai-overview/track-queries`
   ```json
   {
     "queries": ["query1", "query2", "query3"]
   }
   ```

## Important Notes

1. **API Limits**: The free SerpAPI plan has limited searches. Use wisely.
2. **Rate Limiting**: The proxy adds 1-second delays between batch queries.
3. **AI Overview Availability**: Not all queries generate AI Overviews.
4. **CORS**: Always use the proxy server; direct browser calls won't work.

## Troubleshooting

### Proxy Server Issues
If the proxy server doesn't start:
```bash
# Kill any existing process on port 3001
lsof -ti:3001 | xargs kill -9

# Restart the server
node serpapi-proxy.js
```

### No AI Overview Results
Some queries don't trigger AI Overviews. Try:
- More general queries
- Popular topics
- Questions that benefit from summarization

### API Key Issues
Check that your `.env` file contains:
```
SERPAPI_KEY=your_actual_key_here
```

## Security
- API key is stored in `.env` (git-ignored)
- Never commit API keys to version control
- Use environment variables in production

## Next Steps
1. Monitor brand presence regularly
2. Track competitor performance
3. Optimize content based on insights
4. Export data for reporting