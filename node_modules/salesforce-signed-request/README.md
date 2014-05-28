### A simple Salesforce Canvas signed-request decoder

<p align="center">
![image](https://raw.github.com/rajaraodv/salesforce-signed-request/master/signed-request.jpg)



### Usage
This library exports a single function to `decode` the signed request.

```javascript
 
 var decode = require('signed-request');
 
 //json will have Salesforce context
 var json = decode('YOUR_SIGNED_REQUEST', 'API_SECRET');
 
```


### Test
1. Install Mocha, expect, chai & should by running `npm install`
2. You may want to install Mocha globally by running `npm install -g mocha` 
2. Simply run `mocha` in the command line.


### License
MIT