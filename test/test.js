var passwdjs = require('../');
var bcrypt = require('bcryptjs');
var chai = require('chai');
var expect = chai.expect;

var lineEvent = false;
var doneEvent = false;
var hash = null;
var hashLines = [];
var hashArray = [];
var lineCount = 0;
var passwords = [];




describe("hash array of passwords", function (done) {
    beforeEach(function (done) {
        reset();
        run(done);
    })

    it("Should emit a 'line' event for each password", function () {
        expect(hash).to.be.a.string;
        expect(lineCount).to.equal(passwords.length);
    });

    it("Should emit a 'done' event with an array of hashes", function () {
        expect(doneEvent).to.be.true;
        expect(hashArray.length).to.equal(passwords.length);
        expect(hashLines).to.deep.equal(hashArray);
    })
})

function run(done) {
    passwdjs(passwords, opts)
        .on('line', gotLine)
        .on('done', gotDone);

    function gotLine(line) {
        hashLines.push(line);
        lineCount++;
    }

    function gotDone(hashed) {
        doneEvent = true;
        hashArray = hashed;
        done();
    }
}

function reset() {
    lineEvent = false;
    doneEvent = false;
    hash = null;
    hashLines = [];
    hashArray = [];
    lineCount = 0;

    passwords = [
        'passwd1',
        'passwd2',
        'passwd3',
        'passwd4'
    ];
    opts = {
        rounds: 10,
        plaintext: false
    }

}