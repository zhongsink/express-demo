const path = require("path");
const fs = require("fs");
const express = require('express');
const router = express.Router();
const db = require("../model/db.js");
const md5 = require("../model/md5.js");
const Article = require("../model/article.js");
const Project = require("../model/project.js");
const User = require("../model/user.js");

/* GET home page. */
router.get('/', function (req, res) {
    res.header("Content-Type", "application/html;charset=utf-8");
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/getItems', function (req, res) {
    Article.find({ "user": "admin" }, function (err, result) {

        if (err) console.log(err);
        res.json(JSON.stringify(result));
    });
});
router.post('/register', function (req, res) {
    let fields = req.fields;
    User.findOne({ user: fields.user }, (err, result) => {
        if (err || result) {
            // console.log(1)
              res.json(JSON.stringify({ success: false }));
              return;
        }
        else {
            User.create({
                user: fields.user,
                password: md5(fields.password),
            }, (err) => {
                if (err) {
                    // console.log(2);
                     res.json(JSON.stringify({ success: false }));
                     return;
                }
                // console.log(3);
                 return res.json(JSON.stringify({ success: true }));
            });
        }
    });

});
router.post('/signin', function (req, res) {
    let fields = req.fields;
    let password = md5(fields.password);
    User.findOne({ user: fields.user }, (err, result) => {
        // console.log(result);
        if (err || !result) {
            console.log(1);
            res.json(JSON.stringify({ success: false }));
            return;
        }
        if (password === result.password) {
            console.log(2)
            return res.json(JSON.stringify({ success: true }));
        }
        else {
            console.log(3)
            return res.json(JSON.stringify({ success: false }));
        }
    });

});

router.post('/insertItems', function (req, res) {

    let fields = req.fields;
    Article.findOne({
        hash: fields.hash,
        title: fields.title
    }, (err, result) => {
        // console.log(result);
        if (err || result) {
            return res.json({ "success": false });
        }
        else {
            Article.create(fields, function (err) {
                if (err) {
                    // console.log(err);
                    res.json({ "success": false });
                    return;
                }
                else {
                    return res.json({ "success": true });
                }
            });
        }
    });
});

router.post('/insertProjectItems', (req, res) => {

    let fields = req.fields;
    let files = req.files
    Project.findOne({
        title: fields.title
    }, (err, result) => {
        if (err || result) {
            fs.unlink(files.img.path, (err) => {
                if (err) {
                    res.json({ "success": false });
                    return;
                }
            });
            if (err) {
                res.json({ "success": false });
                return;
            }
            else if (result)
                return res.json({ "success": false });
        } else {
            // console.log(fields, files);
            fs.rename(files.img.path, path.join(__dirname + "/../public/images/") + files.img.name, (err) => {
                if (err) {
                    res.json({ "success": false });
                    return;
                }
                Project.create({
                    user: fields.user,
                    url: fields.url,
                    ImgUrl: "http://120.25.221.52" + "/images/" + files.img.name,
                    title: fields.title,
                    githubURL: fields.githubUrl,
                    tags: [fields.tags],
                    createAt: fields.createAt
                }, function (err) {
                    if (err) {
                        res.json({ "success": false });
                        return;
                    }
                    else {
                        return res.json({ "success": true });
                    }
                });
            });
        }
    });
});

router.get('/getProjectItem', function (req, res) {
    Project.find({ "user": "admin" }, function (err, result) {

        if (err) console.log(err);
        res.json(JSON.stringify(result));
    });

});


module.exports = router;
