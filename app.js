const express = require('express');
const app = express();
const {getTopics, getArticleById} = require('./controllers/seed-controller')
const {serverError, invalidPath, badRequest, notFound} = require('./controllers/error-controller')

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

app.all('/*', invalidPath);
app.use(notFound)
app.use(badRequest);
app.use(serverError);


module.exports = app