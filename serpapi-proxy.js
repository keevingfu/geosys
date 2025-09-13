const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for local development
app.use(cors());
app.use(express.json());

// SerpAPI configuration
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const SERPAPI_BASE_URL = 'https://serpapi.com/search';

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', hasApiKey: !!SERPAPI_KEY });
});

// Search Google and get AI Overview
app.post('/api/google-ai-overview/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        console.log(`Searching for: ${query}`);

        // Step 1: Search Google to get page_token
        const searchResponse = await axios.get(SERPAPI_BASE_URL, {
            params: {
                engine: 'google',
                q: query,
                api_key: SERPAPI_KEY,
                location: 'United States',
                hl: 'en',
                gl: 'us'
            }
        });

        // Check if AI Overview is available
        const aiOverview = searchResponse.data.ai_overview;
        
        if (!aiOverview || !aiOverview.token) {
            console.log('No AI Overview found for query:', query);
            return res.json({
                success: false,
                message: 'No AI Overview available for this query',
                query: query,
                searchResults: searchResponse.data.organic_results ? 
                    searchResponse.data.organic_results.slice(0, 3) : []
            });
        }

        console.log('Found AI Overview token:', aiOverview.token);

        // Step 2: Get AI Overview details
        const overviewResponse = await axios.get(SERPAPI_BASE_URL, {
            params: {
                engine: 'google_ai_overview',
                token: aiOverview.token,
                api_key: SERPAPI_KEY
            }
        });

        // Step 3: Analyze brand presence
        const analysis = analyzeBrandPresence(overviewResponse.data);

        res.json({
            success: true,
            query: query,
            overview: overviewResponse.data,
            analysis: analysis,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching AI Overview:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to fetch AI Overview',
            message: error.response?.data?.error || error.message,
            details: error.response?.data
        });
    }
});

