const axios = require('axios');

async function testApi() {
    try {
        const res = await axios.get('http://localhost:5000/api/products');
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Failure:', err.response ? err.response.data : err.message);
    }
}

testApi();
