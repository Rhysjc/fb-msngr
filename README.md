# fb-msngr
### A node module for building messenger bots
---
`fb-msngr` is a node module meant to be used in conjuction with express to build bots for Facebook's Messenger platform.

##### Example Usage
---
```javascript
//Load express
var express = require('express');
var app = express();

//We need body parser to read the message contents
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//Initiate fb-msngr with the required info
var fbMsngr = require('fb-msngr')({
	access_token: <access_token>,
	notification_type: <notification_type>,
	verify_token: <verify_token>
});

//Handle the receipt of text messages
fbMsngr.onTextReceived(function(uid, text) {
	console.log(text);
});

//Handle verification with the build in middleware
app.get('/webhook', fbMsngr.verify('Failed to verify'));

//Handle the received message
app.post('/webook/', function(req, res) {
	fbMsngr.handle(req.body);
	res.sendStatus(200);
});

//Run our app
app.listen(<port>, function() {
	console.log('Bot running');
});
```
