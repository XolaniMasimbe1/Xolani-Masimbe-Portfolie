import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes

// MongoDB connection
const uri = process.env.VITE_MONGODB_URI || "mongodb+srv://xmasimbe965_db_user:JKKjEOtxV17y4jcp@xolanidb.kf5qxbp.mongodb.net/?appName=XolaniDb";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    db = client.db("portfolio");
    return db;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
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
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await connectToDatabase();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔌 Closing MongoDB connection...');
  await client.close();
  process.exit(0);
});
