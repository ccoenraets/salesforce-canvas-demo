var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    qrcode = require('qrcode-npm'),
    decode = require('salesforce-signed-request'),

    consumerSecret = process.env.CONSUMER_SECRET,

    app = express();

app.set('view engine', 'ejs');
app.use(bodyParser()); // pull information from html in POST
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    var text = 'hello';
    var qr = qrcode.qrcode(4, 'M');
    qr.addData(text);
    qr.make();
    var tag = qr.createImgTag(4);
    res.send(tag);
});

app.post('/signedrequest', function(req, res) {

    // You could save this information in the user session if needed
    var signedRequest = decode(req.body.signed_request, consumerSecret),
        context = signedRequest.context,
        oauthToken = signedRequest.client.oauthToken,
        instanceUrl = signedRequest.client.instanceUrl,

        query = "SELECT Id, Name, Address, Phone FROM Contact WHERE Id = " + context.environment.Id,

        contactRequest = {
            url: instanceUrl + '/services/data/v29.0/query?q=' + query,
            headers: {
                'Authorization': 'OAuth ' + oauthToken
            }
        };



    request(contactRequest, function(err, response, body) {
        console.log('response:');
        console.log(response);
        console.log('body:');
        console.log(body);
        var text = 'Hello World';
        var qr = qrcode.qrcode(4, 'M');
        qr.addData(text);
        qr.make();
        var tag = qr.createImgTag(4);
        res.render('index', {context: context, tag: tag});
    });

});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});