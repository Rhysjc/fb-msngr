var config = require('./config');
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

		it('Should build a bubble', function() {
			var buttonOne = fbMsngr.buildURLButton("One", "http://facebook.com");
			var buttonTwo = fbMsngr.buildPostbackButton("Two", "POSTBACK");

			var buttons = [buttonOne, buttonTwo];

			var bubble = fbMsngr.buildBubble("Title", "http://google.co.uk", "http://media.mydogspace.com.s3.amazonaws.com/wp-content/uploads/2013/08/puppy-500x350.jpg", "Subtitle", buttons);

			expect(bubble).to.have.property("title", "Title");
			expect(bubble).to.have.property("item_url", "http://google.co.uk");
			expect(bubble).to.have.property("image_url", "http://media.mydogspace.com.s3.amazonaws.com/wp-content/uploads/2013/08/puppy-500x350.jpg");
			expect(bubble).to.have.property("subtitle", "Subtitle");
			expect(bubble).to.have.property("buttons", buttons);

			bubble = fbMsngr.buildBubble("Title", "", "", "Subtitle", buttons);
			expect(bubble).to.have.property("title", "Title");
			expect(bubble).to.have.property("subtitle", "Subtitle");
			expect(bubble).to.have.property("buttons", buttons);
		});

	});

	describe("buildURLButton()", function() {

		it('Should build a URL button', function() {
			var button = fbMsngr.buildURLButton("One", "http://facebook.com");

			expect(button).to.property("title", "One");
			expect(button).to.property("type", "web_url");
			expect(button).to.property("url", "http://facebook.com");
		});

	});

	describe("buildPostbackButton()", function() {

		it('Should build a postback button', function() {
			var button = fbMsngr.buildPostbackButton("One", "POSTBACK");

			expect(button).to.property("title", "One");
			expect(button).to.property("type", "postback");
			expect(button).to.property("payload", "POSTBACK");
		});

	});

	describe("buildPostbackButton()", function() {

		it('Should build a postback button', function() {
			var button = fbMsngr.buildPostbackButton("One", "POSTBACK");

			expect(button).to.property("title", "One");
			expect(button).to.property("type", "postback");
			expect(button).to.property("payload", "POSTBACK");
		});

	});

	describe("getProfile()", function() {

		it('Should build a postback button', function(done) {
			fbMsngr.getProfile(config.uid, function(err, first, last, pic) {
				expect(first).to.equal("Rhys");
				expect(last).to.equal("Camm");
				done();
			});
		});

	});
});