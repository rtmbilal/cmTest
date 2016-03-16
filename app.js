var express = require('express'),
    request = require('request'),
    utils = require('./utils');

var app = express();

app.get('/I/want/title', function (req, res) {

    // Get addresses array out of query params
    var addresses = utils.prepareUrl(req.query);

    // Append http:// with url string
    utils.appendProtocol(addresses);

    // iterate through address list and make request for each
    // parse html and get titles for each

    utils.requestAll(addresses, function (titleList) {
        res.send(utils.buildHtml(titleList));
    });

});

app.listen(process.env.PORT || 3000);
