const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create tables
db.serialize(() => {
  // Cameras table
  db.run(`CREATE TABLE cameras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'active'
  )`);

  // Incidents table
  db.run(`CREATE TABLE incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cameraId INTEGER,
    type TEXT NOT NULL,
    tsStart DATETIME NOT NULL,
    tsEnd DATETIME NOT NULL,
    thumbnailUrl TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (cameraId) REFERENCES cameras (id)
  )`);

  // Users table
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'operator',
    avatar_url TEXT,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed data
  const cameras = [
    { name: 'Shop Floor Camera A', location: 'Shop Floor' },
    { name: 'Vault Camera B', location: 'Vault' },
    { name: 'Entrance Camera C', location: 'Entrance' }
  ];

  cameras.forEach(camera => {
    db.run('INSERT INTO cameras (name, location) VALUES (?, ?)', [camera.name, camera.location]);
  });

  // Seed incidents - 12+ incidents across 24-hour span with 3+ threat types
  const incidents = [
    // Early morning incidents
    { cameraId: 1, type: 'Unauthorised Access', tsStart: '2025-07-21 02:15:00', tsEnd: '2025-07-21 02:30:00', resolved: true },
    { cameraId: 3, type: 'Face Recognised', tsStart: '2025-07-21 03:45:00', tsEnd: '2025-07-21 03:46:00', resolved: true },

    // Morning incidents
    { cameraId: 2, type: 'Gun Threat', tsStart: '2025-07-21 08:20:00', tsEnd: '2025-07-21 08:25:00', resolved: true },
    { cameraId: 1, type: 'Traffic Congestion', tsStart: '2025-07-21 09:30:00', tsEnd: '2025-07-21 09:45:00', resolved: true },

    // Afternoon incidents
    { cameraId: 1, type: 'Unauthorised Access', tsStart: '2025-07-21 14:23:00', tsEnd: '2025-07-21 14:37:00', resolved: false },
    { cameraId: 2, type: 'Face Recognised', tsStart: '2025-07-21 15:10:00', tsEnd: '2025-07-21 15:11:00', resolved: true },
    { cameraId: 1, type: 'Gun Threat', tsStart: '2025-07-21 15:45:00', tsEnd: '2025-07-21 15:50:00', resolved: false },
    { cameraId: 3, type: 'Unauthorised Access', tsStart: '2025-07-21 16:30:00', tsEnd: '2025-07-21 16:45:00', resolved: false },

    // Evening incidents
    { cameraId: 2, type: 'Traffic Congestion', tsStart: '2025-07-21 18:15:00', tsEnd: '2025-07-21 18:30:00', resolved: true },
    { cameraId: 1, type: 'Face Recognised', tsStart: '2025-07-21 19:20:00', tsEnd: '2025-07-21 19:21:00', resolved: true },
    { cameraId: 3, type: 'Gun Threat', tsStart: '2025-07-21 20:45:00', tsEnd: '2025-07-21 20:50:00', resolved: false },
    { cameraId: 2, type: 'Unauthorised Access', tsStart: '2025-07-21 21:30:00', tsEnd: '2025-07-21 21:45:00', resolved: false },

    // Late night incidents
    { cameraId: 1, type: 'Unauthorised Access', tsStart: '2025-07-21 22:15:00', tsEnd: '2025-07-21 22:30:00', resolved: false },
    { cameraId: 3, type: 'Traffic Congestion', tsStart: '2025-07-21 23:10:00', tsEnd: '2025-07-21 23:25:00', resolved: false },
    { cameraId: 2, type: 'Gun Threat', tsStart: '2025-07-21 23:45:00', tsEnd: '2025-07-21 23:50:00', resolved: false }
  ];

  incidents.forEach(incident => {
    db.run('INSERT INTO incidents (cameraId, type, tsStart, tsEnd, resolved) VALUES (?, ?, ?, ?, ?)',
      [incident.cameraId, incident.type, incident.tsStart, incident.tsEnd, incident.resolved]);
  });

  // Seed users
  const defaultPassword = bcrypt.hashSync('admin123', 10);
  const users = [
    { username: 'admin', email: 'admin@mandlac.com', password_hash: defaultPassword, role: 'admin' },
    { username: 'operator', email: 'operator@mandlac.com', password_hash: defaultPassword, role: 'operator' },
    { username: 'viewer', email: 'viewer@mandlac.com', password_hash: defaultPassword, role: 'viewer' }
  ];

  users.forEach(user => {
    db.run('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [user.username, user.email, user.password_hash, user.role]);
  });
});

// API Routes
app.get('/api/incidents', (req, res) => {
  const { resolved } = req.query;
  let query = `
    SELECT i.*, c.name as cameraName, c.location as cameraLocation 
    FROM incidents i 
    JOIN cameras c ON i.cameraId = c.id
  `;
  const params = [];

  if (resolved !== undefined) {
    query += ' WHERE i.resolved = ?';
    params.push(resolved === 'true' ? 1 : 0);
  }

  query += ' ORDER BY i.tsStart DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Add placeholder thumbnails for incidents
    const rowsWithThumbnails = rows.map(row => ({
      ...row,
      thumbnailUrl: row.thumbnailUrl || `/api/placeholder-thumbnail/${row.id}`
    }));

    res.json(rowsWithThumbnails);
  });
});

app.patch('/api/incidents/:id/resolve', (req, res) => {
  const { id } = req.params;

  db.run('UPDATE incidents SET resolved = TRUE WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json({ message: 'Incident resolved successfully', id: parseInt(id) });
  });
});

app.get('/api/cameras', (req, res) => {
  db.all('SELECT * FROM cameras', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Placeholder thumbnail endpoint
app.get('/api/placeholder-thumbnail/:id', (req, res) => {
  const { id } = req.params;

  // Get incident details for thumbnail generation
  db.get('SELECT * FROM incidents WHERE id = ?', [id], (err, incident) => {
    if (err || !incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Return placeholder thumbnail data
    res.json({
      id: parseInt(id),
      type: incident.type,
      timestamp: incident.tsStart,
      thumbnailUrl: `https://via.placeholder.com/160x90/1f2937/ffffff?text=${encodeURIComponent(incident.type)}`
    });
  });
});

// Authentication endpoints
const JWT_SECRET = process.env.JWT_SECRET || 'mandlac-x-secret-key';

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password_hash, (err, isValid) => {
      if (err) {
        return res.status(500).json({ error: 'Authentication error' });
      }

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

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
    });
  });
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

app.get('/api/users/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, role, avatar_url, last_login FROM users WHERE id = ?',
    [req.user.id], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar_url,
        lastLogin: user.last_login
      });
    });
});

app.put('/api/users/profile', authenticateToken, (req, res) => {
  const { email, avatar_url } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  db.run('UPDATE users SET email = ?, avatar_url = ? WHERE id = ?',
    [email, avatar_url, req.user.id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: 'Profile updated successfully' });
    });
});

app.listen(PORT, () => {
  console.log(`SecureSight Backend running on port ${PORT}`);
});