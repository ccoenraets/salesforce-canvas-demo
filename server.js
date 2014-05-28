var express = require('express');

var app = express();

app.get('/', function (req, res) {
    res.render('index.jade', {name: 'Christophe Coenraets'});
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});