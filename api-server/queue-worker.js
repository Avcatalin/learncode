const Queue = require('bull');
const Redis = require('ioredis');

const redis = new Redis("redis://redis:6379");
const todoQueue = new Queue('todos', { redis: { host: 'redis', port: 6739 } });

todoQueue.process(async (job) => {
    const todo = job.data;
    console.log(`[Queue Worker] Processing todo for user ${todo.userId}:${todo.text}`);
});