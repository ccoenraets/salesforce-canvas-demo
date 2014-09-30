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

        query = "SELECT Id, FirstName, LastName, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry, Phone, MobilePhone FROM Contact WHERE Id = '" + context.environment.record.Id + "'",

        contactRequest = {
            url: instanceUrl + '/services/data/v29.0/query?q=' + query,
            headers: {
                'Authorization': 'OAuth ' + oauthToken
            }
        };

    request(contactRequest, function(err, response, body) {
        console.log('************** body********************************');
        console.log(body);
        var qr = qrcode.qrcode(4, 'M'),
            contact = JSON.parse(body).records[0];
//        var text = contact.LastName + ',' + contact.FirstName + ';ADR:' + contact.MailingStreet + ',,' + contact.MailingCity + ',ST' + contact.MailingPostalCode + ';TEL:' + contact.Phone + ';TEL:' + contact.MobilePhone + ';EMAIL:' + contact.Email + ';;';
        var text = contact.LastName + ',' + contact.FirstName + ';ADR:' + contact.MailingStreet + ',,' + contact.MailingCity + ',ST' + contact.MailingPostalCode + ';TEL:617-244-3672' + ';;';
        qr.addData(text);
        qr.make();
        var imgTag = qr.createImgTag(4);
        res.render('index', {context: context, imgTag: imgTag});
    });

});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});