'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var cheerio = require('cheerio');

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

describe('build html', function () {
    it('should return html string with with li\'s appended with name and title if object with data is passed', function () {
        var htmlString = utils.buildHtml([{url: 'http://google.com', title: 'Google'}]);
        var $ = cheerio.load(htmlString);
        assert($('li b').text(), 'http://google.com');
    });
});

describe('get title against html', function () {
    it('should return object with title and url', function () {
        var title = utils.getTitle({request: {href: 'www.google.com'}}, '<html><title>Google</title></html>');
        assert.deepEqual(title, {
            'url': 'www.google.com',
            'title': 'Google'
        });
    });
});