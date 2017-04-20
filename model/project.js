/**
 url: "https://github.com/zhongsink",
        ImgUrl: "http://localhost:3000/images/project.png",
        title: "个人主页",
        githubURL:"https://github.com/zhongsink",
        tags:["blog","rem"],
        createAt:"2017-4-15"
 */

const mongoose = require('mongoose');

//schema
const ProjectSchema = new mongoose.Schema({
    "user": String,
    "url"  : String,
    "ImgUrl" : String,
    "title" : String,
    "githubURL" : String,
    "tags":[String],
    "createAt" : String
});

//model
let Project = mongoose.model("Project",ProjectSchema);

module.exports = Project;