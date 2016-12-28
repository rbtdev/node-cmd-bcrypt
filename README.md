[![Build Status](https://travis-ci.org/rbtdev/node-cmd-bcrypt.svg?branch=v0.0.9)](https://travis-ci.org/rbtdev/node-cmd-bcrypt)

#node-cmd-bcrypt
A simple utility to hash plaintext arrays or line delimited text files into bcrypt hashes.  Provides both
a utility for command line use, and a module function for use in your application.
The command line utility reads from stdin and outputs to stdout, and includes several options for specifying
bcrypt complexity, and inclusion of the plaintext in the output. Easily used as a 'pipe' to process the 
output of other commands.  The function accepts an array of strings, and an options object.

##Usage
###Command Line Utility
```
$ npm install -g @rbtdev/node-cmd-bcrypt

$ passwdjs --help
  Usage: passwdjs <cmd>

  Commands:

    hash [options] [passwords...]  Uses bcryptjs to hash each passoword provided or reads lines from stdin if no passwords are provided.

  Command line tool to hash and compare bcrypt passwords.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:

    $ passwdjs hash -j -r 12 password1 password2 password3
    {
      "$2a$12$QHEdi2VK9HhipSs9rVfQYOS0FwKnjxoL/1mhqkD67lZJ0luPhWX1u": "password1",
      "$2a$12$5pHzuObUEE5wSEOWBIayEe1Uv1RIRXpPVTxaKIXpW07t9fBrBJnWO": "password2",
      "$2a$12$H5eV9qwx82rZeQ8PbYaKW.Unc8uiz2LrvgLmCStdY9EFIiC44lxem": "password3",
    }

    $ cat passwords.txt
    password1
    password2
    password3
    password4
    password5

    $ cat passwords.txt | passwdjs hash -r 12 -j
    {
      "$2a$12$ErsnLyXSXaupErd5imARB.S6sl6QD8m0a.Z0ECGA5KsqiEVJs80W2": "password1",
      "$2a$12$6k/WRP17ba/XfewrzpOz5OJIIbiz12ocHbDJvRpk.USFTioUCnOem": "password2",
      "$2a$12$hkelc1Xu.jFq3UpRmidpCOvZcUEWIpKks0ZewkmArjLSxnCwhoDJ2": "password3",
      "$2a$12$WK1KVKmiH.heNTpUwR2IcuXyzCjrO64Nun/A5R11DavKcc48h0Epu": "password4",
      "$2a$12$86N8t.Ha/RbhM.VYaFJI6uUbZI3g8f93A2pmWz7AAReZ8aAYQm2KO": "password5"
    }

    $ echo "password" | passwdjs hash -r 15
    $2a$15$mT4C4CHQuTcumZG74JlGhen2e.b9yAWVtIFREq9Pge6dDXUkHiZPG
```
###As a required module

####Installation
```js
$ npm install --save @rbtdev/node-cmd-bcrypt
```

```js

var passwdjs = require('@rbtdev/node-cmd-bcrypt');

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
