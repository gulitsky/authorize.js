describe('authorize.js', function() {
	'use strict';

	var a, a2;
	var success, error;

	var testParams = {
		test: 'test'
	};

	beforeEach(function() {
		jasmine.Ajax.install();
		a = new Authorize('test', 'test', true);
		success = jasmine.createSpy('success');
		error = jasmine.createSpy('error');
	});

	afterEach(function() {
		jasmine.Ajax.uninstall();
	});

	it('should be defined', function() {
		expect(Authorize).toBeDefined();
	});

	it('should have "test" defined', function() {
		expect(a.test).toBeDefined();
	});

	it('should have "createCustomerProfile" defined', function() {
		expect(a.createCustomerProfile).toBeDefined();
	});

	it('should make request to sandbox server', function() {
		a.test(testParams);
		expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://apitest.authorize.net/xml/v1/request.api');
		expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
	});

	it('should make request to production server', function() {
		a2 = new Authorize('test', 'test');
		a2.test(testParams);
		expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://api.authorize.net/xml/v1/request.api');
		expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
	});

	it('should call "success" callback', function() {
		var successResponse = {
			messages: {
				resultCode: 'Ok'
			}
		};

		a.test(testParams, success, error);
		expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://apitest.authorize.net/xml/v1/request.api');
		jasmine.Ajax.requests.mostRecent().respondWith({
			'status': 200,
			'contentType': 'application/json',
			'responseText': JSON.stringify(successResponse)
		});
		expect(success).toHaveBeenCalledWith(successResponse);
		expect(error).not.toHaveBeenCalled();
	});

	it('should call "error" callback', function() {
		var errorResponse = {
			messages: {
				resultCode: 'Error'
			}
		};

		a.test(testParams, success, error);
		jasmine.Ajax.requests.mostRecent().respondWith({
			'status': 200,
			'contentType': 'application/json',
			'responseText': JSON.stringify(errorResponse)
		});
		expect(error).toHaveBeenCalledWith(errorResponse);
		expect(success).not.toHaveBeenCalled();
	});
});
