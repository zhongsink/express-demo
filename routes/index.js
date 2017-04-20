const path = require("path");
const fs = require("fs");
const express = require('express');
const router = express.Router();
const db = require("../model/db.js");
const Article = require("../model/article.js");
const Project = require("../model/project.js");

const items = require("../config/data.js");
const projectItems = require("../config/projectData.js");

/* GET home page. */
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
}
);

router.get('/getItems', function (req, res) {
    Article.find({ "user": "admin" }, function (err, result) {

        if (err) console.log(err);
        res.json(JSON.stringify(result));
    });
}
);

router.get('/insertItems', function (req, res) {

    for (let i = 0; i < items.length; i++) {
        Article.findOne(items[i], (err, result) => {
            if (err || result) console.log(i + " have");
            else {
                Article.create(items[i], function (err) {
                    if (err) {
                        console.log(err);
                        res.json({ "success": "0" });
                    }
                    else {
                        console.log("insert " + i + " data");

                    }

                });
            }
        });

    }
    res.json({ "success": "1" });

}
);

router.get('/insertProjectItems', (req, res) => {
    for (let i = 0; i < projectItems.length; i++) {
        Project.findOne(projectItems[i], (err, result) => {
            if (err || result) console.log(i + " have");
            else {
                Project.create(projectItems[i], function (err) {
                    if (err) {
                        console.log(err);
                        res.json({ "success": "0" });
                    }
                    else {
                        console.log("insert " + i + " data");
                    }
                });
            }
        });

    }
    res.json({ "success": "1" });
});


router.get('/getProjectItem', function (req, res) {
    Project.find({ "user": "admin" }, function (err, result) {

        if (err) console.log(err);
        res.json(JSON.stringify(result));
    });

}
)

module.exports = router;
