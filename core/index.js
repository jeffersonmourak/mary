function Index() {
    var fs = require('fs');
    var WatchJS = require("watchjs");
    var watch = WatchJS.watch;

    var self = this;

    function generateArticles() {
        var articlesCode = "";
        fs.readFile("theme/articles.html", 'utf8', function(err, code) {
            if (err) {
                return console.log(err);
            }

            for (var i in self.filenames) {
                var thisArticle = code;
                var article = self.filenames[i];
                var matches = thisArticle.match(/{{\S+}}/g);
                matches.forEach(function(match) {
                    var objectName = match.replace("{{", "").replace("}}", "");
                    thisArticle = thisArticle.replace(match, article[objectName]);
                });
                articlesCode += thisArticle;
            }

            self.articlesCode = articlesCode;

        });

    }

    function getArticles () {
        return self.articlesCode;
    }

    fs.readFile("theme/index.html", 'utf8', function(err, code) {
        generateArticles();
        if (err) {
            return console.log(err);
        }

        fs.readFile("theme/infos.json", 'utf8', function(err, data) {
            if (err) {
                return console.log(err);
            }

            data = JSON.parse(data);
            data.articles = self.filenames;

            var matches = code.match(/{{\S+}}/g);
            for (var i in matches) {
                var match = matches[i];
                var objectName = match.replace("{{", "").replace("}}", "");
                if (data[objectName] !== undefined) {
                    if (objectName == "articles") {
                        code = code.replace(match, getArticles());
                    } else {
                        code = code.replace(match, data[objectName]);
                    }
                }

            }
            fs.writeFile("output/index.html", code, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
    });
}

module.exports = {
    generate: Index,
}
