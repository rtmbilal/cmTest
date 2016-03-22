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

        var titleList = [];

        for (var ret of utils.requestAll(addresses)) {
            ret.then(function (data) {
                titleList.push(data);

                ret.allResolved().then(function () {
                    res.send(utils.buildHtml(titleList))
                });
            }).catch(function (error) {
                res.status(500);
                res.send(error);
            });
        }
    }
});

// 404 handle
app.get('*', function(req, res) {
    res.status(404).send('<h1>404 Not Found</h1>');
});


var server = app.listen(process.env.PORT || 3000);

module.exports = server;