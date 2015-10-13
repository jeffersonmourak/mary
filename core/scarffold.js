(function(){
	"use strict";

	function intersectPath(filename, path){

		function isIn(array, value){
			for(var i in array){
				var arrValue = array[i];
				if(value == arrValue){
					return true;
				}
			}
			return false;
		}

		var segments = filename.split("/");
		var basePath = path.split("/");
		var FilePath = []
		for(var i in segments){
			var segment = segments[i];
			if(!isIn(basePath, segment)){
				FilePath.push(segment);
			}
		}
		return FilePath.join("/");
	}

	var fs = require('fs'),
		readlineSync = require('readline-sync'),
    	mkdirp = require('mkdirp'),
    	getFiles = require("./getFiles");

    function Scarffold(name){
    	this.dir = process.cwd();
    	this.name = name;
    	this.defaultThemePath = "/home/jefferson/Repositories/mary/theme";
    }

    Scarffold.prototype = {
    	saveInfo: function(info){
    		fs.writeFileSync(this.dir + "/" + this.name + "/theme/infos.json", info);
    	},
    	generate: function(){
    		if(!fs.existsSync(this.dir + "/" + this.name)){
    			console.log("Generating The Data");
    			mkdirp.sync(this.dir + "/" + this.name);
    			mkdirp.sync(this.dir + "/" + this.name + "/theme");
    			mkdirp.sync(this.dir + "/" + this.name + "/theme/assets");
    			mkdirp.sync(this.dir + "/" + this.name + "/output");
    			mkdirp.sync(this.dir + "/" + this.name + "/articles");
    			var filenames = getFiles(this.defaultThemePath);

    			for(var i in filenames){
    				var filename = filenames[i];
    				var fileCode = fs.readFileSync(filenames[i], 'utf-8');
    				filenames[i] = intersectPath(filename, this.defaultThemePath);
    				fs.writeFileSync(this.dir + "/" + this.name + "/theme/" + filenames[i], fileCode);
    			}
    			


    		}
    		else{
    			console.log("A project " + this.name + " exists in this directory, change the name, select other directory or delete the project");
    		}
    	}
    }
    var looksGood = false;
  	do{
  		console.log("Welcome to Mary Scarffold :D\nEnter the information of your blog\n\n");
	  	var projectName = readlineSync.question('Project Name: ');

	  	var author = readlineSync.question('Author: ');
	  	var BlogName = readlineSync.question('Blog Name: ');

	  	var blogData = {
	  		author: author,
	  		title: BlogName
	  	}
	  	blogData = JSON.stringify(blogData,null, 4);
	  	console.log(blogData);
    	looksGood = readlineSync.question('\n\nLooks Good ?(y) ');
    	if(looksGood === "" || looksGood.toLowerCase() == "y"){
    		looksGood = true;
    	}
    	else{
    		looksGood = false;
    	}

  	}
  	while(!looksGood);
  	var scarffold = new Scarffold(projectName);
  	scarffold.generate();
  	scarffold.saveInfo(blogData)

})();