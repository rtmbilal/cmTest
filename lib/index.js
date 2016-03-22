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
        utils.requestAll(addresses, function (err, titleList) {
            if (!err) {
                res.send(utils.buildHtml(titleList));
            } else {
                res.status(500);
                res.send(err);
            }
        });
    }
});

// 404 handle
app.get('*', function(req, res) {
    res.status(404).send('<h1>404 Not Found</h1>');
});

var server = app.listen(process.env.PORT || 3000);

module.exports = server;