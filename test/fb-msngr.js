var config = require('./config');
var messages = require('./messages');
var fbMsngr = require('../fb-msngr')({
	access_token: config.access_token,
	verify_token: config.verify_token,
	notification_type: 'REGULAR'
});
var expect = require('chai').expect;

describe("fb-msngr", function() {
	describe("sendTextMessage()", function() {

		it('Should send a text message', function(done) {
			fbMsngr.sendTextMessage(config.uid, "Hello", function(err, uid, mid) {
				expect(uid).to.equal(config.uid);
				done();
			});
		});

	});

	describe("sendImageMessage()", function() {

		it('Should send an image message', function(done) {
			fbMsngr.sendImageMessage(config.uid, "http://media.mydogspace.com.s3.amazonaws.com/wp-content/uploads/2013/08/puppy-500x350.jpg", function(err, uid, mid) {
				expect(uid).to.equal(config.uid);
				done();
			});
		});

	});

	describe("sendGenericTemplateMessage()", function() {

		it('Should send an generic template message', function(done) {
			var bubbles = [];
			var buttonsOne = [];
			buttonsOne.push(fbMsngr.buildURLButton("One", "http://facebook.com"));
			buttonsOne.push(fbMsngr.buildPostbackButton("One", "POSTBACK"));

			var buttonsTwo = [];
			buttonsTwo.push(fbMsngr.buildURLButton("Two", "http://facebook.com"));
			buttonsTwo.push(fbMsngr.buildPostbackButton("Two", "POSTBACK"));

			bubbles.push(fbMsngr.buildBubble("First", "http://google.co.uk", "http://media.mydogspace.com.s3.amazonaws.com/wp-content/uploads/2013/08/puppy-500x350.jpg", "First Subtitle", buttonsOne));
			bubbles.push(fbMsngr.buildBubble("Second", "", "", "",buttonsTwo));

			fbMsngr.sendGenericTemplateMessage(config.uid, bubbles, function(err, uid, mid) {
				expect(uid).to.equal(config.uid);
				done();
			});
		});

	});

	describe("sendButtonTemplateMessage()", function() {

		it('Should send an button template message', function(done) {
			var buttons = [];

			buttons.push(fbMsngr.buildURLButton("One", "http://facebook.com"));
			buttons.push(fbMsngr.buildPostbackButton("Two", "POSTBACK"));

			fbMsngr.sendButtonTemplateMessage(config.uid, "Hello", buttons, function(err, uid, mid) {
				expect(uid).to.equal(config.uid);
				done();
			});
		});

	});

	describe("buildBubble()", function() {

		var buttonOne, buttonTwo, buttons, bubble;

		before(function() {
			buttonOne = fbMsngr.buildURLButton("One", "http://facebook.com");
			buttonTwo = fbMsngr.buildPostbackButton("Two", "POSTBACK");

			buttons = [buttonOne, buttonTwo];
		});

		it('Should build a bubble', function() {
			var bubble = fbMsngr.buildBubble("Title", "http://google.co.uk", "http://media.mydogspace.com.s3.amazonaws.com/wp-content/uploads/2013/08/puppy-500x350.jpg", "Subtitle", buttons);

			expect(bubble).to.have.property("title", "Title");
			expect(bubble).to.have.property("item_url", "http://google.co.uk");
			expect(bubble).to.have.property("image_url", "http://media.mydogspace.com.s3.amazonaws.com/wp-content/uploads/2013/08/puppy-500x350.jpg");
			expect(bubble).to.have.property("subtitle", "Subtitle");
			expect(bubble).to.have.property("buttons", buttons);
		});

		it('Should remove unused properties', function() {
			var bubble = fbMsngr.buildBubble("Title", "", "", "Subtitle", buttons);
			expect(bubble).to.have.property("title", "Title");
			expect(bubble).to.have.property("subtitle", "Subtitle");
			expect(bubble).to.have.property("buttons", buttons);
		});

	});

	describe("buildURLButton()", function() {

		it('Should build a URL button', function() {
			var button = fbMsngr.buildURLButton("One", "http://facebook.com");

			expect(button).to.have.property("title", "One");
			expect(button).to.have.property("type", "web_url");
			expect(button).to.have.property("url", "http://facebook.com");
		});

	});

	describe("buildPostbackButton()", function() {

		it('Should build a postback button', function() {
			var button = fbMsngr.buildPostbackButton("One", "POSTBACK");

			expect(button).to.have.property("title", "One");
			expect(button).to.have.property("type", "postback");
			expect(button).to.have.property("payload", "POSTBACK");
		});

	});

	describe("buildPostbackButton()", function() {

		it('Should build a postback button', function() {
			var button = fbMsngr.buildPostbackButton("One", "POSTBACK");

			expect(button).to.have.property("title", "One");
			expect(button).to.have.property("type", "postback");
			expect(button).to.have.property("payload", "POSTBACK");
		});

	});

	describe("getProfile()", function() {

		it('Should build a postback button', function(done) {
			fbMsngr.getProfile(config.uid, function(err, first, last, pic) {
				expect(first).to.equal(config.first_name);
				expect(last).to.equal(config.last_name);
				done();
			});
		});

	});

	describe("handle()", function() {

		describe("onAuth()", function() {

			it('Should be triggered', function(done) {
				fbMsngr.onAuth(function() {
					done();
				});
				fbMsngr.handle(messages.auth);
			});

			it('Should receive the correct parameters', function(done) {
				fbMsngr.onAuth(function(uid, optin) {
					expect(uid).to.equal(messages.user_id);
					expect(optin).to.equal("PASS_THROUGH_PARAM");
					done();
				});
				fbMsngr.handle(messages.auth);
			});

		});

		describe("onTextReceived()", function() {

			it('Should handle text messages', function(done) {
				fbMsngr.onTextReceived(function() {
					done();
				});
				fbMsngr.handle(messages.text);
			});

			it('Should receive the correct parameters', function(done) {
				fbMsngr.onTextReceived(function(uid, text) {
					expect(uid).to.equal(messages.user_id);
					expect(text).to.equal("hello, world!");
					done();
				});
				fbMsngr.handle(messages.text);
			});

		});

		describe("onMediaReceived()", function() {

			it('Should handle media messages', function(done) {
				fbMsngr.onMediaReceived(function() {
					done();
				});
				fbMsngr.handle(messages.media);
			});

			it('Should receive the correct parameters', function(done) {
				fbMsngr.onMediaReceived(function(uid, attachments) {
					expect(uid).to.equal(messages.user_id);
					expect(attachments).to.have.deep.property('[0].payload.url', 'IMAGE_URL');
					done();
				});
				fbMsngr.handle(messages.media);
			});

		});

		describe("onDelivered()", function() {

			it('Should handle message delivery', function(done) {
				fbMsngr.onDelivered(function() {
					done();
				});
				fbMsngr.handle(messages.delivered);
			});

			it('Should recieve the correct parameters', function(done) {
				fbMsngr.onDelivered(function(uid, mid) {
					expect(uid).to.equal(messages.user_id);
					expect(mid).to.equal("mid.1458668856218:ed81099e15d3f4f233");
					done();
				});
				fbMsngr.handle(messages.delivered);
			});

		});

		describe("onPostback()", function() {

			it('Should handle postbacks', function(done) {
				fbMsngr.onPostback(function() {
					done();
				});
				fbMsngr.handle(messages.postback);
			});

			it('Should receive the correct parameters', function(done) {
				fbMsngr.onPostback(function(uid, postback) {
					expect(uid).to.equal(messages.user_id);
					expect(postback).to.equal("USER_DEFINED_PAYLOAD");
					done();
				});
				fbMsngr.handle(messages.postback);
			});

		});

	});

});