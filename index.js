var bcrypt = require('bcryptjs');
var EventEmitter = require('events').EventEmitter;
var async = require('async');

function passwdjs(lines, options) {

    var e = new EventEmitter();
    async.mapSeries(lines, hash, function (err, results) {
        e.emit('done', results);
    })

    function hash(line, cb) {
        bcrypt.genSalt(options.rounds, function (err, salt) {
            if (err) return cb(err);
            if (line.length === 0) return cb();
            bcrypt.hash(line, salt, function (err, hashed) {
                if (err) return cb(err);
                var out = (options.plaintext ? (line + options.separator) : "") + hashed;
                e.emit('line', out);
                return cb(null, out);
            });
        });
    }
    return e;
}

module.exports = passwdjs;