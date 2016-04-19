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
app.get('/webhook/', fbMsngr.verify('Failed to verify'));

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

###### `fbMsngr.verify`
This is an express middleware used to verify your bot. Simply apply this middleware to the `GET` route on `/webhook`. You can pass a string to send to the client if verification fails.
```javascript
app.get('/webook/', fbMsngr.verify('Error message'));
```

###### `fbMsngr.onAuth`
Set a function to handle authentication. The `id` parameter is the user id of the authenticated user. The `optin` parameter is your defined optin reference.
```javascript
fbMsngr.onAuth(function(id, optin) {
	//Do stuff...
});
```

###### `fbMsngr.onTextReceived`
Set a function to handle text messages. The `id` parameter is the user id of the authenticated user. The `text` parameter is the sent text.
```javascript
fbMsngr.onTextReceived(function(id, text) {
	//Do stuff...
});
```

###### `fbMsngr.onMediaReceived`
Set a function to handle media messages. The `id` parameter is the user id of the authenticated user. The `attachments` parameter is the sent attachment.
```javascript
fbMsngr.onMediaReceived(function(id, attachments) {
	//Do stuff...
});
```

###### `fbMsngr.onPostback`
Set a function to handle postbacks. The `id` parameter is the user id of the authenticated user. The `postback` parameter is the postback object.
```javascript
fbMsngr.onPostback(function(id, postback) {
	//Do stuff...
});
```

###### `fbMsngr.onDelivered`
Set a function to handle message delivery. The `id` parameter is the user id of the authenticated user. The `mid` parameter is the id of the message that was delivered.
```javascript
fbMsngr.onDelivered(function(id, mid) {
	//Do stuff...
});
```

###### `fbMsngr.onDelivered`
Set a function to handle message delivery. The `id` parameter is the user id of the authenticated user. The `mid` parameter is the id of the message that was delivered.
```javascript
fbMsngr.onDelivered(function(id, mid) {
	//Do stuff...
});
```

###### `fbMsngr.sendTextMessage`
Send a text message. `id` is the user id to send to, and `text` is the text. The structure of the callback function is the same for all of the following `send` functions and is defined below.
```javascript
fbMsngr.sendTextMessage(id, text, callback);
```

###### `fbMsngr.sendImageMessage`
Send an image message. `id` is the user id to send to, and `url` is the media url.
```javascript
fbMsngr.sendImageMessage(id, url, callback);
```

###### `fbMsngr.sendGenericTemplateMessage`
Send a generic template message. `id` is the user id to send to, and `bubbles` is an array of the bubbles to send. The `buildBubble` function below shows how to build these.
```javascript
fbMsngr.sendGenericTemplateMessage(id, bubbles, callback);
```

###### `fbMsngr.sendButtonTemplateMessage`
Send a button template message. `id` is the user id to send to, and `buttons` is an array of the buttons to send. The `buildURLButton` and `buildPostbackButton` functions below shows how to build these.
```javascript
fbMsngr.sendButtonTemplateMessage(id, buttons, callback);
```

###### `callback`
All of the `send` functions above share the same callback structure. `err` is any errors that may have been thrown. `id` contains the id of the user the message was sent to, and `mid` the id of the message sent.
```javascript
function(err, id, mid);
```

###### `buildBubble`
Builds a bubble object for use in `sendGenericTemplateMessage`. `title` is the bubble title, `url` is the URL that the bubble will link to, which is optional and can just be an empty string. `image_url` is the image sent along with the bubble, which is also optional. `subtitle` is the optional bubble subtitle. `buttons` is an array of buttons, that can be built with the below functions.
```javascript
fbMsngr.buildBubble(title, url, image, subtitle, buttons);
```

###### `buildURLButton`
Builds a button that links out to a URL. `title` is the title and the `url` is the URL that will be linked out to.
```javascript
fbMsngr.buildURLButton(title, url);
```

###### `buildPostbackButton`
Builds a button that sends a postback to your server. `title` is the title, while `payload` is the postback object that will be sent back to your server.
```javascript
fbMsngr.buildPostbackButton(title, payload);
```

#### To-do List
---
1. Switch over loops to use async
2. Implement receipt messages