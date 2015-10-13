(function() {

    "use strict";

    var fs = require('fs');
    var mkdirp = require('mkdirp');

    function assetsGenerator(path, theme) {
        console.log("Copying Assets");
        var dir = theme.path + '/assets/';
        var files = fs.readdirSync(dir);
        for (var i in files) {
            var file = files[i];
            var fileCode = fs.readFileSync(dir + "/" + file, 'utf-8');
            if (!fs.existsSync(path + "/output/assets/")) {
                mkdirp.sync(path + "/output/assets/");
            }
            fs.writeFileSync(path + "/output/assets/" + file, fileCode);
        }
    }


    module.exports = assetsGenerator;
})();
