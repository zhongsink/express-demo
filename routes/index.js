const path = require("path");
const fs = require("fs");
const express = require('express');
const router = express.Router();
const db = require("../model/db.js");
const crypto = require("crypto");
const Article = require("../model/article.js");
const Project = require("../model/project.js");
const User = require("../model/user.js");
const formidable = require('formidable');

const form = new formidable.IncomingForm();
const md5 = crypto.createHash('md5');
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
    form.parse(req, function (err, fields, files) {
        // console.log(fields);    //打印为空对象
        User.findOne({ user: fields.username }, (err, result) => {
            if (err || result) {
                res.json(JSON.stringify({ success: false }));
                if (err) return;
            }
            else {
                User.create({
                    user: fields.username,
                    password: md5.update(fields.password).digest('hex'),
                }, (err) => {
                    if (err) res.json(JSON.stringify({ success: false }));
                    res.json(JSON.stringify({ success: true }));
                });
            }
        })
        // res.json(JSON.stringify(fields));
    });
});
router.post('/signin', function (req, res) {
    form.parse(req, function (err, fields, files) {
        User.findOne({ user: fields.username }, (err, result) => {
            console.log(result);
            if (err) {
                res.json(JSON.stringify({ success: false }));
                return;
            }
            if (md5.update(fields.password).digest('hex') === result.password)
                res.json(JSON.stringify({ success: true }));
            else res.json(JSON.stringify({ success: false }));
        })
    });
});

router.post('/insertItems', function (req, res) {

    form.parse(req, function (err, fields, files) {
        // console.log(fields);
        Article.findOne({
            hash: fields.hash,
            title: fields.title
        }, (err, result) => {
            // console.log(result);
            if (err || result) {
                res.json({ "success": false });
                if (err) {
                    return;
                }
            }
            else {
                Article.create(fields, function (err) {
                    if (err) {
                        // console.log(err);
                        res.json({ "success": false });
                        return;
                    }
                    else {
                        res.json({ "success": true });
                    }
                });
            }
        });
    });
});

router.post('/insertProjectItems', (req, res) => {

    form.uploadDir = path.join(__dirname + "/../public/images");
    form.parse(req, function (err, fields, files) {

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
                    res.json({ "success": false });
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
                            res.json({ "success": true });
                        }
                    });
                });
            }
        });
    });
});

router.get('/getProjectItem', function (req, res) {
    Project.find({ "user": "admin" }, function (err, result) {

        if (err) console.log(err);
        res.json(JSON.stringify(result));
    });

});

module.exports = router;
