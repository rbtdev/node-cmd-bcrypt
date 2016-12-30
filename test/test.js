var passwdjs = require('../');
var bcrypt = require('bcryptjs');
var chai = require('chai');
var expect = chai.expect;

var lineEvent = false;
var doneEvent = false;
var hash = null;
var hashLines = null;
var hashResult = null;
var lineCount = 0;
var arg = null;


describe("hash array of passwords, emit line event", function (done) {
    before(function (done) {
        reset(false, false);
        run(done);
    })

    it("Should emit a 'line' event for each password", function () {
        expect(hash).to.be.a.string;
        expect(lineCount).to.equal(arg.length);
    });

    it("Should emit a 'done' event", function () {
        expect(doneEvent).to.be.true;
    })
    it("Should return array of hashes", function () {
        expect(hashResult).to.be.an("array")
    })
    it("Should have the right number of hashes", function () {
        expect(hashResult.length).to.equal(arg.length);
    })
    it("Should match the hashes from the line event", function () {
        expect(hashLines).to.deep.equal(hashResult);
    })
})

describe("hash file of passwords, emit line event", function (done) {
    before(function (done) {
        reset(false, false);
        run(done);
    })

    it("Should emit a 'line' event for each password", function () {
        expect(hash).to.be.a.string;
        expect(lineCount).to.equal(hashResult.length);
    });

    it("Should emit a 'done' event", function () {
        expect(doneEvent).to.be.true;
    })
    it("Should return array of hashes", function () {
        expect(hashResult).to.be.an("array")
    })
    it("Should have the right number of hashes", function () {
        expect(hashResult.length).to.equal(lineCount);
    })
    it("Should match the hashes from the line event", function () {
        expect(hashLines).to.deep.equal(hashResult);
    })
})

describe("hash array of passwords, return json obj", function (done) {
    before(function (done) {
        reset(false, true);
        run(done);
    })

    it("Should emit a 'done' event", function () {
        expect(doneEvent).to.be.true;

    });

    it("Should return an object", function () {
        expect(hashResult).to.be.an("object");
    })

    it("Should contain valid hashes for each password",
        function () {
            for (hash in hashResult) {
                var match = bcrypt.compareSync(hashResult[hash], hash)
                expect(match).to.be.true;
            }
        })
});


describe("hash file of passwords, return json obj", function (done) {
    before(function (done) {
        reset(true, true);
        run(done);
    })

    it("Should emit a 'done' event", function () {
        expect(doneEvent).to.be.true;

    });

    it("Should return an object", function () {
        expect(hashResult).to.be.an("object");
    })

    it("Should contain valid hashes for each password",
        function () {
            for (hash in hashResult) {
                var match = bcrypt.compareSync(hashResult[hash], hash)
                expect(match).to.be.true;
            }
        })
});


function run(done) {
    passwdjs(arg, opts)
        .on('line', gotLine)
        .on('done', gotDone);

    function gotLine(line) {
        hashLines.push(line);
        lineCount++;
    }

    function gotDone(hashed) {
        doneEvent = true;
        hashResult = hashed;
        done();
    }

}


function reset(file, json) {
    lineEvent = false;
    doneEvent = false;
    hash = null;
    hashLines = [];
    hashResult = null;
    lineCount = 0;
    
    arg = [
        'passwd1',
        'passwd2',
        'passwd3',
        'passwd4'
    ];
    opts = {
        rounds: 10,
        plaintext: false,
        json: json
    }

    if (file) arg = 'test/test.txt';
}