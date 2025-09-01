const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  res.json({
    success: true,
    message: 'Login test successful',
    data: {
      user: {
        user_id: 'test-123',
        user_name: 'Test User',
        email: req.body.email,
        rol: 'user',
        current_level: 1,
        objetive: 'Test objective'
      },
      token: 'test-token-123'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
});
