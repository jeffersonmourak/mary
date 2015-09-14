function Articles() {
    console.log("Creating the articles");
    var fs = require('fs');
    var markdown = require("markdown").markdown;
    var WatchJS = require("watchjs");
    var watch = WatchJS.watch;

    var self = this;
    self.filenames = [];

    function getFiles(dir, files_) {
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

    var articles = getFiles("articles");
    self.TextArticles = articles;

    articles.forEach(function(filename) {
        fs.readFile(filename, 'utf8', function(err, article) {
            if (err) {
                return console.log(err);
            }

            var headerSection = article.match(/---\S+---/g)[0];
            var sectionPosition = article.search(headerSection);
            var data = JSON.parse(article.substring(0, sectionPosition));
            var render = data;
            data.content = markdown.toHTML(article.substring(sectionPosition + headerSection.length));

            fs.readFile('theme/article.html', 'utf8', function(err, theme) {
                if (err) {
                    return console.log(err);
                }
                var matches = theme.match(/{{\S+}}/g);
                matches.forEach(function(match) {
                    var decorator = match;
                    match = match.replace("{{", "").replace("}}", "");
                    theme = theme.replace(decorator, data[match]);
                });

                fs.writeFile(filename.replace("articles", "output/articles").replace("md", "html"), theme, function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    self.filenames.push({
                        "src": filename.replace("md", "html"),
                        "data" : render
                    });
                });
            });
        });
    });

    watch(self, "filenames", function() {
        if (self.filenames.length == self.TextArticles.length) {
            self.articlesDone = true;
        }
    });


}

module.exports = {
    generate: Articles,
}
