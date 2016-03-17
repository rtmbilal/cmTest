'use strict';

var assert = require('assert');
var utils = require('../lib/utils');

describe('Prepare URL array', function () {
    it("should return array as is if array of url strings is passed to the function", function() {
        var queryParam = { 'address': ['google.com', 'dawn.com']};
        assert.deepEqual(utils.prepareUrl(queryParam), ['google.com', 'dawn.com']);
    });

    it('should convert string to array if single url string is passed', function () {
        var queryParam = { 'address': 'google.com'};
        assert.deepEqual(utils.prepareUrl(queryParam), ['google.com']);
    });
});

describe('append protocol (http || https) to url', function () {
    it('should not append http again in case of url with http passed', function () {
        var urls = ['http://google.com'];
        utils.appendProtocol(urls);
        assert.deepEqual(urls, ['http://google.com']);
    });

    it('should append http if no protocol is already present', function () {
        var urls = ['google.com'];
        utils.appendProtocol(urls);
        assert.deepEqual(urls, ['http://google.com']);
    });
});