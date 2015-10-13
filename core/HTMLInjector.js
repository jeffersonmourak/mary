(function() {

    "use strict";

    function HTMLInjector(text, data) {
        var variableRegx = /{{\S+}}/g;
        var variables = text.match(variableRegx);

        for (var i in variables) {
            var variable = variables[i];
            var object = variable.replace("{{", "").replace("}}", "");
            if (data[object] !== undefined) {
                text = text.replace(variable, data[object]);
            }
        }
        return text;
    }

    module.exports = HTMLInjector;
})();