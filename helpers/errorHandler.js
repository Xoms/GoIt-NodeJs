function errHandler(err, satusCode, responce) {
    console.error("Йа Ошибко", err);            
    return responce.status(satusCode).send(err.message || err); 
}

module.exports = errHandler;