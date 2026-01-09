import { connectToDatabase, closeConnection } from './mongoService.js';

async function testMongoConnection() {
  console.log('Testing MongoDB connection...');
  
  try {
    // Connect to database
    const db = await connectToDatabase();
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test basic operations
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test a simple operation
    const testCollection = db.collection('test');
    const count = await testCollection.countDocuments();
    console.log(`📊 Test collection has ${count} documents`);
    
    console.log('✅ All tests passed! MongoDB is working correctly.');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    // Always close the connection
    await closeConnection();
    console.log('🔌 Connection closed');
  }
}

// Export for use in components or console
export { testMongoConnection };

// Auto-run if this file is executed directly
if (typeof window === 'undefined') {
  testMongoConnection();
}
