const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const Redis = require('ioredis');
const Queue = require('bull');

const app = express();
const PORT = 4000;
const redis = new Redis("redis://redis:6739");
const todoQueue = new Queue('todos', { redis: { host: 'redis', port: 6379 } });
