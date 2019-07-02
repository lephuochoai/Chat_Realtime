var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    email : String,
    pass : String,
    name: String,
    status: Number
});

module.exports = mongoose.model('User', schema);