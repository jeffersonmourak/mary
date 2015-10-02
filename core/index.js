function Index() {
    var fs = require('fs');
    var WatchJS = require("watchjs");
    var watch = WatchJS.watch;

    var self = this;

    function assets() {
        var dir = 'theme/assets/';
        var data = {};

        console.log("Reading Assets")

        fs.readdirSync(dir, function(err, files) {
            if (err) throw err;
            var c = 0;
            files.forEach(function(file) {
                c++;
                fs.readFileSync(dir + file, 'utf-8', function(err, html) {
                    if (err) throw err;
                    fs.writeFile("output/assets/" + file, html, function(err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                });
            });
        });
    }

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
                    if(article[objectName] !== undefined){
                         thisArticle = thisArticle.replace(match, article[objectName]);
                    }
                    else{
                        thisArticle = thisArticle.replace(match, "");
                    }
                });
                articlesCode += thisArticle;
            }

            self.articlesCode = articlesCode;

        });

    }

    function getArticles() {
        return self.articlesCode;
    }

    fs.readFile("theme/index.html", 'utf8', function(err, code) {
        assets();
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
