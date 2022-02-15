const {fetchTopics, fetchArticleById, updateArticle} = require('../models/seed-models')

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
    console.log(typeof req.body.votes)
    if (typeof req.body.votes === 'undefined'){
        res.status(400).send();
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