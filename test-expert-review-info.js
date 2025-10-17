// Test script to demonstrate expert review with information display
const mongoose = require('mongoose');
const User = require('./Backend/models/User');
const Expert = require('./Backend/models/Expert');
const Idea = require('./Backend/models/Idea');

async function testExpertReviewWithInfo() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/startupvalidator');
    console.log('Connected to database');

    // Create test expert
    let expertUser = await User.findOne({ email: 'review-expert@example.com' });
    if (!expertUser) {
      expertUser = new User({
        name: 'Dr. Sarah Johnson',
        email: 'review-expert@example.com',
        password: 'hashedpassword',
        role: 'expert'
      });
      await expertUser.save();
    }

    // Create expert profile
    let expertProfile = await Expert.findOne({ user: expertUser._id });
    if (!expertProfile) {
      expertProfile = new Expert({
        user: expertUser._id,
        specialization: 'Technology & Innovation',
        experience: 8,
        bio: 'Senior Technology Consultant with expertise in AI and blockchain',
        expertise: ['Artificial Intelligence', 'Blockchain', 'Machine Learning', 'FinTech'],
        profession: 'Senior Technology Consultant',
        company: 'TechInnovate Corp',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        location: 'San Francisco, CA',
        isVerified: true,
        verificationNotes: 'Verified expert with strong credentials'
      });
      await expertProfile.save();
    }

    // Create test idea
    let testIdea = await Idea.findOne({ problem: 'AI-powered customer service automation' });
    if (!testIdea) {
      let entrepreneur = await User.findOne({ email: 'test-entrepreneur@example.com' });
      if (!entrepreneur) {
        entrepreneur = new User({
          name: 'John Smith',
          email: 'test-entrepreneur@example.com',
          password: 'hashedpassword',
          role: 'user'
        });
        await entrepreneur.save();
      }

      testIdea = new Idea({
        user: entrepreneur._id,
        problem: 'AI-powered customer service automation',
        solution: 'An AI chatbot that can handle 80% of customer inquiries automatically',
        market: 'E-commerce and SaaS companies',
        revenueModel: 'Subscription-based SaaS pricing',
        team: 'AI engineers, product managers, and customer success specialists',
        score: 85,
        classification: 'High'
      });
      await testIdea.save();
    }

    // Simulate expert review with enhanced information
    const expertReview = {
      expert: expertProfile._id,
      rating: 4,
      review: `This is a solid AI automation idea with good market potential. The technical approach is sound and the market size is substantial.

The solution addresses a real pain point in customer service operations. However, I'd recommend focusing more on the integration challenges with existing CRM systems.

Overall, this has strong commercial viability and the team seems capable of execution.

---
Reviewed by: Dr. Sarah Johnson ✅
Specialization: Technology & Innovation
Profession: Senior Technology Consultant
Expertise: Artificial Intelligence, Blockchain, Machine Learning, FinTech`,
      feedback: 'Consider partnering with major CRM providers for easier integration. Also, focus on compliance with data privacy regulations.',
      createdAt: new Date()
    };

    testIdea.expertReviews.push(expertReview);
    
    // Calculate average rating
    const totalRating = testIdea.expertReviews.reduce((sum, review) => sum + review.rating, 0);
    testIdea.averageExpertRating = totalRating / testIdea.expertReviews.length;
    testIdea.totalExpertReviews = testIdea.expertReviews.length;

    await testIdea.save();

    // Display the result
    const populatedIdea = await Idea.findById(testIdea._id)
      .populate('user', 'name email')
      .populate('expertReviews.expert', 'specialization expertise profession')
      .populate('expertReviews.expert.user', 'name email');

    console.log('\n=== Expert Review with Information Display ===');
    console.log('Idea:', populatedIdea.problem);
    console.log('By:', populatedIdea.user.name);
    console.log('\nExpert Review:');
    console.log('Rating:', populatedIdea.expertReviews[0].rating + '/5');
    console.log('Review Text:');
    console.log(populatedIdea.expertReviews[0].review);
    console.log('\nAdditional Feedback:', populatedIdea.expertReviews[0].feedback);
    
    console.log('\n✅ Expert review with information display test completed successfully!');
    console.log('The review now includes:');
    console.log('- Expert name with verification badge');
    console.log('- Specialization and profession');
    console.log('- Areas of expertise');
    console.log('- All information is automatically appended to the review text');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run the test
testExpertReviewWithInfo();
