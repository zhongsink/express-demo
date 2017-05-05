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
    try {
        Article.find({ "user": "admin" }, function (err, result) {
            if (err) throw err;
            return res.json(JSON.stringify(result));
        });
    } catch (err) {
        console.log(err);
    }
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
            // console.log(1);
            res.json(JSON.stringify({ success: false }));
            return;
        }
        if (password === result.password) {
            // console.log(2)
            req.session.user = fields.user ;
            return res.json(JSON.stringify({ success: true }));
        }
        else {
            // console.log(3)
            return res.json(JSON.stringify({ success: false }));
        }
    });

});

router.post('/insertItem', function (req, res) {

    let fields = req.fields;
    Article.findOne({
        hash: fields.hash,
        title: fields.title
    }, (err, result) => {
        // console.log(result);
        if (err || result) {
            return res.json(JSON.stringify({ success: false }));
        }
        else {
            Article.create({
                user:"admin",
                body: decodeURIComponent(fields.body),
                created_at: fields.created_at,
                updated_at: fields.updated_at,
                labels: [{
                    name: decodeURIComponent(fields.labels)
                }],
                hash: fields.hash,
                title: decodeURIComponent(fields.title)

            }, function (err) {
                if (err) {
                    // console.log(err);
                    res.json(JSON.stringify({ success: false }));
                    return;
                }
                else {
                    return res.json(JSON.stringify({ success: true }));
                }
            });
        }
    });
});

router.post('/insertProject', (req, res) => {

    let fields = req.fields;
    let files = req.files;
    console.log(req.fields,req.files);
    res.json(JSON.stringify({ success: true }));
    // Project.findOne({
    //     title: fields.title
    // }, (err, result) => {
    //     if (err || result) {
    //         fs.unlink(files.img.path, (err) => {
    //             if (err) {
    //                 res.json(JSON.stringify({ success: false }));
    //                 return;
    //             }
    //         });
    //         if (err) {
    //             res.json(JSON.stringify({ success: false }));
    //             return;
    //         }
    //         else if (result)
    //             return res.json(JSON.stringify({ success: false }));
    //     } else {
    //         // console.log(fields, files);
    //         fs.rename(files.img.path, path.join(__dirname + "/../public/images/") + files.img.name, (err) => {
    //             if (err) {
    //                 res.json(JSON.stringify({ success: false }));
    //                 return;
    //             }
    //             Project.create({
    //                 user: "admin",
    //                 url: fields.url,
    //                 ImgUrl: "http://www.inkera.cn" + "/images/" + files.img.name,
    //                 title: fields.title,
    //                 githubURL: fields.githubURL,
    //                 tags: [fields.tags],
    //                 createAt: fields.createAt
    //             }, function (err) {
    //                 if (err) {
    //                     res.json(JSON.stringify({ success: false }));
    //                     return;
    //                 }
    //                 else {
    //                     return res.json(JSON.stringify({ success: true }));
    //                 }
    //             });
    //         });
    //     }
    // });
});

router.get('/getProjectItem', function (req, res) {
    try {
        Project.find({ "user": "admin" }, function (err, result) {
            if (err) throw err;
            return res.json(JSON.stringify(result));
        });
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;
