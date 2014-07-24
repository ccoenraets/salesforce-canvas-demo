var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    decode = require('salesforce-signed-request');

var app = express();

app.use(bodyParser()); // pull information from html in POST

app.post('/signedrequest', function(req, res) {

    console.log('/signedrequest');

    var signedRequest = req.body.signed_request,
        appSecret = process.env.APP_SECRET,
        sfContext = decode(signedRequest, appSecret),
        oauthToken = sfContext.client.oauthToken,
        instanceUrl = sfContext.client.instanceUrl,

        query = "SELECT Id, Name FROM Contact LIMIT 10",

        contactRequest = {
            url: instanceUrl + '/services/data/v29.0/query?q=' + query,
            headers: {
                'Authorization': 'OAuth ' + oauthToken
            }
        };

    request(contactRequest, function(err, response, body) {
        res.render('index.jade', {contacts: JSON.parse(body).records});
    });

});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});