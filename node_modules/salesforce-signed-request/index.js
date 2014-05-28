var base64url = require('base64url');
var crypto = require('crypto');

function decode(signed_request, secret) {
    if(!signed_request || !secret) {
        return new Error('Must pass both signed_request and api secret');
    }
    // decode the data
    try {
        encoded_data = signed_request.split('.', 2);
        sig = encoded_data[0];
        json = base64url.decode(encoded_data[1]);
        data = JSON.parse(json);
    } catch (e) {
        return new Error('Could not parse signed-request');
    }

    // check algorithm - not relevant to error
    if (!data.algorithm || data.algorithm.toUpperCase() != 'HMACSHA256') {
        return new Error('Unknown algorithm. Expected HMACSHA256');
    }

    expected_sig = crypto.createHmac('sha256', secret).update(encoded_data[1]).digest('base64');
    if (sig !== expected_sig) {
        return new Error('Bad signed JSON Signature!');
    }
    return data;
}

module.exports = exports = decode;