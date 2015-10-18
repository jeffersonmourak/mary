(function() {

    "use strict";

    GLOBAL.fs = require('fs');

    var HTMLInjector = require("./HTMLInjector"),
        _getFiles = require("./getFiles");

    var showdown  = require('showdown'),
        converter = new showdown.Converter();

    function articleHeaderExtractor(file, theme) {
        var fileContent = fs.readFileSync(file, 'utf-8');
        var articleHeader = fileContent.match(/---\S+---/g);
        var data = false;
        var variableRegx = /{{\S+}}/g;

        if (articleHeader.length > 0) {
            var sectionPosition = fileContent.search(articleHeader[0]);
            data = JSON.parse(fileContent.substring(0, sectionPosition));
            data.content = converter.makeHtml(fileContent.substring(sectionPosition + articleHeader[0].length));
        }

        data.html = HTMLInjector(theme.article, data);
        return data;
    }

    function articlesGenerator(path, theme) {
        var articleTexts = _getFiles(path + "/articles");
        console.log("Generating Articles");
        for (var i in articleTexts) {
            console.log((parseInt(i) + 1) + " of " + articleTexts.length);
            var articleText = articleTexts[i];
            var fileName = articleText.replace(path + "/articles/", "").replace("md", "html");
            var data = articleHeaderExtractor(articleText, theme);
            fs.writeFileSync(path + "/output/articles/" + fileName, data.html);
            data.src = "/articles/" + fileName.replace(path, "");
            this.articlesRoutes.push(data);
        }

    }


    module.exports = articlesGenerator;


})();
