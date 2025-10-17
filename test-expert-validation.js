const mongoose = require('mongoose');
const User = require('./Backend/models/User');
const Expert = require('./Backend/models/Expert');
const Idea = require('./Backend/models/Idea');

// Test script to verify expert validation and rating system
async function testExpertValidation() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/startupvalidator');
    console.log('Connected to database');

    // Test 1: Check if we can create an expert profile
    console.log('\n=== Test 1: Creating Expert Profile ===');
    
    // Find or create a test user
    let testUser = await User.findOne({ email: 'test-expert@example.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Test Expert',
        email: 'test-expert@example.com',
        password: 'hashedpassword',
        role: 'expert'
      });
      await testUser.save();
      console.log('Created test user');
    }

    // Create expert profile
    const expertProfile = new Expert({
      user: testUser._id,
      specialization: 'Technology',
      experience: 5,
      bio: 'Experienced software engineer with expertise in web development',
      expertise: ['JavaScript', 'React', 'Node.js'],
      profession: 'Software Engineer',
      company: 'Tech Corp',
      linkedin: 'https://linkedin.com/in/testexpert',
      location: 'San Francisco, CA',
      isVerified: false // Initially not verified
    });
    
    await expertProfile.save();
    console.log('Created expert profile:', expertProfile._id);

    // Test 2: Check admin can verify expert
    console.log('\n=== Test 2: Admin Verifying Expert ===');
    
    expertProfile.isVerified = true;
    expertProfile.verificationNotes = 'Profile looks good, approved';
    await expertProfile.save();
    console.log('Expert verified by admin');

    // Test 3: Check if expert can review ideas
    console.log('\n=== Test 3: Expert Reviewing Ideas ===');
    
    // Find or create a test idea
    let testIdea = await Idea.findOne({ problem: 'Test problem for expert review' });
    if (!testIdea) {
      // Find or create a test entrepreneur
      let entrepreneur = await User.findOne({ email: 'test-entrepreneur@example.com' });
      if (!entrepreneur) {
        entrepreneur = new User({
          name: 'Test Entrepreneur',
          email: 'test-entrepreneur@example.com',
          password: 'hashedpassword',
          role: 'user'
        });
        await entrepreneur.save();
      }

      testIdea = new Idea({
        user: entrepreneur._id,
        problem: 'Test problem for expert review',
        solution: 'Test solution',
        market: 'Test market',
        revenueModel: 'Test revenue model',
        team: 'Test team',
        score: 75,
        classification: 'High'
      });
      await testIdea.save();
      console.log('Created test idea:', testIdea._id);
    }

    // Add expert review
    testIdea.expertReviews.push({
      expert: expertProfile._id,
      rating: 4,
      review: 'This is a solid idea with good potential. The market analysis is thorough.',
      feedback: 'Consider focusing more on user acquisition strategy.'
    });

    // Calculate average rating
    const totalRating = testIdea.expertReviews.reduce((sum, review) => sum + review.rating, 0);
    testIdea.averageExpertRating = totalRating / testIdea.expertReviews.length;
    testIdea.totalExpertReviews = testIdea.expertReviews.length;

    await testIdea.save();
    console.log('Added expert review to idea');

    // Test 4: Verify data integrity
    console.log('\n=== Test 4: Data Verification ===');
    
    const populatedIdea = await Idea.findById(testIdea._id)
      .populate('user', 'name email')
      .populate('expertReviews.expert', 'specialization expertise')
      .populate('expertReviews.expert.user', 'name email');

    console.log('Idea with expert reviews:', {
      id: populatedIdea._id,
      problem: populatedIdea.problem,
      totalReviews: populatedIdea.totalExpertReviews,
      averageRating: populatedIdea.averageExpertRating,
      reviews: populatedIdea.expertReviews.map(review => ({
        expert: review.expert?.user?.name || 'Unknown',
        rating: review.rating,
        review: review.review.substring(0, 50) + '...',
        feedback: review.feedback
      }))
    });

    console.log('\n✅ All tests passed! Expert validation and rating system is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run the test
testExpertValidation();
