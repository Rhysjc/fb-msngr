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
});