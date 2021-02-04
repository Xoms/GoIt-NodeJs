function dataNormalize(data) {
    return JSON.parse(data.toString())
}
module.exports = dataNormalize;