'use strict';

var assert = require('assert');
var cheerio = require('cheerio');
var request = require('supertest');

describe('Make API Call to http://localhost:3000/I/want/title', function () {
    var server;
    beforeEach(function () {
        server = require('../lib/index');
    });
    afterEach(function () {
        server.close();
    });

    it('should return heading with no titles found and status 200', function (done) {
        request(server).get('/I/want/title').expect("Content-type", 'text/html; charset=utf-8').expect(200).end(function(err,res){
            // HTTP status should be 200
            assert.equal(res.status, 200);
            assert.equal(res.text, '<h1>No Titles Found</h1>');

            // Error key should be false.
            assert.equal(res.error, false);
            done();
        });
    });

    it('should return one title because only one url is passed to it as a string', function (done) {
        this.timeout(5000);
        request(server).get('/I/want/title?address=blog.andrewray.me/how-to-debug-mocha-tests-with-chrome').expect("Content-type", 'text/html; charset=utf-8').expect(200).end(function(err,res){
            // HTTP status should be 200
            assert.equal(res.status, 200);

            var $ = cheerio.load(res.text);

            assert.deepEqual($('li span').text(), 'How to Debug Mocha Tests With Chrome');
            assert.equal($('li span').length, 1);

            // Error key should be false.
            assert.equal(res.error, false);
            done();
        });
    });

    it('should return list of titles with urls parsed', function (done) {
        this.timeout(5000);
        request(server).get('/I/want/title?address=blog.andrewray.me/how-to-debug-mocha-tests-with-chrome&address=google.com').expect("Content-type", 'text/html; charset=utf-8').expect(200).end(function(err,res){
            // HTTP status should be 200
            assert.equal(res.status, 200);

            var $ = cheerio.load(res.text),
                titles = [];

            assert.equal($('li span').length, 2);
            $('li span').each(function(i, elem) {
                titles[i] = $(this).text();
            });

            assert.equal(titles[0], 'How to Debug Mocha Tests With Chrome');
            assert.equal(titles[1], 'Google');

            // Error key should be false.
            assert.equal(res.error, false);
            done();
        });
    });

    it('should return status 500 if wrong url is passed', function (done) {
        this.timeout(5000);
        request(server).get('/I/want/title?address=abc12').expect(500, done);
    });

    it('should return status 404 if any other url is accessed', function (done) {
        this.timeout(5000);
        request(server).get('/I/want/title/a').expect(404, done);
    });
});
