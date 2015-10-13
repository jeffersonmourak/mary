(function() {

    "use strict";

    function getArgName(shortcut, accept) {
        for (var i in accept) {
            if (accept[i].shortcut === shortcut) {
                return accept[i].name;
            }
        }
        return false;
    }

    function getArgData(name, accept) {
        for (var i in accept) {
            if (accept[i].name === name) {
                return accept[i];
            }
        }
        return false;
    }

    function processArg(argName, index, accept, args) {
        var data = getArgData(argName, accept);
        if (data.requestValue) {
            var argValue = args[index + 1];
            if (argValue[1] === "-" || argValue[0] === "-") {
                throw "Invalid Value to argument \"" + argName + "\"";
            }
            return argValue;
        }
    }

    function Arguments(args, accept) {
        var openArgument = false;
        var commonValue = [];
        var query = {};
        var invalid = [];

        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (arg[1] === '-') {
                var name = arg.replace("--", "");
                query[name] = processArg(name, i, accept, args);
            } else if (arg[0] === "-") {
                var shortcut = arg.replace("-", "");
                var argName = getArgName(shortcut, accept);
                if (argName) {
                    query[argName] = processArg(argName, i, accept, args);
                } else {
                    invalid.push(shortcut);
                }
            }
        }

        if (invalid.length > 0) {
            console.error("Invalid arguments " + invalid.join(", "));
        }

        return query;
    }

    module.exports = Arguments;
})();