// Track multiple queries
app.post('/api/google-ai-overview/track-queries', async (req, res) => {
    try {
        const { queries } = req.body;
        
        if (!queries || !Array.isArray(queries)) {
            return res.status(400).json({ error: 'Queries array is required' });
        }

        const results = [];
        
        for (const query of queries) {
            try {
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                console.log(`Tracking query: ${query}`);
                
                const searchResponse = await axios.get(SERPAPI_BASE_URL, {
                    params: {
                        engine: 'google',
                        q: query,
                        api_key: SERPAPI_KEY,
                        location: 'United States',
                        hl: 'en',
                        gl: 'us'
                    }
                });

                const aiOverview = searchResponse.data.ai_overview;
                
                if (aiOverview && aiOverview.token) {
                    const overviewResponse = await axios.get(SERPAPI_BASE_URL, {
                        params: {
                            engine: 'google_ai_overview',
                            token: aiOverview.token,
                            api_key: SERPAPI_KEY
                        }
                    });

                    const analysis = analyzeBrandPresence(overviewResponse.data);
                    
                    results.push({
                        query: query,
                        success: true,
                        overview: overviewResponse.data,
                        analysis: analysis
                    });
                } else {
                    results.push({
                        query: query,
                        success: false,
                        message: 'No AI Overview available'
                    });
                }
            } catch (error) {
                console.error(`Error tracking query "${query}":`, error.message);
                results.push({
                    query: query,
                    success: false,
                    error: error.message
                });
            }
        }

        const metrics = generateMetrics(results);

        res.json({
            success: true,
            results: results,
            metrics: metrics,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error tracking queries:', error);
        res.status(500).json({
            error: 'Failed to track queries',
            message: error.message
        });
    }
});

// Analyze brand presence in AI Overview
function analyzeBrandPresence(overviewData, brandName = 'Dymesty') {
    const analysis = {
        mentioned: false,
        mentionCount: 0,
        position: -1,
        context: [],
        competitors: [],
        features: [],
        sentiment: 'neutral'
    };

    // Check if there's overview content
    const content = overviewData.overview || overviewData.answer || '';
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    const lowerText = text.toLowerCase();
    
    // Check for brand mentions
    const brandRegex = new RegExp(brandName, 'gi');
    const matches = text.match(brandRegex);
    
    if (matches) {
        analysis.mentioned = true;
        analysis.mentionCount = matches.length;
        analysis.position = text.indexOf(matches[0]);
        analysis.context.push({
            text: text.substring(Math.max(0, analysis.position - 50), Math.min(text.length, analysis.position + 100)),
            fullText: text
        });
    }

    // Extract competitor mentions
    const competitors = ['Ray-Ban Meta', 'XREAL', 'Solos', 'Bose Frames', 'Amazon Echo Frames', 'Vuzix'];
    competitors.forEach(competitor => {
        if (text.includes(competitor) || lowerText.includes(competitor.toLowerCase())) {
            analysis.competitors.push(competitor);
        }
    });

    // Extract feature mentions
    const features = {
        'no camera': 'privacy',
        'privacy': 'privacy',
        'translation': 'translation',
        'battery life': 'battery',
        '48-hour': 'battery',
        '48 hour': 'battery',
        'titanium': 'design',
        'lightweight': 'design',
        '35g': 'design',
        '35 g': 'design',
        'AI assistant': 'AI features',
        'meeting assistant': 'AI features',
        '$199': 'price',
        'affordable': 'price',
        'smart glasses': 'product category',
        'AI glasses': 'product category'
    };

    Object.entries(features).forEach(([keyword, category]) => {
        if (lowerText.includes(keyword.toLowerCase())) {
            if (!analysis.features.find(f => f.category === category)) {
                analysis.features.push({ keyword, category });
            }
        }
    });

    // Simple sentiment analysis
    const positiveWords = ['best', 'excellent', 'outstanding', 'leading', 'premium', 'innovative', 'advanced', 'superior'];
    const negativeWords = ['limited', 'expensive', 'lacking', 'poor', 'inferior', 'basic', 'outdated'];
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (analysis.mentioned) {
        if (positiveCount > negativeCount) {
            analysis.sentiment = 'positive';
        } else if (negativeCount > positiveCount) {
            analysis.sentiment = 'negative';
        }
    }

    return analysis;
}

// Generate performance metrics
function generateMetrics(trackingResults) {
    const metrics = {
        totalQueries: trackingResults.length,
        successfulQueries: 0,
        brandMentions: 0,
        averagePosition: 0,
        featuresCovered: new Set(),
        competitorComparison: {},
        sentimentBreakdown: {
            positive: 0,
            neutral: 0,
            negative: 0
        }
    };

    const positions = [];
    
    trackingResults.forEach(result => {
        if (result.success && result.analysis) {
            metrics.successfulQueries++;
            
            if (result.analysis.mentioned) {
                metrics.brandMentions++;
                if (result.analysis.position > -1) {
                    positions.push(result.analysis.position);
                }
                
                result.analysis.features.forEach(feature => {
                    metrics.featuresCovered.add(feature.category);
                });
                
                result.analysis.competitors.forEach(competitor => {
                    metrics.competitorComparison[competitor] = 
                        (metrics.competitorComparison[competitor] || 0) + 1;
                });

                metrics.sentimentBreakdown[result.analysis.sentiment]++;
            }
        }
    });

    if (positions.length > 0) {
        metrics.averagePosition = 
            positions.reduce((a, b) => a + b, 0) / positions.length;
    }

    metrics.presenceRate = metrics.successfulQueries > 0 
        ? (metrics.brandMentions / metrics.successfulQueries * 100).toFixed(1)
        : 0;
    metrics.featuresCovered = Array.from(metrics.featuresCovered);

    return metrics;
}

// Start server
app.listen(PORT, () => {
    console.log(`SerpAPI proxy server running on http://localhost:${PORT}`);
    console.log(`API Key configured: ${SERPAPI_KEY ? 'Yes' : 'No'}`);
    console.log('\nEndpoints:');
    console.log(`- GET  http://localhost:${PORT}/health`);
    console.log(`- POST http://localhost:${PORT}/api/google-ai-overview/search`);
    console.log(`- POST http://localhost:${PORT}/api/google-ai-overview/track-queries`);
});

// Handle errors
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});