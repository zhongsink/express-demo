const mongoose = require('mongoose');

//schema
const ArticleSchema = new mongoose.Schema({
    "user": String,
    "hash"  : String,
    "title" : String,
    "created_at" : String,
    "labels" : [mongoose.Schema.Types.Mixed],
    "updated_at":String,
    "body" : String
});
//索引
ArticleSchema.index({ "hash": 1});


//model
let Article = mongoose.model("Article",ArticleSchema);

module.exports = Article;