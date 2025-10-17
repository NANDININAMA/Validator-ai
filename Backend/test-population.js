const mongoose = require('mongoose');
const Idea = require('./models/Idea');
const Expert = require('./models/Expert');
const User = require('./models/User');

async function testPopulation() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/startup_validator', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Test different population approaches
    const idea = await Idea.findOne({ 'expertReviews.0': { $exists: true } });
    console.log('Found idea:', idea._id);

    // Test 1: Basic population
    console.log('\n--- Test 1: Basic population ---');
    const idea1 = await Idea.findById(idea._id)
      .populate('expertReviews.expert', 'specialization expertise profession isVerified')
      .populate('expertReviews.expert.user', 'name email');
    
    console.log('Expert data:', idea1.expertReviews[0].expert);
    console.log('Expert user:', idea1.expertReviews[0].expert?.user);

    // Test 2: Check if expert has user reference
    console.log('\n--- Test 2: Check expert user reference ---');
    const expert = await Expert.findById(idea1.expertReviews[0].expert._id);
    console.log('Expert user reference:', expert.user);
    
    // Test 3: Try to populate expert user directly
    console.log('\n--- Test 3: Populate expert user directly ---');
    const expertWithUser = await Expert.findById(idea1.expertReviews[0].expert._id)
      .populate('user', 'name email');
    console.log('Expert with user:', expertWithUser.user);

    // Test 4: Try different population syntax
    console.log('\n--- Test 4: Different population syntax ---');
    const idea2 = await Idea.findById(idea._id)
      .populate({
        path: 'expertReviews.expert',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });
    
    console.log('Expert data:', idea2.expertReviews[0].expert);
    console.log('Expert user:', idea2.expertReviews[0].expert?.user);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testPopulation();
