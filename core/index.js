(function() {
    var _getFiles = require("./getFiles");
    var HTMLInjector = require("./HTMLInjector");
    var fs = require('fs');

    function getArticleDOMPosition(theme) {
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

    function indexGenerator(path, theme) {
        console.log("Generating Index");
        var indexTheme = theme.index;
        var themeData = theme.information;
        var position = getArticleDOMPosition(theme);
        var topData = HTMLInjector(indexTheme.substring(0, position[0] - 11), themeData);
        var bottomData = HTMLInjector(indexTheme.substring(position[1] + 11), themeData);
        var articleLoop = indexTheme.substring(position[0], position[1]);
        var articles = "";
        for (var i in this.articlesRoutes) {
            var articleData = this.articlesRoutes[i];
            if (articleData.content.length > 500) {
                articleData.content = articleData.content.substring(0, 500) + "...";
            }
            articles += HTMLInjector(articleLoop, articleData);
        }

        var body = topData + articles + bottomData;

        fs.writeFileSync(path + "/output/index.html", body);

    }

    module.exports = indexGenerator;
})()
