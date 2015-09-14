(function() {
    "use strict";
    var Articles = require('./core/articles');
    var Index = require('./core/index');
    var WatchJS = require("watchjs");
    var watch = WatchJS.watch;

    function Mary() {

    }

  	Mary.prototype = {
  		articles: Articles.generate,
  		index: Index.generate,
  	}

  	var mary = new Mary();
  	mary.articles();
  	watch(mary,"articlesDone",function (argument) {
  		console.log("Generating INDEX");
  		mary.index();
  	})

})();
