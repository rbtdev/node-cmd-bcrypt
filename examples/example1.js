var passwdjs = require('../');

var passwords = [
    'password1',
    'password2',
    'password3'
]

var opts = {
    rounds: 12, // rounds to use (complexity).  see bcryptjs for details. 
    json: true, // true to output JSON object with hashes and passwords
};

passwdjs(passwords, opts)
    .on('line', doSomethingWithLine)
    .on('done', doSomethingWithResultsObj);

function doSomethingWithLine(line) {
    console.log('line =', line);
};

function doSomethingWithResultsObj(results) {
    for (var hash in results) {
        var plaintext = results[hash]
        console.log("the bcrypt hash for " + plaintext + " is " + hash);
    };
}