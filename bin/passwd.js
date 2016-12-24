#!/usr/bin/env node

var bcrypt = require('bcryptjs')
var options = require('commander')
options
    .version('1.0.0')
    .usage('[options]')
    .option('-r, --rounds <n>', "Complexity factor for salt generation [10]", parseInt, 10)
    .parse(process.argv);

var rounds = options.rounds;
var data = "";

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    data += chunk;
});

process.stdin.on('end', function () {
    var lines = data.split('\n');
    lines.forEach(function (line) {
        if (line.length > 0) process.stdout.write(hash(line));
    })
});

function hash(passwd) {
    var salt = bcrypt.genSaltSync(parseInt(rounds));
    try {
        return (bcrypt.hashSync(passwd, salt));
    } catch (ex) {
        console.log("Caught error");
        process.stderr.write(JSON.stringify(ex));
        process.exit(1);
    }
}