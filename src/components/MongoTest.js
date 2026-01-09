import { useState } from 'react';

export default function MongoTest() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState('');

  const handleTest = async () => {
    setStatus('testing');
    setResult('');
    
    try {
      const response = await fetch('http://localhost:3001/api/test-mongo');
      const data = await response.json();
      
      if (data.success) {
        setResult(`✅ ${data.message}\n📁 Collections: ${data.collections.join(', ')}\n🗄️ Database: ${data.database}`);
        setStatus('success');
      } else {
        setResult(`❌ ${data.message}\nError: ${data.error}`);
        setStatus('error');
      }
    } catch (error) {
      setResult(`❌ Connection failed: ${error.message}\nMake sure the backend server is running on port 3001`);
      setStatus('error');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
      <h3>MongoDB Connection Test</h3>
      <button 
        onClick={handleTest}
        disabled={status === 'testing'}
        style={{
          padding: '10px 20px',
          backgroundColor: status === 'testing' ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: status === 'testing' ? 'not-allowed' : 'pointer'
        }}
      >
        {status === 'testing' ? 'Testing...' : 'Test MongoDB Connection'}
      </button>
      
      {result && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: status === 'success' ? '#d4edda' : '#f8d7da',
          border: `1px solid ${status === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-line'
        }}>
          {result}
        </div>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <p>📋 <strong>To test MongoDB:</strong></p>
        <ol style={{ paddingLeft: '20px', margin: '5px 0' }}>
          <li>Install backend dependencies: <code>npm install express cors</code></li>
          <li>Start backend server: <code>npm run server</code></li>
          <li>Then click "Test MongoDB Connection"</li>
        </ol>
      </div>
    </div>
  );
}
