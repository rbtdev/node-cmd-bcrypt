var passwdjs = require('../bin/passwdjs');
var bcrypt = require('bcryptjs');
var expect = require('chai').expect;

describe('hash array', function () {
    it('should hash an array of plaintext', function () {
        var lines = [
            'passwd1',
            'passwd2',
            'passwd3',
            'passwd4'
        ];
        var lineNumber = 0;
        var opts = {
            rounds: 10,
            plaintext: false
        }
        passwdjs(lines, opts)
            .on('line', gotLine)
            .on('done', done);

        function gotLine(line) {
            console.log("Checking", lines[lineNumber]);
            bcrypt.compare(lines[lineNumber], line, function (err, match) {
                expect(err).to.equal(null);
                expect(match).to.equal(true);
            })
            lineNumber++;
        }

        function done(results) {
            expect(results.length).to.equal(lines.length);
        }
    })
})