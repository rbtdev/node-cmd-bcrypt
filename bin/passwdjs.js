#!/usr/bin/env Node

var passwdjs = require('../');
var version = require('../package.json').version;
var command = require('commander')

command
    .version(version)
    .usage('[options]')
    .description(
        "Reads stdin and uses bcrypt to hash each line.  Writes each hash" +
        "value to stdout in the order of the original plaintext.  If the '-j' " +
        "option is used, the hash values are placed into a JSON object with " +
        "the original plaintext as the value of the hash.")

.option('-r, --rounds <n>', "Complexity factor for salt generation [10]", parseInt, 10)
    .option('-j, --json', 'Output a JSON object which is a map of plaintext to hash')

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
    json: command.json || false
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
            if (!options.json) process.stdout.write(hashed + '\n');
        })
        .on('done', function (result) {
            if (options.json) {
                process.stdout.write(JSON.stringify(result, null, 2));
            }
            process.exit(0);
        })
        .on('error', function (err) {
            process.stderr.write(err);
            process.exit(1);
        })
}