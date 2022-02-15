const express = require('express');
const app = express();
const {getTopics, getArticleById, getUsers} = require('./controllers/seed-controller')
const {serverError, invalidPath, badRequest, notFound} = require('./controllers/error-controller')

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/users', getUsers)

app.all('/*', invalidPath);
app.use(notFound)
app.use(badRequest);
app.use(serverError);


module.exports = app