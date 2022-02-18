const express = require('express');
const app = express();
const {getTopics, getArticleById, patchArticle, getUsers, getArticles, getArticleComments, postComment, deleteComment} = require('./controllers/seed-controller')
const {serverError, invalidPath, badRequest, notFound} = require('./controllers/error-controller')
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/users', getUsers)
app.get('/api/articles/:article_id/comments', getArticleComments)

app.patch('/api/articles/:article_id', patchArticle);

app.post('/api/articles/:article_id/comments', postComment);

app.delete('/api/comments/:comment_id', deleteComment);

app.all('/*', invalidPath);

app.use(notFound);

app.use(badRequest);

app.use(serverError);


module.exports = app