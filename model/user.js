const mongoose = require('mongoose');

//schema
const UserSchema = new mongoose.Schema({
    "user": String,
    "password":String
});

//model
let User = mongoose.model("User",UserSchema);

module.exports = User;