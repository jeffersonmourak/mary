#!/usr/bin/env node

(function() {
    "use strict";

    // prototype Hack functions

    String.prototype.PathNormalize = function(array){
        var text = this.split("/").reverse();
        if(text[0] == ""){
            return text.slice(1).reverse().join("/");
        }
        return this;
    }

    //core Modules
    var articlesGenerator = require("./core/articles"),
        indexGenerator = require("./core/index"),
        Theme = require("./core/theme"),
        assetsGenerator = require("./core/assets"),
        Arguments = require("./core/arguments"),
        acceptableArguments = require("./core/arguments.json");
    
    // Node Modules

    var fs = require('fs'),
        mkdirp = require('mkdirp');

    //argument strings 
    
    var args = process.argv;
    var argumentQuery = Arguments(args, acceptableArguments);

    //path locations

    var path = process.cwd();
    var themePath = process.cwd() + "/theme";
    
    //path changer
    if (argumentQuery.output !== false && argumentQuery.output !== undefined) {
        if (argumentQuery.output[1] != "/") {
            path = process.cwd() + "/" + argumentQuery.output;
            path = path.PathNormalize();
        } else {
            path = argumentQuery.output;
        }
    }
    if (argumentQuery.theme !== false && argumentQuery.theme !== undefined) {
        if (argumentQuery.theme[1] != "/") {
            themePath = process.cwd() + "/" + argumentQuery.theme;
            themePath = themePath.PathNormalize();
        } else {
            themePath = argumentQuery.theme;
        }
    }
    
    //theme loader

    var theme = new Theme(themePath);
        
    //mary Main code

    function Mary() {
        this.articlesRoutes = [];
    };

    Mary.prototype = {
        assets: assetsGenerator,
        articles: articlesGenerator,
        index: indexGenerator,
    }

    var m = new Mary();
    m.articles(path,theme);
    m.assets(path,theme);
    m.index(path, theme);

})();
