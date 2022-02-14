const express = require('express');
const app = express();
const {getTopics} = require('./controllers/seed-controller')
const {serverError, invalidPath} = require('./controllers/error-controller')

app.get('/api/topics', getTopics);

app.use(invalidPath)
app.use(serverError)


module.exports = app