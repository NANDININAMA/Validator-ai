const mongoose = require('mongoose');
const Idea = require('./models/Idea');
const Expert = require('./models/Expert');
const User = require('./models/User');

async function testFix() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/startup_validator', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Test the fixed population syntax
    const idea = await Idea.findOne({ 'expertReviews.0': { $exists: true } })
      .populate({
        path: 'expertReviews.expert',
        select: 'specialization expertise profession isVerified',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    if (idea && idea.expertReviews.length > 0) {
      const review = idea.expertReviews[0];
      console.log('\n--- Expert Review Data ---');
      console.log('Expert name:', review.expert?.user?.name);
      console.log('Expert specialization:', review.expert?.specialization);
      console.log('Expert isVerified:', review.expert?.isVerified);
      console.log('Expert expertise:', review.expert?.expertise);
      
      if (review.expert?.user?.name) {
        console.log('\n✅ SUCCESS: Expert name is properly populated!');
        console.log('The frontend should now show:', review.expert.user.name);
      } else {
        console.log('\n❌ FAILED: Expert user name is still not populated');
      }
    } else {
      console.log('No ideas with expert reviews found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testFix();
