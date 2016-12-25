#!/usr/bin/env Node

var passwdjs = require('../');
var version = require('../package.json').version;
var command = require('commander')

command
    .version(version)
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