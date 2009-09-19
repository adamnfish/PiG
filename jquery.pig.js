// jQuery plugin for AJAX push

(function($){
	var	empty = function(){},
		default_options = {
			// settings
			url: "",
			heartbeatTime: 20,
			heartbeatAlgorithm: true, // update heartbeat time dynamically
			keep_open: true, // one off request or a request that should be kept open
			repeatDelay: 0, // wait this long before re-opening the connection
		
			// ajax settings
			// provide settings as normal for the ajax function - but NOT the callbacks
			// http://docs.jquery.com/Ajax/jQuery.ajax#options
			success: empty,
			error: empty,
			type: "POST",
			cache: false,
		
			// events
			onPush: empty, // response recieved from server
			onClose: empty, // connection closed by server
			onOpen: empty, // connection with server opened
			onReopen: empty, // connection with server reopened (no data)
			onAbort: empty, // connection closed by client
			onFail: empty // no response recieved from server / ajax call failed
		};
	
	$.extend({
		PiG: function(options) {
			options = $.extend(default_options, options);
			var	successCallback = options.success,
				errorCallback = options.error,
				request = false,
				// public functions
				timer = false,
				open = function(){
					request = $.ajax(options);
					options.onOpen();
				},
				reopen = function(){
					if(options.keep_open){
						// re-open connection
						if(options.repeatDelay){
							setTimeout(function(){
								options.onReopen();
								open();
							}, options.repeatDelay);
						} else{
							options.onReopen();
							request = $.ajax(options);
						}
					}
				},
				close = function(immediate){
					if(immediate && request){
						request.abort();
					}
					clearTimeout(timer);
					options.onClose();
				},
				// the actual AJAX success callback
				success = function(response){
					if(204 == request.status){
						options.onClose();
						reopen();
					} else{
						successCallback(arguments);
						options.onPush(arguments);
						reopen();
					}
				},
				// the actual AJAX error callback
				error = function(){
					errorCallback.apply(this, arguments);
				};
			
			options.success = success;
			options.error = function(){
				error(arguments);
				options.onFail(arguments);
			};
			
			return {
				close: close,
				open: open
			};
		}
	})
})(jQuery);
