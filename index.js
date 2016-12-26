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
        e.emit('done', results);
    })

    function hash(line, cb) {
        bcrypt.genSalt(opts.rounds, function (err, salt) {
            if (err) return cb(err);
            if (line.length === 0) return cb();
            bcrypt.hash(line, salt, function (err, hashed) {
                if (err) return cb(err);
                var out = (opts.plaintext ? (line + opts.separator) : "") + hashed;
                e.emit('line', out);
                return cb(null, out);
            });
        });
    }
    return e;
}

module.exports = passwdjs;