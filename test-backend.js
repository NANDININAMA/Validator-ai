// Simple test script to verify backend is working
const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5002/');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test signup endpoint
    console.log('\nTesting signup endpoint...');
    const signupResponse = await fetch('http://localhost:5002/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });
    
    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      console.log('✅ Signup test successful:', signupData.message);
    } else {
      const errorData = await signupResponse.text();
      console.log('❌ Signup test failed:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
  }
}

testBackend();
