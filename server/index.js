const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('./models/User');
const Message = require('./models/Message');
const dotenv = require('dotenv');
const axios = require('axios');
const bodyParser = require('body-parser'); // At the top of your file

dotenv.config();
const app = express();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("Mongo Error:", err));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
// Login // Login
app.use(bodyParser.json()); // Before your route definitions
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/api/login', async (req, res) => {
  console.log('Request body:', req.body); // Inspect the data received
  const { username, password } = req.body;
  console.log('Username:', username, 'Password:', password); // Check extracted values
  const user = await User.findOne({ username });
  console.log('User from database:', user); // See if the user is found
  if (user && await bcrypt.compare(password, user.password)) {
      console.log('Login successful');
      req.session.userId = user._id;
      res.json({ success: true });
  } else {
      console.log('Login failed');
      res.json({ success: false, message: "Invalid credentials" });
  }
});
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else {
    res.redirect('/auth.html');
  }
});
// Signup
app.post('/api/signup', async (req, res) => {
  const { name, mobile, username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.json({ success: false, message: "Username already exists" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed, name, mobile }); //used name and mobile here
  req.session.userId = user._id;
  res.json({ success: true });
});
// server/index.js
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.json({ success: false, message: 'Failed to logout.' });
      }
      res.json({ success: true, message: 'Logged out successfully.' });
    });
  });
// Chat
app.post('/api/chat', async (req, res) => {
  const userId = req.session.userId;
  const { message } = req.body;
  if (!userId) return res.status(401).json({ success: false, message: "Not logged in" });
  try {
    await Message.create({ userId, role: 'user', content: message });
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7
    }, {
        headers: {
            Authorization: `Bearer ${process.env.GROQ_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    console.log('AI API Response:', response.data); // Log the full response

    const aiResponse = response.data.choices[0]?.message?.content;
    if (!aiResponse) {
        console.error('AI response is empty or invalid:', response.data);
        return res.status(500).json({ success: false, message: 'AI response is invalid' });
    }

    await Message.create({ userId, role: 'bot', content: aiResponse });
    res.json({ success: true, reply: aiResponse });
} catch (error) {
    console.error('Error during chat:', error);
    res.status(500).json({ success: false, message: "Failed to process chat request", error: error.message });
}
});
app.get('/api/check-session', (req, res) => {
  if (req.session.userId) {
    res.json({ success: true, message: 'Session is active' });
  } else {
    res.json({ success: false, message: 'No active session' });
  }
});
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
