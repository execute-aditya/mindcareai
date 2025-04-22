const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('./models/User');
const Message = require('./models/Message');
const dotenv = require('dotenv');
const axios = require('axios');

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

// Login
// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });

app.get('/', (req, res) => {
    res.redirect('/auth.html');
  });
  

// Signup
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.json({ success: false, message: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed });
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

  await Message.create({ userId, role: 'user', content: message });

  const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
    model: 'llama3-8b-8192',
    messages: [{ role: 'user', content: message }],
    temperature: 0.7
  }, {
    headers: {
      Authorization: `Bearer ${process.env.GROQ_KEY}`,
      'Content-Type': 'application/json',
    }
  });

  const botReply = response.data.choices[0].message.content;

  await Message.create({ userId, role: 'bot', content: botReply });

  res.json({ reply: botReply });
});
require('dotenv').config();



// Start server
app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
