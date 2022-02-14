exports.invalidPath = (req, res, next) => {
    res.status(404).send({msg: "Path not found"});
};

exports.notFound = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status).send({ msg: err.msg })
    }
    else next(err)
}

exports.badRequest = (err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg: "Bad request"})
    }
}

exports.serverError = (err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"});
};