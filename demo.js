
var express = require("express");
var app = express();
var formidable = require('formidable');
var fs=require('fs');
var util = require('util');
//设置模板引擎
app.set("view engine", "ejs");

app.get("/",function (req, res){
	res.render("index");
});


app.post("/post",function (req, res){
	var form = new formidable.IncomingForm();
	var newpath="./public/";
	 form.encoding = 'utf-8';
	 form.uploadDir = "./public";
	 form.parse(req, function (err,fields, files) {
	 	console.log(util.inspect({fields: fields, files: files}));
		 fs.rename(files.file.path,newpath+files.file.name,function(err){
			 if(err){
				 console.log(err);
				 return ;
			 }
			 res.send("1");
		 });

	 });

});


app.listen(3000);
