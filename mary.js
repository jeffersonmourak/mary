#!/usr/bin/env node

(function() {
    "use strict";
    var Articles = require('./core/articles');
    var Index = require('./core/index');
    var fs = require('fs');
    var mkdirp = require('mkdirp');
    var markdown = require("markdown").markdown;

    /* THEME */

    function Theme() {
        this.index = false;
        this.article = false;
        this.articles = false;
        this.information = false;

        this.init();
    }

    Theme.prototype = {
        init: function() {
            this.article = fs.readFileSync(__dirname + "/theme/article.html", 'utf-8');
            this.articles = fs.readFileSync(__dirname + "/theme/articles.html", 'utf-8');
            this.index = fs.readFileSync(__dirname + "/theme/index.html", 'utf-8');
            this.information = JSON.parse(fs.readFileSync(__dirname + "/theme/infos.json", 'utf-8'));
        }
    }

    var theme = new Theme();

    /* END THEME */

    /* FUNCTIONS */

    function _getFiles(dir, files_) {
        files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files) {
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()) {
                getFiles(name, files_);
            } else {
                files_.push(name);
            }
        }
        return files_;
    }

    function HTMLInjector(text, data) {
        var variableRegx = /{{\S+}}/g;
        var variables = text.match(variableRegx);

        for (var i in variables) {
            var variable = variables[i];
            var object = variable.replace("{{", "").replace("}}", "");
            if (data[object] !== undefined) {
                text = text.replace(variable, data[object]);
            }
        }
        return text;
    }

    function articleHeaderExtractor(file) {
        var fileContent = fs.readFileSync(file, 'utf-8');
        var articleHeader = fileContent.match(/---\S+---/g);
        var data = false;
        var variableRegx = /{{\S+}}/g;

        if (articleHeader.length > 0) {
            var sectionPosition = fileContent.search(articleHeader[0]);
            data = JSON.parse(fileContent.substring(0, sectionPosition));
            data.content = markdown.toHTML(fileContent.substring(sectionPosition + articleHeader[0].length));
        }

        data.html = HTMLInjector(theme.article, data);
        return data;
    }

    function getArticleDOMPosition() {
        var indexTheme = theme.index;
        var pos = [];
        pos[0] = indexTheme.search("{%article%}") + 11;
        indexTheme = indexTheme.substring(pos[0]);
        pos[1] = (pos[0]) + indexTheme.search("{%article%}");

        indexTheme = indexTheme.substring(pos[1] + 11);
        if (indexTheme.search("{%article%}") != -1) {
            throw "ARTICLE IS DUPLICATED";
        }
        return pos;
    }

    function assetsGenerator() {
        console.log("Copying Assets");
        var dir = './theme/assets';
        var files = fs.readdirSync(dir);
        for (var i in files) {
            var file = files[i];
            var fileCode = fs.readFileSync(dir + "/" + file, 'utf-8');
            if (!fs.existsSync(__dirname + "/output/assets/")) {
                mkdirp.sync(__dirname + "/output/assets/");
            }
            fs.writeFileSync(__dirname + "/output/assets/" + file, fileCode);
        }
    }

    function articlesGenerator() {
        var articleTexts = _getFiles(__dirname + "/articles");
        console.log("Generating Articles");
        for (var i in articleTexts) {
            console.log((i + 1) + " of " + articleTexts.length);
            var articleText = articleTexts[i];
            var fileName = articleText.replace(__dirname + "/articles/", "").replace("md", "html");
            var data = articleHeaderExtractor(articleText);
            fs.writeFileSync(__dirname + "/output/articles/" + fileName, data.html);
            data.src = "/articles/" + fileName.replace(__dirname, "");
            this.articlesRoutes.push(data);
        }

    }

    function indexGenerator() {
        console.log("Generating Index");
        var indexTheme = theme.index;
        var themeData = theme.information;
        var position = getArticleDOMPosition();
        var topData = HTMLInjector(indexTheme.substring(0, position[0] - 11), themeData);
        var bottomData = HTMLInjector(indexTheme.substring(position[1] + 11), themeData);
        var articleLoop = indexTheme.substring(position[0], position[1]);
        var articles = "";
        for (var i in this.articlesRoutes) {
            var articleData = this.articlesRoutes[i];
            if(articleData.content.length > 500){
              articleData.content = articleData.content.substring(0,500) + "...";
            }
            articles += HTMLInjector(articleLoop, articleData);
        }

        var body = topData + articles + bottomData;

        fs.writeFileSync(__dirname + "/output/index.html", body);

    }

    /* END FUNCTIONS */
    function Mary() {
        this.articlesRoutes = [];
    };

    Mary.prototype = {
        assets: assetsGenerator,
        articles: articlesGenerator,
        index: indexGenerator
    }

    console.log("WELCOME TO MARY");

    var m = new Mary();
    m.articles();
    m.assets();
    m.index();

})();
