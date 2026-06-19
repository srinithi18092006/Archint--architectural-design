const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Safe URI logging to prevent credential leaks in deployment logs
const getLogSafeUri = (uri) => {
  if (!uri) return uri;
  try {
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
    if (!match) return uri;
    const prefix = match[1];
    const rest = match[2];
    const lastAtIndex = rest.lastIndexOf('@');
    if (lastAtIndex === -1) return uri;
    const credentials = rest.substring(0, lastAtIndex);
    const hostAndRest = rest.substring(lastAtIndex);
    const colonIndex = credentials.indexOf(':');
    if (colonIndex === -1) {
      return `${prefix}****${hostAndRest}`;
    }
    const username = credentials.substring(0, colonIndex);
    return `${prefix}${username}:****${hostAndRest}`;
  } catch (e) {
    return 'Invalid URI';
  }
};

// Auto-encode credentials to avoid parsing issues (e.g. passwords containing '@')
const sanitizeMongoUri = (uri) => {
  if (!uri) return uri;
  try {
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
    if (!match) return uri;
    
    const prefix = match[1];
    const rest = match[2];
    
    let pathStartIndex = rest.indexOf('/');
    if (pathStartIndex === -1) pathStartIndex = rest.indexOf('?');
    if (pathStartIndex === -1) pathStartIndex = rest.length;
    
    const credsAndHost = rest.substring(0, pathStartIndex);
    const pathAndQuery = rest.substring(pathStartIndex);
    
    const lastAtIndex = credsAndHost.lastIndexOf('@');
    if (lastAtIndex === -1) return uri;
    
    const credentials = credsAndHost.substring(0, lastAtIndex);
    const host = credsAndHost.substring(lastAtIndex + 1);
    
    const colonIndex = credentials.indexOf(':');
    if (colonIndex === -1) {
      return `${prefix}${encodeURIComponent(credentials)}@${host}${pathAndQuery}`;
    }
    
    const username = credentials.substring(0, colonIndex);
    const password = credentials.substring(colonIndex + 1);
    
    return `${prefix}${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}${pathAndQuery}`;
  } catch (e) {
    return uri;
  }
};

console.log('Attempting to connect with URI:', getLogSafeUri(process.env.MONGODB_URI));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const planRoutes = require('./routes/plans');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);


// Database Connection
const mongoUri = sanitizeMongoUri(process.env.MONGODB_URI);
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
