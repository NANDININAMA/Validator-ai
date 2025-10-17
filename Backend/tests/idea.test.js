const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const { disconnectDB } = require('../config/db');

const testEmail = 'ideauser@example.com';
const testPass = 'Password123!';
const isMongoAvailable = process.arch !== 'ia32';

let token;

const maybe = isMongoAvailable ? describe : describe.skip;

maybe('idea API', () => {
beforeAll(async () => {
  // create user
  await request(app).post('/api/auth/register').send({ email: testEmail, password: testPass, name: 'IdeaUser' });
  const res = await request(app).post('/api/auth/login').send({ email: testEmail, password: testPass });
  token = res.body.token;
});

afterAll(async () => {
  await User.deleteOne({ email: testEmail });
  await disconnectDB();
});

test('create idea', async () => {
  const payload = {
    title: 'Sample Idea',
    problem: 'Short problem text with enough details.',
    solution: 'Solution text.',
    market: 'Market description.',
    revenueModel: 'Subscription',
    team: 'Founder team'
  };

  const res = await request(app)
    .post('/api/ideas')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

  expect([201, 400]).toContain(res.statusCode);
});
});
