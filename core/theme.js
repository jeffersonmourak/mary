(function() {
    "use strict";

    function Theme(path) {
        this.index = false;
        this.article = false;
        this.articles = false;
        this.information = false;
        this.path = path;
        this.init();
    }

    Theme.prototype = {
        init: function() {
            this.loadTheme();
        },
        loadTheme: function() {
            this.article = fs.readFileSync(this.path + "/article.html", 'utf-8');
            this.index = fs.readFileSync(this.path + "/index.html", 'utf-8');
            this.information = JSON.parse(fs.readFileSync(this.path + "/infos.json", 'utf-8'));
        },
        setThemePath: function(path) {
            this.path = path;
            this.loadTheme();
        }
    }


    module.exports = Theme;

})()
