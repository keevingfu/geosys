const axios = require('axios');
require('dotenv').config();

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const SERPAPI_BASE_URL = 'https://serpapi.com/search';

console.log('Testing SerpAPI connection...');
console.log('API Key:', SERPAPI_KEY ? `${SERPAPI_KEY.substring(0, 10)}...` : 'Not found');

async function testSerpAPI() {
    try {
        // Test 1: Basic search
        console.log('\n1. Testing basic Google search...');
        const searchResponse = await axios.get(SERPAPI_BASE_URL, {
            params: {
                engine: 'google',
                q: 'best smart glasses 2024',
                api_key: SERPAPI_KEY,
                location: 'United States',
                hl: 'en',
                gl: 'us',
                num: 10
            }
        });

        console.log('✓ Search successful!');
        console.log('- Search results found:', searchResponse.data.organic_results?.length || 0);
        console.log('- AI Overview available:', !!searchResponse.data.ai_overview);
        
        if (searchResponse.data.ai_overview) {
            const token = searchResponse.data.ai_overview.token || 
                          searchResponse.data.ai_overview.page_token ||
                          searchResponse.data.ai_overview_token;
            console.log('- AI Overview token:', token);
            console.log('- AI Overview data:', JSON.stringify(searchResponse.data.ai_overview, null, 2));
            
            if (token) {
                // Test 2: Get AI Overview details
                console.log('\n2. Testing AI Overview API...');
                const overviewResponse = await axios.get(SERPAPI_BASE_URL, {
                    params: {
                        engine: 'google_ai_overview',
                        page_token: token,  // Use page_token parameter
                        api_key: SERPAPI_KEY
                    }
                });

                console.log('✓ AI Overview fetched successfully!');
                console.log('- Full response:', JSON.stringify(overviewResponse.data, null, 2));
                
                // Try different fields for the overview content
                const overview = overviewResponse.data.text_blocks || 
                               overviewResponse.data.overview || 
                               overviewResponse.data.answer || 
                               JSON.stringify(overviewResponse.data);
                               
                console.log('- Overview type:', typeof overview);
                console.log('- Overview content:', overview);
                
                // Check for Dymesty mentions
                const textContent = typeof overview === 'string' ? overview : JSON.stringify(overview);
                const dymestyMentioned = textContent.toLowerCase().includes('dymesty');
                console.log('- Dymesty mentioned:', dymestyMentioned ? 'Yes!' : 'No');
            } else {
                console.log('⚠ No AI Overview token found in response');
            }
        } else {
            console.log('⚠ No AI Overview available for this query');
        }

        // Test 3: Account info
        console.log('\n3. Checking account info...');
        const accountResponse = await axios.get('https://serpapi.com/account', {
            params: {
                api_key: SERPAPI_KEY
            }
        });

        console.log('✓ Account info retrieved!');
        console.log('- Account email:', accountResponse.data.account_email);
        console.log('- Plan:', accountResponse.data.plan_name);
        console.log('- Searches remaining:', accountResponse.data.searches_left);
        console.log('- Total searches:', accountResponse.data.total_searches);

    } catch (error) {
        console.error('\n❌ Error:', error.response?.data?.error || error.message);
        if (error.response?.status === 401) {
            console.error('Authentication failed. Please check your API key.');
        }
    }
}

// Run the test
testSerpAPI();