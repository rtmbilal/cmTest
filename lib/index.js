var express = require('express'),
    utils = require('./utils');

var app = express();

// Handle request
app.get('/I/want/title', function (req, res) {

    if (!req.query.address) {
        res.send('<h1>No Titles Found</h1>')
    } else {
        // Get addresses array out of query params
        var addresses = utils.prepareUrl(req.query);

        // Append http:// with url string
        utils.appendProtocol(addresses);

        // iterate through address list and make request for each
        // parse html and get titles for each url
        // build html from generated array of objects
        // once completed, send response to callee with populated list
        utils.requestAll(addresses).then(function (titleList) {
            res.send(utils.buildHtml(titleList));
        }).catch(function(error) {
            res.status(500);
            res.send(error);
        });
    }
});

var server = app.listen(process.env.PORT || 3000);

module.exports = server;