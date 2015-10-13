(function() {
    "use strict";
    function getFiles(dir, files_) {
        files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files) {
            var name = dir + '/' + files[i];
            var stats = fs.statSync(name);
            if (fs.statSync(name).isDirectory()) {
                getFiles(name, files_);
            } else {
                var file = stats;
                file.name = name;
                files_.push(file);
            }
        }

        files_.sort(function(a, b) {
            var c = new Date(a.mtime);
            var d = new Date(b.mtime);
            return c - d;
        });

        var filenames = [];

        for (var i in files_.reverse()) {
            filenames.push(files_[i].name);
        }

        return filenames;

    }

    module.exports = getFiles;

})();
