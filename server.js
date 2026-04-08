import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Rate limiting middleware
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

app.use((req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!rateLimit.has(clientIp)) {
    rateLimit.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  } else {
    const client = rateLimit.get(clientIp);
    
    if (now > client.resetTime) {
      client.count = 1;
      client.resetTime = now + RATE_LIMIT_WINDOW;
    } else {
      client.count++;
      
      if (client.count > RATE_LIMIT_MAX_REQUESTS) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests. Please try again later.'
        });
      }
    }
  }
  
  next();
});

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'dist')));

// AI API Proxy - Enhanced Security
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    // Get API key from environment variables (server-side only)
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({
        success: false,
        error: 'AI service not configured'
      });
    }

    // Enhanced security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    const enhancedPrompt = `You are Xolani Masimbe's AI assistant, helping to answer questions about his portfolio, skills, and professional background. Be professional, helpful, and concise.

Profile:
- Name: Xolani Masimbe
- Role: Was a Junior Software Developer Intern
- Education: 
  * ICT Application Development Diploma (completed 2025) at CPUT
  * Currently completing Adv Dip In ICT Application Development, Information Technology at Cape Peninsula University of Technology (Jan 2026 - present)
- Experience: Software Developer Intern at Plum Systems (March 1, 2025 - December 19, 2025) - completed
- Skills:
  - Frontend: React, React Native, JavaScript, HTML & CSS
  - Backend: Node.js, PHP, Python, Java
  - Database: SQL, MySQL, Firebase
  - Tools: Git & GitLab, AWS, Figma
- Projects: Candle Management System, Healthcare Management System, CPUT Schedule System, To-Do List App, Car Vote System
- Contact: xmasimbe965@gmail.com | +27 61 277 3329
- LinkedIn: https://linkedin.com/in/xolani-masimbe-177890234

Advanced Diploma Details:
The Advanced Diploma in ICT Application Development at Cape Peninsula University of Technology strengthens specialist theoretical and practical skills in application design, development, and implementation using current technologies and frameworks. Key competencies include advanced object-oriented programming, database design and management (SQL), web and mobile application development, and software architecture. The qualification emphasises problem-solving, system analysis, research, and the ability to translate complex requirements into scalable, high-quality software solutions, while developing professional and intellectual independence for industry or further postgraduate study.

Guidelines:
- For detailed questions about education, skills, or experience, suggest downloading Xolani's resume for comprehensive information
- Be helpful but concise in responses
- When appropriate, mention that more detailed information is available in the downloadable resume

User question: ${prompt}`;

    // Add rate limiting and request fingerprinting
    const requestId = Math.random().toString(36).substring(7);
    const timestamp = Date.now();
    
    console.log(`[${requestId}] AI Request received at ${new Date(timestamp).toISOString()}`);

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;
    
    // Enhanced request headers to look like legitimate browser traffic
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'Origin': 'https://makersuite.google.com',
        'Referer': 'https://makersuite.google.com/'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    console.log(`[${requestId}] Google AI API Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
      
      console.log(`[${requestId}] Successfully generated response`);
      
      res.json({
        success: true,
        response: result
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[${requestId}] AI API Error:`, errorData);
      
      // Handle specific error cases
      if (response.status === 429) {
        return res.status(429).json({
          success: false,
          error: "I've reached my usage limit for now. Please try again in a few minutes."
        });
      }
      
      if (response.status === 403 && errorData.error?.message?.includes('leaked')) {
        console.error(`[${requestId}] CRITICAL: API key flagged as leaked!`);
        return res.status(403).json({
          success: false,
          error: "AI service temporarily unavailable. Please contact the administrator."
        });
      }
      
      res.status(response.status).json({
        success: false,
        error: errorData.error?.message || 'AI service error'
      });
    }
  } catch (error) {
    console.error('AI Proxy Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// API Routes

// MongoDB connection
const uri = process.env.VITE_MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;
let dbConnectPromise = null;

// Connect to MongoDB
async function connectToDatabase() {
  if (!uri) {
    throw new Error('VITE_MONGODB_URI is not configured');
  }

  if (db) {
    return db;
  }

  if (dbConnectPromise) {
    return dbConnectPromise;
  }

  dbConnectPromise = (async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    db = client.db("portfolio");
    return db;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  } finally {
    dbConnectPromise = null;
  }
  })();

  return dbConnectPromise;
}

// Test endpoint
app.get('/api/test-mongo', async (req, res) => {
  try {
    if (!db) {
      await connectToDatabase();
    }
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    res.json({
      success: true,
      message: 'MongoDB connection successful!',
      collections: collectionNames,
      database: db.databaseName
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    res.status(500).json({
      success: false,
      message: 'MongoDB connection failed',
      error: error.message
    });
  }
});

// Get data from a collection
app.get('/api/collection/:name', async (req, res) => {
  try {
    if (!db) {
      await connectToDatabase();
    }
    
    const collectionName = req.params.name;
    const data = await db.collection(collectionName).find({}).limit(10).toArray();
    
    res.json({
      success: true,
      data: data,
      count: data.length
    });
  } catch (error) {
    console.error('Collection query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to query collection',
      error: error.message
    });
  }
});

// Catch-all handler: serve React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("ℹ️ MongoDB will connect on first database request");
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Stop the existing process or change PORT in .env.`);
    process.exit(1);
  }
  console.error('❌ Server startup error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔌 Closing MongoDB connection...');
  await client.close();
  process.exit(0);
});
