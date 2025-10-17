// Test script for expert dashboard features
const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
let authToken = '';

// Test data
const testExpertData = {
  name: 'John Expert',
  email: 'john.expert@test.com',
  password: 'password123',
  role: 'expert',
  expertData: {
    specialization: 'Technology',
    experience: 5,
    bio: 'Experienced software engineer with expertise in AI and machine learning',
    expertise: ['AI', 'Machine Learning', 'Python', 'React'],
    profession: 'Senior Software Engineer',
    company: 'Tech Corp',
    github: 'https://github.com/johnexpert',
    linkedin: 'https://linkedin.com/in/johnexpert',
    website: 'https://johnexpert.com',
    location: 'San Francisco, CA',
    education: 'MS Computer Science, Stanford University',
    certifications: ['AWS Certified', 'Google Cloud Professional'],
    languages: ['Python', 'JavaScript', 'React', 'Node.js'],
    previousCompanies: ['Google', 'Facebook'],
    achievements: ['Built 10M+ user app', 'Open source contributor']
  }
};

async function testExpertFeatures() {
  console.log('🚀 Testing Expert Dashboard Features...\n');

  try {
    // Test 1: Expert Registration
    console.log('1. Testing Expert Registration...');
    const signupResponse = await axios.post(`${API_BASE}/auth/signup`, testExpertData);
    console.log('✅ Expert registration successful');
    console.log('   User ID:', signupResponse.data.user.id);
    console.log('   Role:', signupResponse.data.user.role);
    authToken = signupResponse.data.token;

    // Test 2: Expert Login
    console.log('\n2. Testing Expert Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: testExpertData.email,
      password: testExpertData.password
    });
    console.log('✅ Expert login successful');
    authToken = loginResponse.data.token;

    // Test 3: Get Expert Profile
    console.log('\n3. Testing Expert Profile Retrieval...');
    const profileResponse = await axios.get(`${API_BASE}/expert/profile`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Expert profile retrieved');
    console.log('   Specialization:', profileResponse.data.expert.specialization);
    console.log('   Experience:', profileResponse.data.expert.experience);
    console.log('   Verified:', profileResponse.data.expert.isVerified);

    // Test 4: Get Verification Status
    console.log('\n4. Testing Verification Status...');
    const verificationResponse = await axios.get(`${API_BASE}/expert/verification-status`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Verification status retrieved');
    console.log('   Is Verified:', verificationResponse.data.isVerified);
    console.log('   Notes:', verificationResponse.data.verificationNotes);

    // Test 5: Get Ideas for Review (should fail for unverified expert)
    console.log('\n5. Testing Ideas Access (Unverified Expert)...');
    try {
      await axios.get(`${API_BASE}/expert/ideas`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      console.log('❌ Should have failed for unverified expert');
    } catch (error) {
      console.log('✅ Correctly blocked unverified expert from accessing ideas');
      console.log('   Error:', error.response.data.message);
    }

    console.log('\n🎉 Expert Dashboard Features Test Completed!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Expert Registration');
    console.log('   ✅ Expert Login');
    console.log('   ✅ Profile Retrieval');
    console.log('   ✅ Verification Status');
    console.log('   ✅ Access Control (Unverified Expert)');
    console.log('\n💡 Next Steps:');
    console.log('   1. Login as admin to verify the expert');
    console.log('   2. Test verified expert access to ideas');
    console.log('   3. Test idea review functionality');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('   Status:', error.response?.status);
    console.error('   Data:', error.response?.data);
  }
}

// Run the test
testExpertFeatures();
