const mongoose = require('mongoose');
const Idea = require('./models/Idea');
const Expert = require('./models/Expert');
const User = require('./models/User');

async function debugExpertData() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/startup_validator', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Find an idea with expert reviews
    const idea = await Idea.findOne({ 'expertReviews.0': { $exists: true } })
      .populate('expertReviews.expert', 'specialization expertise profession isVerified')
      .populate('expertReviews.expert.user', 'name email');

    if (!idea) {
      console.log('No ideas with expert reviews found');
      return;
    }

    console.log('Found idea with expert reviews:');
    console.log('Idea ID:', idea._id);
    console.log('Number of expert reviews:', idea.expertReviews.length);

    idea.expertReviews.forEach((review, index) => {
      console.log(`\n--- Expert Review ${index + 1} ---`);
      console.log('Review rating:', review.rating);
      console.log('Review text:', review.review);
      console.log('Expert data:', review.expert);
      
      if (review.expert) {
        console.log('Expert specialization:', review.expert.specialization);
        console.log('Expert expertise:', review.expert.expertise);
        console.log('Expert isVerified:', review.expert.isVerified);
        
        if (review.expert.user) {
          console.log('Expert user name:', review.expert.user.name);
          console.log('Expert user email:', review.expert.user.email);
        } else {
          console.log('Expert user data not populated');
        }
      } else {
        console.log('Expert data not populated');
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

debugExpertData();
