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

#### Details
---
Below is a detailed explanation of each part of the module.

###### `module.verify`
This is an express middleware used to verify your bot. Simply apply this middleware to the `GET` route on `/webhook`. You can pass a string to send to the client if verification fails.
```javascript
app.get('/webook', fbMsngr.verify('Error message'));
```

###### `module.onAuth`
Set a function to handle authentication. The `id` parameter is the user id of the authenticated user. The `optin` parameter is your defined optin reference.
```javascript
fbMsngr.onAuth(function(id, optin) {
	//Do stuff...
});
```

###### `module.onTextReceived`
Set a function to handle text messages. The `id` parameter is the user id of the authenticated user. The `text` parameter is the sent text.
```javascript
fbMsngr.onTextReceived(function(id, text) {
	//Do stuff...
});
```

###### `module.onMediaReceived`
Set a function to handle media messages. The `id` parameter is the user id of the authenticated user. The `attachments` parameter is the sent attachment.
```javascript
fbMsngr.onMediaReceived(function(id, attachments) {
	//Do stuff...
});
```

###### `module.onPostback`
Set a function to handle postbacks. The `id` parameter is the user id of the authenticated user. The `postback` parameter is the postback object.
```javascript
fbMsngr.onPostback(function(id, postback) {
	//Do stuff...
});
```

###### `module.onDelivered`
Set a function to handle message delivery. The `id` parameter is the user id of the authenticated user. The `mid` parameter is the id of the message that was delivered.
```javascript
fbMsngr.onDelivered(function(id, mid) {
	//Do stuff...
});
```