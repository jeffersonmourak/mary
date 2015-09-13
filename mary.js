(function() {

    var fs = require('fs');
    fs.readFile('atricles/test.md', 'utf8', function(err, article) {
        if (err) {
            return console.log(err);
        }
        fs.readFile('theme/testTheme.html', 'utf8', function(err, theme) {
            if (err) {
                return console.log(err);
            }
            var matches = theme.match(/{{\S+}}/g);
            console.log(matches);
        });
    });

})();
