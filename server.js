var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    decode = require('salesforce-signed-request');

var app = express();

app.use(bodyParser());          // pull information from html in POST

app.get('/', function (req, res) {
    res.render('index.jade', {name: 'Christophe Coenraets'});
});

app.post('/signedrequest', function(req, res) {

    var signedRequest = req.body.signed_request,
        appSecret = process.env.APP_SECRET;

    var sfContext = decode(signedRequest, appSecret);

    var oauthToken = sfContext.client.oauthToken;
    var instanceUrl = sfContext.client.instanceUrl;

    console.log(oauthToken);
    console.log(instanceUrl);


    var q = "SELECT Id, Name FROM Contact LIMIT 10";
    var r = {
        url: instanceUrl + '/services/data/v29.0/query?q=' + q,
        headers: {
            'Authorization': 'OAuth ' + oauthToken
        }
    };

    console.log(JSON.stringify(r));

    request(r, function(err, response, body) {
        console.log('data');
        console.log('err: ' + err);
        console.log('response: ' + response);
        console.log('body: ' + body);
        res.render('index.jade', {contacts: body.records});
    });

});

//function processSignedRequest(req, res) {
//    var shipment = new Shipment();
//    try {
//        var json = shipment.processSignedRequest(req.body.signed_request, config.APP_SECRET);
//        res.render("index", json);
//    } catch (e) {
//        res.render("error", {
//            "error": errors.SIGNED_REQUEST_PARSING_ERROR
//        });
//    }
//}

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});