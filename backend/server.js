const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { incidentOperations, cameraOperations, userOperations } = require('../database/operations');

const app = express();
const PORT = process.env.PORT || process.env.NEXT_PUBLIC_BACKEND_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Supabase database is initialized in database/operations.js
// Run database/seed.js to populate initial data

// API Routes
app.get('/api/incidents', async (req, res) => {
  try {
    const { resolved } = req.query;
    let resolvedFilter = null;
    
    if (resolved !== undefined) {
      resolvedFilter = resolved === 'true';
    }

    const incidents = await incidentOperations.getIncidents(resolvedFilter);
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/incidents/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedIncident = await incidentOperations.toggleIncidentResolved(parseInt(id));
    res.json(updatedIncident);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cameras', async (req, res) => {
  try {
    const cameras = await cameraOperations.getCameras();
    res.json(cameras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Placeholder thumbnail endpoint
app.get('/api/placeholder-thumbnail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const incident = await incidentOperations.getIncidentById(parseInt(id));

    // Return placeholder thumbnail data
    res.json({
      id: parseInt(id),
      type: incident.type,
      timestamp: incident.ts_start,
      thumbnailUrl: `https://via.placeholder.com/160x90/1f2937/ffffff?text=${encodeURIComponent(incident.type)}`
    });
  } catch (error) {
    res.status(404).json({ error: 'Incident not found' });
  }
});

// Authentication endpoints
const JWT_SECRET = process.env.JWT_SECRET || 'securesight-x-secret-key';

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await userOperations.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await userOperations.updateLastLogin(user.id);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar_url
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userOperations.getUserById(req.user.id);

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar_url,
      lastLogin: user.last_login
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { email, avatar_url } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await userOperations.updateUserProfile(req.user.id, { email, avatar_url });
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`SecureSight Backend running on port ${PORT}`);
});