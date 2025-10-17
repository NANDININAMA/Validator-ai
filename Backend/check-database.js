const mongoose = require('mongoose');
const Idea = require('./models/Idea');
const Expert = require('./models/Expert');
const User = require('./models/User');

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/startup_validator', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Check what's in the database
    const userCount = await User.countDocuments();
    const expertCount = await Expert.countDocuments();
    const ideaCount = await Idea.countDocuments();

    console.log(`Users: ${userCount}`);
    console.log(`Experts: ${expertCount}`);
    console.log(`Ideas: ${ideaCount}`);

    if (userCount > 0) {
      const users = await User.find();
      console.log('\nUsers:');
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }

    if (expertCount > 0) {
      const experts = await Expert.find().populate('user', 'name email');
      console.log('\nExperts:');
      experts.forEach(expert => {
        console.log(`- ${expert.user?.name} (${expert.user?.email}) - Specialization: ${expert.specialization}`);
      });
    }

    if (ideaCount > 0) {
      const ideas = await Idea.find();
      console.log('\nIdeas:');
      ideas.forEach(idea => {
        console.log(`- ${idea.problem?.substring(0, 50)}... - Reviews: ${idea.expertReviews?.length || 0}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkDatabase();
