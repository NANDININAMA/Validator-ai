#!/usr/bin/env node

/**
 * Test Setup Script for Startup Validator
 * This script helps test the application with sample data
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Expert = require('./models/Expert');
const Idea = require('./models/Idea');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/startup-validator';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function createTestData() {
  try {
    console.log('🔄 Creating test data...');

    // Clear existing data
    await User.deleteMany({});
    await Expert.deleteMany({});
    await Idea.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create test users
    const users = await User.create([
      {
        name: 'John Entrepreneur',
        email: 'john@example.com',
        password: '$2b$10$example', // This would be hashed in real app
        role: 'user'
      },
      {
        name: 'Jane Expert',
        email: 'jane@example.com',
        password: '$2b$10$example',
        role: 'expert'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2b$10$example',
        role: 'admin'
      }
    ]);

    console.log('✅ Created test users');

    // Create expert profile
    const expert = await Expert.create({
      user: users[1]._id,
      specialization: 'Technology & Innovation',
      experience: 8,
      bio: 'Experienced technology consultant with 8 years in startup ecosystem. Specialized in AI, blockchain, and fintech.',
      expertise: ['Artificial Intelligence', 'Blockchain', 'Fintech', 'SaaS'],
      profession: 'Senior Technology Consultant',
      linkedin: 'https://linkedin.com/in/janeexpert',
      rating: 4.8,
      totalReviews: 0,
      isActive: true,
      isVerified: true
    });

    console.log('✅ Created expert profile');

    // Create sample ideas
    const ideas = await Idea.create([
      {
        user: users[0]._id,
        title: 'AI-Powered Personal Finance App',
        problem: 'People struggle to manage their finances effectively and make informed investment decisions.',
        solution: 'An AI-powered mobile app that analyzes spending patterns, provides personalized financial advice, and suggests investment opportunities.',
        market: 'Personal finance market is worth $1.5B globally, targeting millennials and Gen Z who are tech-savvy but lack financial literacy.',
        revenueModel: 'Freemium model with premium features, affiliate commissions from financial products, and subscription tiers.',
        team: 'Founder with finance background, 2 developers, 1 designer, and 1 marketing specialist.',
        score: 78,
        classification: 'High',
        feedback: 'Great potential in the growing fintech market.',
        suggestions: ['Focus on user privacy and security', 'Consider regulatory compliance early'],
        expertReviews: [{
          expert: expert._id,
          rating: 4,
          review: 'Solid concept with clear market need. The AI approach is innovative and the target market is well-defined.',
          feedback: 'Consider partnering with established financial institutions for credibility and regulatory compliance.',
          createdAt: new Date()
        }],
        averageExpertRating: 4,
        totalExpertReviews: 1
      },
      {
        user: users[0]._id,
        title: 'Sustainable Packaging Solution',
        problem: 'E-commerce companies generate massive amounts of non-recyclable packaging waste.',
        solution: 'Biodegradable packaging materials made from agricultural waste that decompose within 90 days.',
        market: 'Global packaging market is $900B, with increasing demand for sustainable alternatives.',
        revenueModel: 'B2B sales to e-commerce companies, licensing deals with manufacturers, and government incentives.',
        team: 'Founder with materials science background, 3 engineers, 1 business development lead.',
        score: 65,
        classification: 'Moderate',
        feedback: 'Addresses important environmental concerns.',
        suggestions: ['Research cost competitiveness', 'Validate scalability of production'],
        expertReviews: [],
        averageExpertRating: 0,
        totalExpertReviews: 0
      }
    ]);

    console.log('✅ Created sample ideas');

    console.log('\n🎉 Test data created successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('👤 Entrepreneur: john@example.com');
    console.log('🎯 Expert: jane@example.com');
    console.log('👑 Admin: admin@example.com');
    console.log('\n💡 Sample ideas created with expert reviews');
    console.log('\n🚀 You can now test the application with these accounts!');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  }
}

async function main() {
  await connectDB();
  await createTestData();
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createTestData, connectDB };
