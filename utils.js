var cheerio = require('cheerio'),
    request = require('request');

function prepareUrl(queryParam) {
    var addressesArray = [];
    // Prepare Addresses array
    if (typeof (queryParam.address) === 'string') {
        addressesArray.push(queryParam.address);
    } else {
        addressesArray = addressesArray.concat(queryParam.address);
    }
    return addressesArray;
}

function appendProtocol(urls) {
    for (var i in urls) {
        urls[i] = 'http://' + urls[i]
    }
}

function buildHtml(data) {
    var ret = '<html> <title>List Items</title> <ul>';
    for (var i in data) {
        ret += '<li> <b>' + data[i].url + '</b> --> ' + data[i].title + '</li>';
    }
    return ret + '</ul></html>';
}

function getTitle(response, html) {
    var $ = cheerio.load(html),
        res = {};

    $('title').filter(function () {
        var data = $(this);
        res = {
            'url': response.request.href,
            'title': data.html()
        }
    });

    return res;
}

function requestAll(urlList, cb) {

    var titleList = [],
        counter = urlList.length;

    for (var i = 0; i < urlList.length; i++) {
        request({
            uri: urlList[i]
        }, function (error, response, body) {
            titleList.push(getTitle(response, body));
            counter -= 1;
            if (counter === 0) {
                cb(titleList);
            }
        });
    }
}

exports.prepareUrl = prepareUrl;
exports.appendProtocol = appendProtocol;
exports.buildHtml = buildHtml;
exports.getTitle = getTitle;
exports.requestAll = requestAll;