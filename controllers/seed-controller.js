const {
  fetchTopics,
  fetchArticleById,
  updateArticle,
  fetchUsers,
  fetchArticles,
  fetchArticleComments,
  checkArticleExists,
  insertComment,
  checkTopicExists,
} = require("../models/seed-models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const articleId = req.params.article_id;

    updateArticle(articleId, req.body.votes).then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
        next(err)
    })
  } 

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order_by, topic } = req.query;
  Promise.all([
    fetchArticles(sort_by, order_by, topic),
    checkTopicExists(topic),
  ])
    .then(([articles]) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    fetchArticleComments(article_id),
    checkArticleExists(article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    insertComment(article_id, req.body),
    checkArticleExists(article_id),
  ])
    .then(([comment]) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};
