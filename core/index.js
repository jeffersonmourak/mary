function Index() {
    var fs = require('fs');
    var self = this;

    function getArticles () {
    	var code = "";
    	//console.log(self.filenames);
    	for(var i in self.filenames){
    		var article = self.filenames[i];
    		code += "<a href=\"" + article.src +"\">" + article.data.title + "</a>\n";
    	}
    	return code;
    }

    fs.readFile("theme/index.html", 'utf8', function(err, code) {
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
                    if(objectName == "articles"){
                    	code = code.replace(match, getArticles());
                    }
                    else{
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
