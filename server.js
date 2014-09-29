var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    decode = require('salesforce-signed-request'),
    qr = require('qr-image'),

    consumerSecret = process.env.CONSUMER_SECRET,

    app = express();

app.set('view engine', 'ejs');
app.use(bodyParser()); // pull information from html in POST

console.log('*******');
console.log(consumerSecret);

app.get('/', function(req, res) {
    res.render('index', { title: 'The index page!' })
});

app.get('/qr', function(req, res) {
    var code = qr.image('tel:+16172443672', { type: 'svg' });
    res.type('svg');
    code.pipe(res);
});

app.post('/signedrequest', function(req, res) {

    console.log('*******');
    console.log('/signedrequest');

    var signedRequest = req.body.signed_request,
        sfContext = decode(signedRequest, consumerSecret),
        oauthToken = sfContext.client.oauthToken,
        instanceUrl = sfContext.client.instanceUrl,

        query = "SELECT Id, Name FROM Contact LIMIT 10",

        contactRequest = {
            url: instanceUrl + '/services/data/v29.0/query?q=' + query,
            headers: {
                'Authorization': 'OAuth ' + oauthToken
            }
        };

    console.log('#########');
    console.log(sfContext.context.environment.record);

    request(contactRequest, function(err, response, body) {
        res.render('index', sfContext.context);
    });

});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});