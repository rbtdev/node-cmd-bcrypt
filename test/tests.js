var passwdjs = require('../bin/passwdjs');

var lines = [
    'passwd1',
    'passwd2',
    'passwd3',
    'passwd4'
];

var opts = {
    rounds: 10,
    plaintext: true,
    separator: "-"
}
passwdjs(lines, opts)
    .on('line', gotLine)
    .on('done', done);

function gotLine(line) {
    console.log(line);
}

function done() {
    console.log('done');
}