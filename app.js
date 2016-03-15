var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    utils = require('./utils');

var app = express();

app.get('/I/want/title', function (req, res) {
    var addresses = utils.prepareUrl(req.query),
        contentList = [];

    utils.appendProtocol(addresses);

    request({
        uri: addresses[1],
    }, function (error, response, body) {
        var $ = cheerio.load(body);

        $('title').filter(function () {
            var data = $(this);
            contentList.push({
                'url': response.request.href,
                'title': data.html()
            });
        });

        res.send(utils.buildHtml(contentList));
    });

});

app.listen(process.env.PORT || 3000);
