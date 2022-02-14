const db = require('../db/connection')

exports.fetchTopics = () => {
    return db
    .query("SELECT * FROM topics;")
    .then(({rows: topics}) => {
        console.log(topics, 'inside model')
        return topics
    })
}