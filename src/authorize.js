(function(window, document) {
	'use strict';

	// TODO Implement work with XML format
	var authorize = function(apiLoginId, transactionKey, sandbox) {
		var apiLoginId = apiLoginId,
			transactionKey = transactionKey,
			sandboxMode = false,
			url = 'https://api.authorize.net/xml/v1/request.api';

		// Helper function to concat objects
		var concat = function() {
			var o = {};
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (typeof arg !== 'object') {
					continue;
				}
				for (var p in arg) {
					if (arg.hasOwnProperty(p)) {
						o[p] = arg[p];
					}
				}
			}

			return o;
		};

		var constructPayload = function(method, params) {
			var payload = {};
			var root = method + 'Request';
			var ma = {
				merchantAuthentication: {
					name: apiLoginId,
					transactionKey: transactionKey
				}
			};
			var validationMode = sandboxMode ? 'testMode' : 'liveMode';
			var vm = {
				validationMode: validationMode
			};
			payload[root] = concat(ma, params, vm);

			return payload;
		};

		// Get cross-platform version of XMLHttpRequest
		var getXhr = function() {
			var xhr = null;
			var xhrFactories = [
				function() { return new XMLHttpRequest(); },
				function() { return new ActiveXObject("Microsoft.XMLHTTP"); }
			];

			for (var i = 0; i < xhrFactories.length; i++) {
				try {
					xhr = xhrFactories[i]();
				} catch(e) {
					continue;
				}
				break;
			}
			if (!xhr) {
				throw new Error("This browser does not support XMLHttpRequest");
			}

			// TODO Implement work with XML format
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			return xhr;
		};

		// This method is used only for testing purposes
		this.test = function(params, success, error) {
			var xhr = getXhr();
			var payload = constructPayload('test', params);
			xhr.onreadystatechange = function() {
				if (this.readyState == 4) {
					var json = JSON.parse(this.responseText);
					if (json.messages.resultCode != 'Error') {
						if (typeof success === 'function') {
							success(json);
						}
					} else {
						if (typeof error === 'function') {
							error(json);
						}
					}
				}
			};
			xhr.send(JSON.stringify(payload));
		};

		this.createCustomerProfile = function(params, success, error) {
			var xhr = getXhr();
			var payload = constructPayload('createCustomerProfile', params);
			xhr.onreadystatechange = function() {
				if (this.readyState == 4) {
					var json = JSON.parse(this.responseText);
					if (json.messages.resultCode != 'Error') {
						if (typeof success === 'function') {
							success(json);
						}
					} else {
						if (typeof error === 'function') {
							error(json);
						}
					}
				}
			};
			xhr.send(JSON.stringify(payload));
		};

		if (typeof sandbox !== 'undefined' && sandbox) {
			sandboxMode = true;
		}
		if (sandboxMode) {
			url = 'https://apitest.authorize.net/xml/v1/request.api';
		}
	};

	if (!window.Authorize) {
		window.Authorize = authorize;
	}
})(window, document);
