function errHandler(err, satusCode) {
    console.error(err);            
    return res.status(satusCode).send(err.message || err); 
}

module.exports = errHandler;