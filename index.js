var bcrypt = require('bcryptjs');
var EventEmitter = require('events').EventEmitter;
var async = require('async');

function passwdjs(passwd, options) {
    var e = new EventEmitter();
    if (!passwd) return setImmediate(e.emit('error', new Error("Invalid passwd parameter")))
    var lines = Array.isArray(passwd) ? passwd : [].push(passwd);
    var opts = options ? options : {
        rounds: 10,
        plaintext: false
    }
    async.mapSeries(lines, hash, function (err, results) {
        var result = results;
        if (opts.json) {
            result = {};
            lines.forEach(function (line, index) {
                var hash = results[index];
                result[hash] = hash ? line : undefined;
            });
        }
        e.emit('done', result);
    })

    function hash(line, cb) {
        if (line.length === 0) return async.setImmediate(cb, null, null);
        bcrypt.genSalt(opts.rounds, function (err, salt) {
            if (err) return cb(err);
            bcrypt.hash(line, salt, function (err, hashed) {
                if (err) return cb(err);
                e.emit('line', hashed);
                return cb(null, hashed);
            });
        });
    }
    return e;
}

module.exports = passwdjs;