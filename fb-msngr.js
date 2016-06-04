var request = require('request');

module.exports = function(config) {
	var module = {};

	//Helper functions
	function buildRequest(recipient, message) {
		var request = {
		    url: 'https://graph.facebook.com/v2.6/me/messages',
		    qs: {access_token:config.access_token},
		    method: 'POST',
		    json: {
		    	recipient: {id:recipient},
		    	message: message,
		    	notification_type: config.notification_type
		    }
		};


		return request;
	}

	function sendMessage(recipient, message, cb) {
		var requestBody = buildRequest(recipient, message);
		request(requestBody, function(err, resp, body) {
			if(resp.statusCode == 200 && body.recipient_id) {
				//Message delivered
				if(cb) {
					cb(undefined, body.recipient_id, body.message_id);
				}
			} else if (resp.statusCode == 200 && body.error) {
				if(cb) {
					cb(body.error.message);
				}
			} else if (resp.statusCode == 100) {
				//No user found
				if(cb) {
					cb("no_user");
				}
			} else if (resp.statusCode == 10) {
				//Permissions error
				if(cb) {
					cb("bad_permissions");
				}
			} else if (resp.statusCode == 2) {
				//Facebook server error
				if(cb) {
					cb("server_error");
				}
			} else {
				//Another type of error
				if(cb) {
					cb(err);
				}
			}
		});
	}

	function deleteEmptyProperties(object) {
		//TODO: Use async
		for(var i in object) {
			if(object[i] === "" || object[i] === null || object[i] === undefined || Object.keys(object).length === 0) {
				delete object[i];
			}
		}
	}

	//Send functions
	module.sendTextMessage = function(recipient, text, cb) {
		var message = {
			text:text
		};
		sendMessage(recipient, message, cb);
	};

	module.sendImageMessage = function(recipient, url, cb) {
		var message = {
			attachment: {
				type: 'image',
				payload: {
					url: url
				}
			}
		};
		sendMessage(recipient, message, cb);
	};

	module.sendGenericTemplateMessage = function(recipient, bubbles, cb) {
		var message = {
			attachment: {
				type: 'template',
				payload: {
					template_type: 'generic',
					elements: bubbles
				}
			}
		};
		sendMessage(recipient, message, cb);
	};

	module.sendButtonTemplateMessage = function(recipient, text, buttons, cb) {
		var message = {
			attachment: {
				type: 'template',
				payload: {
					template_type: 'button',
					text: text,
					buttons: buttons
				}
			}
		};

		if(text === "" || text === null || text === undefined ) {
			delete message.payload.text;
		}

		sendMessage(recipient, message, cb);
	};

	module.sendReceiptTemplateMessage = function(recipient, name, ordernum, currency, method, timestamp, url, elements, address, summary, adjustments, cb) {
		var message = {
			attachment: {
				type: 'template',
				payload: {
					template_type: 'receipt',
					recipient_name: name,
					order_number: ordernum,
					currency: currency,
					payment_method: method,
					timestamp: timestamp,
					order_url: url,
					elements: elements,
					address: address,
					summary: summary,
					adjustments: adjustments
				}
			}
		};

		if(timestamp === "" || timestamp === null || timestamp === undefined ) {
			delete message.payload.timestamp;
		}
		if(url === "" || url === null || url === undefined ) {
			delete message.payload.order_url;
		}
		if(Object.keys(address).length === 0 || address === null || address === undefined ) {
			delete message.payload.address;
		}
		if(adjustments.length === 0 || adjustments === null || adjustments === undefined ) {
			delete message.payload.adjustments;
		}

		sendMessage(recipient, message, cb);

	};

	//Builder functions. Here we need to build bubbles and buttons. Stick to limits
	module.buildBubble = function(title, url, image, subtitle, buttons) {
		var bubble = {
			title: title,
			item_url: url,
			image_url: image,
			subtitle: subtitle,
			buttons: buttons
		};

		deleteEmptyProperties(bubble);
		return bubble;
	};

	module.buildURLButton = function(title, url) {
		var button = {
			type: 'web_url',
			title: title,
			url: url
		};
		return button;
	};

	module.buildPostbackButton = function(title, payload) {
		var button = {
			type: 'postback',
			title: title,
			payload: payload
		};
		return button;
	};

	module.buildOrderElement = function(title, subtitle, quantity, price, currency, image) {
		var element = {
			title: title,
			subtitle: subtitle,
			quantity: quantity,
			price: price,
			currency: currency,
			image_url: image
		};

		deleteEmptyProperties(element);
		return element;
	};

	module.buildAddress = function(street1, street2, city, postal, state, country) {
		var address = {
			street_1: street1,
			street_2: street2,
			city: city,
			postal_code: postal,
			state: state,
			country: country
		};

		deleteEmptyProperties(address);

		return address;
	};

	module.buildOrderSummary = function(subtotal, shipping, tax, cost) {
		var summary = {
			subtotal: subtotal,
			shipping_cost: shipping,
			total_tax: tax,
			total_cost: cost
		};

		deleteEmptyProperties(summary);

		return summary;
	};

	module.buildAdjustment = function(name, amount) {
		var adjustment = {
			name: name,
			amount: amount
		};
		deleteEmptyProperties(adjustment);

		return adjustment;
	};

	module.getProfile = function(id, cb) {
		var requestBody = {
		    url: 'https://graph.facebook.com/v2.6/'+id,
		    qs: {
		    	fields:'first_name,last_name,profile_pic',
		    	access_token: config.access_token
		   	},
		    method: 'GET'
		};

		request(requestBody, function(err, resp, body) {
			var body = JSON.parse(body);
			if(!err && body.first_name) {
				//All good
				cb(undefined, body.first_name, body.last_name, body.profile_pic);
			} else if(!err && !body.first_name) {
				//No error but didn't get what we wanted
				cb("data_not_returned");
			} else {
				//Error
				cb(err);
			}
		});
	};

	//Our webook callbacks
	var onAuth, onTextReceived, onMediaReceived, onPostback, onDelivered;
	//Methods for setting the callback
	module.onAuth = function(fn) {
		onAuth = fn;
	};
	module.onTextReceived = function(fn) {
		onTextReceived = fn;
	};
	module.onMediaReceived = function(fn) {
		onMediaReceived = fn;
	};
	module.onPostback = function(fn) {
		onPostback = fn;
	};
	module.onDelivered = function(fn) {
		onDelivered = fn;
	};

	//Our message handler. Just picks out the type of message and then passes it to the correct handler
	//TODO: Modify this to loop through all messages
	module.handle = function(body) {
		//Look through our message and figure out what it is
		var messaging = body.entry[0].messaging[0];
		if('optin' in messaging) {
			//Auth
			onAuth(messaging.sender.id, messaging.optin.ref);
		} else if ('message' in messaging) {
			//Message
			var messageBody = messaging.message;
			if('text' in messageBody) {
				//Text message
				onTextReceived(messaging.sender.id, messageBody.text);
			} else if ('attachments' in messageBody) {
				//Media message
				onMediaReceived(messaging.sender.id, messageBody.attachments);
			}
		} else if ('postback' in messaging) {
			//Postback
			onPostback(messaging.sender.id, messaging.postback.payload);
		} else if ('delivery' in messaging) {
			onDelivered(messaging.sender.id, messaging.delivery.mids[0]);
		}
	};

	function setWelcomeMessage(message, cb) {
		var data = {
			"setting_type":"call_to_actions",
			"thread_state":"new_thread",
			"call_to_actions":[
				{
			    	"message":message
			    }
			]
		};

		var requestBody = {
		    url: 'https://graph.facebook.com/v2.6/'+config.page_id+'/thread_settings',
		    qs: {access_token:config.access_token},
		    method: 'POST',
		    json: data
		};

		request(requestBody, function(err, resp, body) {
			if(!err && body.result == "Successfully added new_thread's CTAs") {
				//All good
				cb(undefined);
			} else if (!err && body.result != "Successfully added new_thread's CTAs") {
				cb("not_set");
			} else {
				cb(err);
			}
		});
	}

	//Set welcome message
	module.setTextWelcomeMessage = function(text, cb) {
		var message = {
			"text":text
		};

		setWelcomeMessage(message, function(err) {
			cb(err);
		});
	
	};

	module.setGenericWelcomeMessage = function(bubbles, cb) {
		var message = {
			"attachment": {
				"type": "template",
				"payload": {
					"template_type":"generic",
					"elements": bubbles
				}
			}
		};

		setWelcomeMessage(message, function(err) {
			cb(err);
		});
	};

	//Verify middleware
	module.verify = function(error) {
		return function(req, res, next) {
			if (req.query['hub.verify_token'] === config.verify_token) {
			    res.send(req.query['hub.challenge']);
			} else {
			  res.send(error);
			}
		};
	};

	return module;
};