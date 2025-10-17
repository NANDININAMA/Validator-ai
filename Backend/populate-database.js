const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Expert = require('./models/Expert');
const Idea = require('./models/Idea');

async function populateDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/startupvalidator');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Expert.deleteMany({});
    await Idea.deleteMany({});

    // Create Admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@startup.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    });

    // Create Entrepreneurs
    const entrepreneurs = await User.create([
      {
        name: 'John Doe',
        email: 'john@startup.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@startup.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user'
      }
    ]);

    // Create Expert Users
    const expertUsers = await User.create([
      {
        name: 'Dr. Alex Smith',
        email: 'alex@expert.com',
        password: await bcrypt.hash('password123', 10),
        role: 'expert'
      },
      {
        name: 'Maria Garcia',
        email: 'maria@expert.com',
        password: await bcrypt.hash('password123', 10),
        role: 'expert'
      }
    ]);

    // Create Expert Profiles
    const experts = await Expert.create([
      {
        user: expertUsers[0]._id,
        specialization: 'Technology',
        experience: 10,
        bio: 'Senior software engineer with 10+ years in AI and machine learning',
        expertise: ['AI', 'Machine Learning', 'Software Development'],
        profession: 'Senior Software Engineer',
        company: 'Tech Corp',
        linkedin: 'https://linkedin.com/in/alexsmith',
        location: 'San Francisco, CA',
        isVerified: true
      },
      {
        user: expertUsers[1]._id,
        specialization: 'Business',
        experience: 8,
        bio: 'Business strategist with expertise in fintech and startups',
        expertise: ['Business Strategy', 'Fintech', 'Marketing'],
        profession: 'Business Consultant',
        company: 'Strategy Plus',
        linkedin: 'https://linkedin.com/in/mariagarcia',
        location: 'New York, NY',
        isVerified: true
      }
    ]);

    // Create Ideas
    const ideas = await Idea.create([
      {
        user: entrepreneurs[0]._id,
        title: 'AI-Powered Pet Care App',
        problem: 'Pet owners struggle to track vaccination schedules, diet plans, and health records',
        solution: 'Mobile app with AI recommendations for pet care, automated reminders, and vet integration',
        market: 'Pet care market worth $261 billion globally, targeting tech-savvy pet owners',
        revenueModel: 'Freemium model with premium features, vet partnerships, and pet product recommendations',
        team: 'Solo founder with mobile development background, seeking co-founder',
        score: 75,
        classification: 'High'
      },
      {
        user: entrepreneurs[1]._id,
        title: 'Sustainable Food Delivery',
        problem: 'Food delivery creates excessive packaging waste and carbon emissions',
        solution: 'Eco-friendly delivery service using reusable containers and electric vehicles',
        market: 'Food delivery market growing 20% annually, increasing environmental awareness',
        revenueModel: 'Commission from restaurants, container deposit system, premium eco-delivery fees',
        team: 'Two co-founders: operations expert and environmental scientist',
        score: 68,
        classification: 'Moderate'
      }
    ]);

    // Add expert reviews to ideas
    ideas[0].expertReviews.push({
      expert: experts[0]._id,
      rating: 4,
      review: 'Strong technical concept with good market potential. AI integration is well thought out.',
      feedback: 'Focus on user acquisition and vet partnerships for growth.',
      createdAt: new Date()
    });

    ideas[1].expertReviews.push({
      expert: experts[1]._id,
      rating: 3,
      review: 'Good environmental focus but challenging unit economics. Need stronger business model.',
      feedback: 'Consider B2B partnerships with restaurants to reduce costs.',
      createdAt: new Date()
    });

    // Update averages
    ideas[0].averageExpertRating = 4;
    ideas[0].totalExpertReviews = 1;
    ideas[1].averageExpertRating = 3;
    ideas[1].totalExpertReviews = 1;

    await ideas[0].save();
    await ideas[1].save();

    console.log('Database populated successfully!');
    console.log(`Created: ${entrepreneurs.length} entrepreneurs, ${experts.length} experts, 1 admin, ${ideas.length} ideas`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

populateDatabase();