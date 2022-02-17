exports.invalidPath = (req, res) => {
    res.status(404).send({msg: "Path not found"});
};

exports.notFound = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status).send({ msg: err.msg })
    }
    else next(err)
}

exports.badRequest = (err, req, res, next) => {
    console.log(err.code)
    if(err.code === '22P02' || err.code === '23502') {
        res.status(400).send({msg: "Bad request"})
    }
    else if( err.code === '23503') {
        res.status(404).send({ msg: 'Unable to find resource'})
    }
    else next(err)
}

exports.serverError = (err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"});
};