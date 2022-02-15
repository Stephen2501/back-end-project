const db = require('../db/connection')

exports.fetchTopics = () => {
    return db
    .query("SELECT * FROM topics;")
    .then(({rows: topics}) => {
        return topics
    })
}

exports.fetchArticleById = (article_id) => {
    return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({rows}) => {
        const article = rows[0]
        if (!article){
            return Promise.reject({
                status: 404,
                msg: `No article found for article_id: ${article_id}`,
            })
        }
        return article
    })
};

exports.updateArticle = (articleId, votes) => {
    return db.query(
        `UPDATE articles
        SET votes = votes + $2
        WHERE article_id = $1
        RETURNING *;`,
        [articleId, votes]
    )
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.fetchUsers = () => {
    return db
    .query("SELECT * FROM users;")
    .then(({rows: users}) => {
        return users
    })
}

exports.fetchArticles = () => {
    return db
    .query("SELECT * FROM articles ORDER BY created_at DESC")
    .then(({rows: articles}) => {
        console.log(articles)
        return articles
    })
}
