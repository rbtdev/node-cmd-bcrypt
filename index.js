#!/usr/bin/env node

var bcrypt = require('bcryptjs')
var options = require('commander')
options
    .version('1.0.0')
    .usage('[options] <password>')
    .option('-r, --rounds <n>', "Complexity factor for salt generation [10]", parseInt, 10)
    .parse(process.argv);
    
var passwd = options.args[0];
var rounds = options.rounds;
if (!passwd) return options.help();;
var salt = bcrypt.genSaltSync(parseInt(rounds));
try {
    var hash = bcrypt.hashSync(passwd, salt);
    process.stdout.write(hash);
    process.exit(0);
} catch (ex) {
    console.log("Caught error");
    process.stderr.write(JSON.stringify(ex));
    process.exit(1);
}