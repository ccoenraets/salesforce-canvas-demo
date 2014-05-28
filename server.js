var express = require('express');

var app = express();

app.get('/', function (req, res) {
    res.render('index.jade', {name: 'Christophe Coenraets'});
});

app.post('/signedrequest', function(req, res) {
    res.render('index.jade', {name: 'Christophe Coenraets'});
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