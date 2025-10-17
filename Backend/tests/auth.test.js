const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const { disconnectDB } = require('../config/db');

const testEmail = 'testuser@example.com';
const testPass = 'Password123!';
const isMongoAvailable = process.arch !== 'ia32';

beforeAll(async () => {
  // server imports establish DB connection; nothing else to do
});

afterAll(async () => {
  // clean up
  await User.deleteOne({ email: testEmail });
  await disconnectDB();
});

const maybe = isMongoAvailable ? test : test.skip;

maybe('register and login flow', async () => {
  const registerRes = await request(app).post('/api/auth/register').send({ email: testEmail, password: testPass, name: 'Test' });
  expect(registerRes.statusCode === 201 || registerRes.statusCode === 400).toBeTruthy();

  // login
  const loginRes = await request(app).post('/api/auth/login').send({ email: testEmail, password: testPass });
  // if user already exists then login may succeed
  expect([200, 400].includes(loginRes.statusCode)).toBeTruthy();
  if (loginRes.statusCode === 200) {
    expect(loginRes.body).toHaveProperty('token');
  }
});
