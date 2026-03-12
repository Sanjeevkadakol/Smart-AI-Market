const http = require('http');

const data = JSON.stringify({
    name: 'Sanjeev',
    email: 'sanjeevpkadako1@gmail.com',
    password: 'Jeeva@123',
    role: 'cooperative_admin'
});

const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => console.log('HTTP', res.statusCode, raw));
});

req.on('error', (e) => console.error('Socket Error:', e.message));
req.write(data);
req.end();
