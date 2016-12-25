#!/usr/bin/env Node

function passwdjs(lines, options) {
    var bcrypt = require('bcryptjs');
    var EventEmitter = require('events').EventEmitter;
    var async = require('async');
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

if (require.main === module) {
    var command = require('commander')

    command
        .version('0.0.3')
        .usage('[options]')
        .description("Reads stdin and uses bcrypt to hash each line. Writes " +
            "hash values to stdout one per line in the same order as the input lines.")

    .option('-r, --rounds <n>', "Complexity factor for salt generation [10]", parseInt, 10)
        .option('-p, --plaintext', "Include plaintext at beginning of line, sepated by ' '")
        .option('-s, --separator <separator>', "Use as a separator between plaintext and hash [':']")

    command.on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ cat file.txt | passwdjs -r 10 -p -s " "');
        console.log('    $ echo "password" | passwdjs -r 15');
        console.log('');
    });

    command.parse(process.argv);

    var options = {
        rounds: parseInt(command.rounds) || 10,
        plaintext: command.plaintext || false,
        separator: command.separator || ''
    }

    var data = "";
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (chunk) {
        data += chunk;
    });
    process.stdin.on('end', hashData);

    function hashData() {
        var lines = data.split('\n');
        passwdjs(lines, options)
            .on('line', function (hashed) {
                process.stdout.write(hashed + '\n');
            })
            .on('done', function (results) {
                process.exit(0);
            })
            .on('error', function (err) {
                process.stderr.write(err);
                process.exit(1);
            })
    }
}

module.exports = passwdjs;