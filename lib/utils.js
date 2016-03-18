var cheerio = require('cheerio'),
    request = require('request');

/**
 * Prepare array from Query Params after checking its array or String instance.
 * As query is coming inside address, so it will be in address variable.
 * @param queryParam (Array or String)
 * @returns Array of Objects
 */
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

/**
 * Get list of URL's and append protocol with them.
 * if protocol is already there, ignore it.
 * @param urls
 */
function appendProtocol(urls) {
    for (var i = 0; i < urls.length; i++) {
        if (urls[i].indexOf('https://') === -1 && urls[i].indexOf('http://') === -1) {
            urls[i] = 'http://' + urls[i];
        }
    }
}

/**
 * Get data string in array of objects format and build html unordered list out of it.
 * @param data [{ title: '', url: '' }]
 * @returns string
 */
function buildHtml(data) {
    var ret = '<html><title>List Items</title><ul>';
    for (var i = 0; i < data.length; i++) {
        ret += '<li><b>' + data[i].url + '</b> --> <span>' + data[i].title + '</span></li>';
    }
    return ret + '</ul></html>';
}

/**
 * Parse HTML and get titles array out of it. this is used to pass for further html buildup
 *
 * @param response came from server on request.
 * @param html DOM
 * @returns {{ title: '', url: '' }}
 */
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

/**
 * get list of URL's and call back and executes call back function when all requests are entertained.
 * @param urlList - array of strings.
 * @param cb - Call back function which takes list of titles as parameter.
 */
function requestAll(urlList, cb) {

    var titleList = [],
        counter = urlList.length;

    for (var i = 0; i < urlList.length; i++) {
        makeRequest(urlList[i], function (err, result) {
            if (!err) {
                // add results to title list
                titleList.push(result);

                // manage counter to get last
                counter -= 1;
                if (counter === 0) {
                    cb(null, titleList);
                }
            } else {
                cb(err);
            }
        });
    }
}

function makeRequest (url, cb) {
    request({
        uri: url
    }, function (error, response, body) {
        if (!error) {
            cb(null, getTitle(response, body));
        } else {
            cb(error);
        }
    });
}

// All Exports
exports.prepareUrl = prepareUrl;
exports.appendProtocol = appendProtocol;
exports.buildHtml = buildHtml;
exports.getTitle = getTitle;
exports.requestAll = requestAll;