[![Build Status](https://travis-ci.org/rbtdev/node-cmd-bcrypt.svg?branch=v0.0.9)](https://travis-ci.org/rbtdev/node-cmd-bcrypt)
# node-cmd-bcrypt

##Usage
###Command Line Utility
```
$ npm install -g node-cmd-bcrypt
$ cat password_file.txt | passwdjs -r 12 -p -s "-" > hashmap.txt
$ passwdjs --help

Usage: index [options]

  Reads stdin and uses bcrypt to hash each line. Writes hash values to stdout one per line in the same order as the input lines.

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -r, --rounds <n>             Complexity factor for salt generation [10]
    -p, --plaintext              Include plaintext at beginning of line, sepated by ' '
    -s, --separator <separator>  Use as a separator between plaintext and hash [':']

  Examples:

    $ cat file.txt | passwdjs -r 10 -p -s " "
    $ echo "password" | passwdjs -r 15

```
###As a required module
```js
var passwdjs = require(@rbtdev/node-cmd-bcrypt);

var passwords = [
  'password1',
  'password2',
  'password3'
]
 
var opts = {
  rounds: 12,       // rounds to use (complexity).  see bcryptjs for details. 
  plaintext: true,  // true to include original plaintext at beginning of output line [false]
  separator: '-'    // separator between plaintext and hash in output line [':']
};

passwdjs(passwords, opts)
  .on('line', doSomethingWithLine)
  .on('done', doSomethingWithResultsArray);
  
function doSomethingWithLine (line) {
  console.log('line =', line);
};
  
function doSomethingWithResultsArray (results) {
  results.forEach(function (result) {
    console.log('hash =', result);
  });
}
```
