# fb-msngr
---
`fb-msngr` is a node module for building bots for Facebook's Messenger platform.

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
	verify_token: <verify_token>,
	page_id: <page_id>
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
###### `require('fb-msngr')(config)`
Upon including the module you must pass in a config object of the form below. `access_token` is your page access token and `verify_token` is the token you enter when you setup your webhook, both of these are created in the Facebook Developers console. `notification_type` is the type of notification your bot will create. This can be either `REGULAR`, `SILENT_PUSH` or `NO_PUSH`. Finally, `page_id` is the id of the page you're using for your bot.
```javascript
var fbMsngr = require('fb-msngr')({
	access_token: <access_token>,
	notification_type: <notification_type>,
	verify_token: <verify_token>,
	page_id: <page_id>
});
```

###### `fbMsngr.getProfile`
Get a users profile info. `id` is the user id. The callback function may return an `err`, otherwise `first_name` and `last_name` are the user's first and last names respectively. `profile_pic` is the URL of the profile picture.
```javascript
fbMsngr.getProfile(id, function(err, first_name, last_name, profile_pic) {
	//Do stuff
});
```

###### `fbMsngr.verify`
This is an express middleware used to verify your bot. Simply apply this middleware to the `GET` route on `/webhook`. You can pass a string to send to the client if verification fails. You can write your own verification route if you're not using express. All other methods are framework agnostic.
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

###### `fbMsngr.sendReceiptTemplateMessage`
Send a receipt template message. `id` is the user id to send to as in previous methods. `name` is the name of the user who the receipt is intended for. `ordernum` is a unique order number (a string) while `currency` is the currency (GBP, USD, etc...). `method` is the payment method, this can be a string such as `"Card"`. `timestamp` is an optional timestamp string, and `url` is the optional URL of the order. `elements` is an array of order elements, which can be built with `buildOrderElement`. `address` is an optional object, which is built through `buildAddress`. `summary` is a required order summary, built with `buildOrderSummary`. Finally, `adjustments` is an optional array of objects built with `buildAdjustment`, these include changes to the order such as sales. The `callback` is as below. Any optional elements can be passed in as `null`, `undefined` or an empty string/array/object.
```javascript
fbMsngr.sendButtonTemplateMessage(id, name, ordernum, currency, method, timestamp, url, elements, address, summary, adjustments, callback);
```

###### `callback`
All of the `send` functions above share the same callback structure. `err` is any errors that may have been thrown. `id` contains the id of the user the message was sent to, and `mid` the id of the message sent.
```javascript
function(err, id, mid);
```

###### `fbMsngr.buildBubble`
Builds a bubble object for use in `sendGenericTemplateMessage`. `title` is the bubble title, `url` is the URL that the bubble will link to, which is optional and can just be an empty string. `image_url` is the image sent along with the bubble, which is also optional. `subtitle` is the optional bubble subtitle. `buttons` is an array of buttons, that can be built with the below functions.
```javascript
fbMsngr.buildBubble(title, url, image, subtitle, buttons);
```

###### `fbMsngr.buildURLButton`
Builds a button that links out to a URL. `title` is the title and the `url` is the URL that will be linked out to.
```javascript
fbMsngr.buildURLButton(title, url);
```

###### `fbMsngr.buildPostbackButton`
Builds a button that sends a postback to your server. `title` is the title, while `payload` is the postback object that will be sent back to your server.
```javascript
fbMsngr.buildPostbackButton(title, payload);
```

###### `fbMsngr.buildOrderElement`
Builds a single order element. `title` is the elements title, while `subtitle` is optional. `quantity` and `price` are optional numbers, while `currency` is an optional string (GBP, USD, etc...). `image_url` is an optional URL of an image for this element. Optional variables can be empty strings, which will result in them being removed.
```javascript
fbMsngr.buildOrderElement(title, subtitle, quantity, price, currency, image);
```

###### `fbMsngr.buildAddress`
Builds an address object. `line1` is the first line of the address, while `line2` is an optional second line. `city` is the city string, `postal` is a string containing the postal code, while `state` and `country` are strings containing the address' state and country respectively. Any optional variables can be passed as empty strings.
```javascript
fbMsngr.buildAddress(line1, line2, city, postal, state, country);
```

###### `fbMsngr.buildSummary`
Builds the order's summary. All parameters are numbers, and all optional except `cost`, and to omit them just pass an empty string.
```javascript
fbMsngr.buildSummary(subtotal, shipping, tax, cost);
```

###### `fbMsngr.buildAdjustment`
Builds an order adjustment. This is a change to the standard order such as a sale or voucher code. `name` is the name of the adjustment, and `amount` is the amount as a number. To skip an optional parameter just pass an empty string.
```javascript
fbMsngr.buildAdjustment(name, amount);
```

###### `fbMsngr.setTextWelcomeMessage`
Sets your bots welcome message to a simple text message. The `text` parameter is the text, and the second parameter is a callback function which will hold an error if one has been thrown.
```javascript
fbMsngr.setTextWelcomeMessage(text, function(err) {
	
});
```

###### `fbMsngr.setGenericWelcomeMessage`
Sets the welcome message to a slightly more complex message. `bubbles` is an array of bubbles built with `buildBubble()`, while the second parameter is a callback identical to the one above.
```javascript
fbMsngr.setGenericWelcomeMessage(bubbles, function(err) {
	
});
```

#### To-do List
---
1. Switch over loops to use async