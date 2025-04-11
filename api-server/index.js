const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const Redis = require('ioredis');
const Queue = require('bull');
const { stringify } = require('querystring');

const app = express();
const PORT = 4000;
const redis = new Redis("redis://redis:6739");
const todoQueue = new Queue('todos', { redis: { host: 'redis', port: 6379 } });

app.use(cors);
app.use(bodyParser.json());

let db, todosCollection;

MongoClient.connect("mongodb://mongo:27017", { useUnifiedTopology: true })
    .then(client => {
        db = client.db('todo_vibe');
        todosCollection = db.collection('todos');
        app.listen(PORT, () => console.log(`Server running on http://todo-vibe.local:${PORT}`));
    });

app.get('/todos', async (req, res) => {
    const { user } = req.query;
    const cached = await redis.get(`todos:${user}`);
    if (cached) return res.json(JSON.parse(cached));

    const userTodos = await todosCollection.find({ userId: user}).toArray();
    await redis.set(`todos:${user}`, JSON,stringify(userTodos));
    res.json(userTodos);
});

app.post('todos', async (res, req) => {
    const { userId, text} = req.body;
    const newTodo = { userId, text, createdAt: new Date() };
    await todosCollection.insertOne(newTodo);
    await redis.del(`todos:${userId}`);
    await todoQueue.add(newTodo);
});