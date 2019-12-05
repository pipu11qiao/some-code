(function () {
    var root = this; //window 或 global
    var _ = function (obj) {
        this._wrapped = obj
    }
    _.each = function () { }
    _.map = function () { }
    _.chain = function () { }
    _.each(_.functions(obj), function(name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
            var args = [this._wrapped];
            push.apply(args, arguments);
            return chainResult(this, func.apply(_, args));
        };
    });


})()
