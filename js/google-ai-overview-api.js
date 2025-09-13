/**
 * Google AI Overview API Integration
 * Integrates with SerpAPI to fetch and analyze Google AI Overview data
 */

class GoogleAIOverviewAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://serpapi.com/search';
        this.cache = new Map();
        this.cacheExpiry = 4 * 60 * 1000; // 4 minutes (page_token expiry)
    }

    /**
     * Search Google and get page token for AI Overview
     */
    async searchGoogle(query) {
        const params = new URLSearchParams({
            engine: 'google',
            q: query,
            api_key: this.apiKey
        });

        try {
            const response = await fetch(`${this.baseUrl}?${params}`);
            const data = await response.json();
            
            // Extract page_token from search results
            if (data.ai_overview && data.ai_overview.page_token) {
                return data.ai_overview.page_token;
            }
            
            throw new Error('No AI Overview found for this query');
        } catch (error) {
            console.error('Error searching Google:', error);
            throw error;
        }
    }

    /**
     * Fetch AI Overview details using page token
     */
    async getAIOverview(pageToken) {
        // Check cache first
        const cacheKey = `overview_${pageToken}`;
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheExpiry) {
                return cached.data;
            }
        }

        const params = new URLSearchParams({
            engine: 'google_ai_overview',
            page_token: pageToken,
            api_key: this.apiKey
        });

        try {
            const response = await fetch(`${this.baseUrl}?${params}`);
            const data = await response.json();
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error('Error fetching AI Overview:', error);
            throw error;
        }
    }

    /**
     * Analyze AI Overview for brand mentions
     */
    analyzeBrandPresence(overviewData, brandName = 'Dymesty') {
        const analysis = {
            mentioned: false,
            mentionCount: 0,
            position: -1,
            context: [],
            competitors: [],
            features: []
        };

        if (!overviewData.text_blocks) return analysis;

        overviewData.text_blocks.forEach((block, index) => {
            const text = this.extractTextFromBlock(block);
            
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
            const features = [
                'no camera', 'privacy', 'translation', 'battery life',
                'titanium', 'lightweight', 'AI assistant', '$199'
            ];
            features.forEach(feature => {
                if (text.toLowerCase().includes(feature)) {
                    analysis.features.push(feature);
                }
            });
        });

        return analysis;
    }

    /**
     * Extract text from different block types
     */
    extractTextFromBlock(block) {
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
     * Track multiple queries over time
     */
    async trackQueries(queries) {
        const results = [];
        
        for (const query of queries) {
            try {
                const pageToken = await this.searchGoogle(query);
                const overview = await this.getAIOverview(pageToken);
                const analysis = this.analyzeBrandPresence(overview);
                
                results.push({
                    query: query,
                    timestamp: new Date().toISOString(),
                    overview: overview,
                    analysis: analysis,
                    success: true
                });
            } catch (error) {
                results.push({
                    query: query,
                    timestamp: new Date().toISOString(),
                    error: error.message,
                    success: false
                });
            }
            
            // Rate limiting - wait 1 second between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        return results;
    }

    /**
     * Generate performance metrics
     */
    generateMetrics(trackingResults) {
        const metrics = {
            totalQueries: trackingResults.length,
            successfulQueries: 0,
            brandMentions: 0,
            averagePosition: 0,
            featuresCovered: new Set(),
            competitorComparison: {}
        };

        const positions = [];
        
        trackingResults.forEach(result => {
            if (result.success) {
                metrics.successfulQueries++;
                
                if (result.analysis.mentioned) {
                    metrics.brandMentions++;
                    positions.push(result.analysis.position);
                    
                    result.analysis.features.forEach(feature => {
                        metrics.featuresCovered.add(feature);
                    });
                    
                    result.analysis.competitors.forEach(competitor => {
                        metrics.competitorComparison[competitor] = 
                            (metrics.competitorComparison[competitor] || 0) + 1;
                    });
                }
            }
        });

        if (positions.length > 0) {
            metrics.averagePosition = 
                positions.reduce((a, b) => a + b, 0) / positions.length;
        }

        metrics.presenceRate = 
            (metrics.brandMentions / metrics.successfulQueries * 100).toFixed(1);
        metrics.featuresCovered = Array.from(metrics.featuresCovered);

        return metrics;
    }
}

// Mock implementation for demo purposes
class MockGoogleAIOverviewAPI extends GoogleAIOverviewAPI {
    constructor() {
        super('demo_key');
        this.mockData = {
            'smart glasses without camera': {
                text_blocks: [
                    {
                        type: 'paragraph',
                        text: 'Smart glasses without cameras prioritize privacy while offering advanced features. The Dymesty AI Glasses stand out with their 35g titanium frame, making them among the lightest available.'
                    },
                    {
                        type: 'list',
                        items: [
                            'Real-time translation in 40+ languages',
                            'AI meeting assistant with automatic transcription',
                            '48-hour battery life - industry leading',
                            'No camera design for privacy-conscious users'
                        ]
                    },
                    {
                        type: 'paragraph',
                        text: 'At $199, Dymesty offers premium features at an accessible price point compared to competitors like Ray-Ban Meta ($299+) or Bose Frames ($249).'
                    }
                ]
            },
            'AI glasses for meetings': {
                text_blocks: [
                    {
                        type: 'paragraph',
                        text: 'AI-powered smart glasses are revolutionizing meeting productivity. Leading options include Dymesty AI Glasses with real-time transcription and Ray-Ban Meta with video recording capabilities.'
                    }
                ]
            }
        };
    }

    async searchGoogle(query) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return `mock_token_${query}`;
    }

    async getAIOverview(pageToken) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const query = pageToken.replace('mock_token_', '');
        return {
            text_blocks: this.mockData[query] || [{
                type: 'paragraph',
                text: 'No specific data available for this query in demo mode.'
            }],
            references: [
                { url: 'https://dymesty.com', title: 'Dymesty Official' },
                { url: 'https://techradar.com', title: 'TechRadar Review' }
            ]
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GoogleAIOverviewAPI, MockGoogleAIOverviewAPI };
}