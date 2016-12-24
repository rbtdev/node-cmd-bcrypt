#!/usr/bin/env node

var bcrypt = require('bcryptjs')
var options = require('commander')
options
    .version('0.0.3')
    .usage('[options]')
    .description("Reads stdin and uses bcrypt to hash each line. Writes " +
        "hash values to stdout one per line in the same order as the input lines.")
    .option('-r, --rounds <n>', "Complexity factor for salt generation [10]", parseInt, 10)
    .option('-p, --plaintext', "Include plaintext at beginning of line, sepated by ' '")
    .option('-s, --separator <separator>', "Use as a separator between plaintext and hash [':']")

options.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ cat file.txt | passwdjs -r 10 -p -s " "');
    console.log('    $ echo "password" | passwdjs -r 15');
    console.log('');
});

options.parse(process.argv);

var rounds = options.rounds || 10;
var plaintext = options.plaintext;
var separator = options.separator || ":";
var data = "";

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    data += chunk;
});

process.stdin.on('end', function () {
    var lines = data.split('\n');
    lines.forEach(function (line) {
        if (line.length > 0) {
            var out = (plaintext ? (line + separator) : "") + hash(line, rounds) + '\n';
            process.stdout.write(out);
        }
    })
});

function hash(passwd, rounds) {
    var salt = bcrypt.genSaltSync(parseInt(rounds));
    try {
        return (bcrypt.hashSync(passwd, salt));
    } catch (ex) {
        console.log("Caught error");
        process.stderr.write(JSON.stringify(ex));
        process.exit(1);
    }
}