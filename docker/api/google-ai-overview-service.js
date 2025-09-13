const express = require('express');
const axios = require('axios');
const router = express.Router();

// SerpAPI configuration
const SERPAPI_KEY = process.env.SERPAPI_KEY || 'demo_key';
const SERPAPI_BASE_URL = 'https://serpapi.com/search';

/**
 * Search Google and get AI Overview data
 */
router.post('/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        // Step 1: Search Google to get page_token
        const searchResponse = await axios.get(SERPAPI_BASE_URL, {
            params: {
                engine: 'google',
                q: query,
                api_key: SERPAPI_KEY
            }
        });

        const pageToken = searchResponse.data?.ai_overview?.page_token;
        
        if (!pageToken) {
            return res.json({
                success: false,
                message: 'No AI Overview available for this query',
                query: query
            });
        }

        // Step 2: Get AI Overview details
        const overviewResponse = await axios.get(SERPAPI_BASE_URL, {
            params: {
                engine: 'google_ai_overview',
                page_token: pageToken,
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
        console.error('Error fetching AI Overview:', error);
        res.status(500).json({
            error: 'Failed to fetch AI Overview',
            message: error.message
        });
    }
});

/**
 * Track multiple queries
 */
router.post('/track-queries', async (req, res) => {
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
                
                const searchResponse = await axios.get(SERPAPI_BASE_URL, {
                    params: {
                        engine: 'google',
                        q: query,
                        api_key: SERPAPI_KEY
                    }
                });

                const pageToken = searchResponse.data?.ai_overview?.page_token;
                
                if (pageToken) {
                    const overviewResponse = await axios.get(SERPAPI_BASE_URL, {
                        params: {
                            engine: 'google_ai_overview',
                            page_token: pageToken,
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

/**
 * Get historical data (mock for demo)
 */
router.get('/historical-data', async (req, res) => {
    // In production, this would fetch from database
    const mockData = {
        presenceTrend: [
            { month: 'Jan', dymesty: 45, rayban: 88, xreal: 70, solos: 55 },
            { month: 'Feb', dymesty: 52, rayban: 89, xreal: 72, solos: 54 },
            { month: 'Mar', dymesty: 58, rayban: 88, xreal: 71, solos: 52 },
            { month: 'Apr', dymesty: 65, rayban: 90, xreal: 70, solos: 50 },
            { month: 'May', dymesty: 68, rayban: 91, xreal: 68, solos: 48 },
            { month: 'Jun', dymesty: 72, rayban: 90, xreal: 67, solos: 46 },
            { month: 'Jul', dymesty: 75, rayban: 91, xreal: 66, solos: 45 },
            { month: 'Aug', dymesty: 78, rayban: 92, xreal: 65, solos: 44 },
            { month: 'Sep', dymesty: 82, rayban: 91, xreal: 66, solos: 43 },
            { month: 'Oct', dymesty: 85, rayban: 92, xreal: 65, solos: 42 },
            { month: 'Nov', dymesty: 87, rayban: 92, xreal: 65, solos: 42 },
            { month: 'Dec', dymesty: 87, rayban: 92, xreal: 65, solos: 42 }
        ],
        topKeywords: [
            { keyword: 'smart glasses no camera', presence: 95 },
            { keyword: 'AI glasses privacy', presence: 92 },
            { keyword: 'lightweight smart glasses', presence: 88 },
            { keyword: 'smart glasses translation', presence: 85 },
            { keyword: 'AI meeting assistant glasses', presence: 82 },
            { keyword: 'titanium smart glasses', presence: 78 },
            { keyword: 'long battery smart glasses', presence: 75 },
            { keyword: 'affordable AI glasses', presence: 72 }
        ]
    };

    res.json({
        success: true,
        data: mockData,
        timestamp: new Date().toISOString()
    });
});

/**
 * Analyze brand presence in AI Overview
 */
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

    if (!overviewData.text_blocks) return analysis;

    overviewData.text_blocks.forEach((block, index) => {
        const text = extractTextFromBlock(block);
        const lowerText = text.toLowerCase();
        
        // Check for brand mentions
        const brandRegex = new RegExp(brandName, 'gi');
        const matches = text.match(brandRegex);
        
        if (matches) {
            analysis.mentioned = true;
            analysis.mentionCount += matches.length;
            if (analysis.position === -1) {
                analysis.position = index + 1;
            }
            analysis.context.push({
                blockIndex: index,
                text: text,
                type: block.type
            });
        }

        // Extract competitor mentions
        const competitors = ['Ray-Ban Meta', 'XREAL', 'Solos', 'Bose Frames'];
        competitors.forEach(competitor => {
            if (text.includes(competitor)) {
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
            'titanium': 'design',
            'lightweight': 'design',
            '35g': 'design',
            'AI assistant': 'AI features',
            'meeting assistant': 'AI features',
            '$199': 'price',
            'affordable': 'price'
        };

        Object.entries(features).forEach(([keyword, category]) => {
            if (lowerText.includes(keyword)) {
                if (!analysis.features.find(f => f.category === category)) {
                    analysis.features.push({ keyword, category });
                }
            }
        });

        // Simple sentiment analysis
        const positiveWords = ['best', 'excellent', 'outstanding', 'leading', 'premium', 'innovative'];
        const negativeWords = ['limited', 'expensive', 'lacking', 'poor', 'inferior'];
        
        const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
        
        if (positiveCount > negativeCount) {
            analysis.sentiment = 'positive';
        } else if (negativeCount > positiveCount) {
            analysis.sentiment = 'negative';
        }
    });

    return analysis;
}

/**
 * Extract text from different block types
 */
function extractTextFromBlock(block) {
    switch (block.type) {
        case 'paragraph':
            return block.text || '';
        case 'list':
            return block.items ? block.items.join(' ') : '';
        case 'comparison':
            return JSON.stringify(block.data || {});
        default:
            return JSON.stringify(block);
    }
}

/**
 * Generate performance metrics
 */
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
                positions.push(result.analysis.position);
                
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

module.exports = router;