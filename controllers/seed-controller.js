const {fetchTopics} = require('../models/seed-models')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        console.log('inside controller')
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}