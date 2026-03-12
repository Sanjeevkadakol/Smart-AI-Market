const axios = require('axios');
async function testLogin() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'sanjeevpkadakol1@gmail.com',
            password: 'Jeeva@123',
            role: 'cooperative_admin'
        });
        console.log("SUCCESS:", res.data);
    } catch (e) {
        console.error("FAILED:", e.response?.data || e.message);
    }
}
testLogin();
