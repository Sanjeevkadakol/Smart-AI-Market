const axios = require('axios');

async function testEndpoints() {
    const start = Date.now();
    try {
        console.log('Testing /api/market/trends...');
        const trends = await axios.get('http://localhost:5000/api/market/trends');
        console.log('Trends Status:', trends.status);
        console.log('Time:', (Date.now() - start), 'ms');

        const start2 = Date.now();
        console.log('Testing /api/ai/aiPrediction/Tomato...');
        const pred = await axios.get('http://localhost:5000/api/ai/aiPrediction/Tomato');
        console.log('Prediction Status:', pred.status);
        console.log('Time:', (Date.now() - start2), 'ms');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) console.error('Response:', err.response.data);
        process.exit(1);
    }
}

testEndpoints();
