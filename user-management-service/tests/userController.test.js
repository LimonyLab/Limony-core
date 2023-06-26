const request = require('supertest');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/User');
const userController = require('../src/controllers/userController');

app.use(express.json()); 
app.post('/users/register', userController.register);

let mongoServer;

beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    await mongoServer.start();
    const mongoUri = await mongoServer.getUri();
    try {
      await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.error(err);
    }
  });

afterAll(async () => {
await mongoose.connection.close();
await mongoServer.stop();
});
  

test('POST /users/register - success', async () => {
  const res = await request(app)
    .post('/users/register')
    .send({
      email: 'test@gmail.com',
      password: 'testPassword',
      profile: {
        name: 'Test User',
        age: 25,
      },
      healthInfo: {
        bloodPressure: {
          systolic: 120,
          diastolic: 80,
        },
        overallHealthStatus: 'Good',
      }
    });

  expect(res.statusCode).toEqual(201);
  expect(res.body.email).toEqual('test@gmail.com');
});

test('POST /users/register - fail (duplicate email)', async () => {
  const res = await request(app)
    .post('/users/register')
    .send({
      email: 'test@gmail.com',
      password: 'testPassword',
      profile: {
        name: 'Test User',
        age: 25,
      },
      healthInfo: {
        bloodPressure: {
          systolic: 120,
          diastolic: 80,
        },
        overallHealthStatus: 'Good',
      }
    });

  expect(res.statusCode).toEqual(400);
  expect(res.body.message).toEqual('Email already exists');
});
