const {fetchTopics, fetchArticleById, updateArticle, fetchUsers, fetchArticles, fetchArticleComments} = require('../models/seed-models')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticle = (req, res) => {
    const articleId = (req.params.article_id);
    if (typeof req.body.votes === 'undefined'){
        res.status(400).send({msg: "Missing required fields"});
    } 
    else if (typeof req.body.votes === 'number') {
        updateArticle(articleId, req.body.votes).then((article) => {
            res.status(200).send({article})
        })
    }
    else {
        res.status(400).send({msg: 'Bad request'})
    }
}

exports.getUsers = (req, res) => {
    fetchUsers().then((users) => {
        res.status(200).send({users})
    })
}

exports.getArticles = (req, res) => {
    fetchArticles().then((articles) => {
        res.status(200).send({articles})
    })
}

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleComments(article_id).then((comments) => {
        res.status(200).send({comments})
    })
}