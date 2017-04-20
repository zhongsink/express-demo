var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog');

var db = mongoose.connection;
db.once('open', function (callback) {
    console.log("mongodb open success");
});

module.exports = db;