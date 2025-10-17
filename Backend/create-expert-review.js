const mongoose = require('mongoose');
const Idea = require('./models/Idea');
const Expert = require('./models/Expert');
const User = require('./models/User');

async function createExpertReview() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/startupvalidator', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Find an expert
    const expert = await Expert.findOne().populate('user', 'name email');
    if (!expert) {
      console.log('No expert found');
      return;
    }
    console.log('Found expert:', expert.user.name, expert.specialization);

    // Find an idea
    const idea = await Idea.findOne();
    if (!idea) {
      console.log('No idea found');
      return;
    }
    console.log('Found idea:', idea.problem);

    // Add expert review
    idea.expertReviews.push({
      expert: expert._id,
      rating: 4,
      review: 'This is a solid idea with good market potential. The technical approach is sound.',
      feedback: 'Consider focusing on user acquisition strategy.',
      createdAt: new Date()
    });

    // Calculate average rating
    const totalRating = idea.expertReviews.reduce((sum, review) => sum + review.rating, 0);
    idea.averageExpertRating = totalRating / idea.expertReviews.length;
    idea.totalExpertReviews = idea.expertReviews.length;

    await idea.save();
    console.log('Added expert review to idea');

    // Now test the population
    const populatedIdea = await Idea.findById(idea._id)
      .populate('expertReviews.expert', 'specialization expertise profession isVerified')
      .populate('expertReviews.expert.user', 'name email');

    console.log('\n--- Populated Expert Data ---');
    populatedIdea.expertReviews.forEach((review, index) => {
      console.log(`Review ${index + 1}:`);
      console.log('Rating:', review.rating);
      console.log('Review:', review.review);
      console.log('Expert specialization:', review.expert?.specialization);
      console.log('Expert name:', review.expert?.user?.name);
      console.log('Expert email:', review.expert?.user?.email);
      console.log('Expert isVerified:', review.expert?.isVerified);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createExpertReview();
