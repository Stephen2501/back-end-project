const express = require('express');
const app = express();
const {getTopics, getArticleById, patchArticle} = require('./controllers/seed-controller')
const {serverError, invalidPath, badRequest, notFound} = require('./controllers/error-controller')
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', patchArticle);

app.all('/*', invalidPath);
app.use(notFound)
app.use(badRequest);
app.use(serverError);


module.exports = app