const req = require("express/lib/request");
const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT articles.*, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `Unable to find resource`,
        });
      }
      return article;
    });
};

exports.updateArticle = (articleId, votes) => {
    
    if (typeof votes === "undefined") {
        return Promise.reject({status: 400, msg: "Missing required field"})
    }
    if (typeof votes !== 'number'){
        return Promise.reject({status: 400, msg: "Bad request" });
    }
   
    return db
    .query(
      `UPDATE articles
        SET votes = votes + $2
        WHERE article_id = $1
        RETURNING *;`,
      [articleId, votes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
   }


exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows: users }) => {
    return users;
  });
};

exports.fetchArticles = (sort_by = 'created_at', order_by = 'DESC', topic) => {
   
    const validSortBys = ['article_id', 'title', 'body', 'author', 'topic', 'created_at', 'votes', 'comment_count']
    const validOrderBys = ['ASC', 'DESC']
    
    
    if(!validSortBys.includes(sort_by) || !validOrderBys.includes(order_by)) {
        return Promise.reject({status: 400, msg: "Bad request"});
    }
    
    let queryStr = `
    SELECT articles.*, COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id `

    const queryValues = []
    if(topic) {
        queryStr += `WHERE topic = $1 `;
        queryValues.push(topic)
    }
        
    queryStr += `GROUP BY articles.article_id `
    queryStr += `ORDER BY ${sort_by} `
    queryStr += `${order_by}`

  return db
    .query(queryStr, queryValues)
    .then(({ rows: articles }) => {
      return articles;
    });
}

exports.fetchArticleComments = (articleId) => {
  return db
    .query(
      `
    SELECT * 
    FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC;`,
      [articleId]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.checkArticleExists = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Unable to find resource`,
        });
      }
    });
};

exports.insertComment = (articleId, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      `
    INSERT INTO comments 
    (article_id, author, body) 
    VALUES ($1, $2, $3) 
    RETURNING *;`,
      [articleId, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.checkTopicExists = (topic) => {
    if (topic !== undefined) {
    return db 
    .query("SELECT * FROM topics WHERE slug = $1;", [topic])
    .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 400,
            msg: `Bad request`,
          });
        }
      });
    }
  };


  exports.removeComment = (comment_id) => {
    return db
    .query(
        `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
    `, [comment_id])
    .then((result) => {
      if(result.rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: "Unable to find resource"
          })
        }
      }
    )}

