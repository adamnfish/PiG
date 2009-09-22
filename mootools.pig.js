var PiG = new Class({
	Implements: [Options, Events],
	options: {
		// settings
		url: "",
		heartbeatTime: 20, // not used at the moment
		heartbeatAlgorithm: true, // update heartbeat time dynamically
		keep_open: true, // one off request or a request that should be kept open
		repeatDelay: 0, // wait this long before re-opening the connection
		
		// request options
		request: {
			noCache: true,
			link: "ignore"
		},
	
		// events
		onPush: $empty, // response recieved from server
		onClose: $empty, // connection closed by server
		onOpen: $empty, // connection with server opened
		onReopen: $empty, // connection with server reopened (no data)
		onAbort: $empty, // connection closed by client
		onFail: $empty // no response recieved from server / ajax call failed
	},
	
	Initialize: function(url, options){
		this.setOptions(options);
		options.request = $merge(options.request, {
			onSuccess: function(){
				if(204 === this.request.status){
					this.fireEvent("onClose", arguments);
					this.reopen();
				} else{
					this.fireEvent("onPush", arguments);
					this.reopen();
				}
			}.bind(this),
			onFailure: function(){
				this.fireEvent("onFail");
			}.bind(this)
		});
		this.request = new Request(options);
		this.timer = false;
		this.waiting = false;
	},
	
	open_socket: function(){
		this.request.send();
		return this;
	},
	reopen: function(){
		if(this.options.keep_open){
			this.timer = (function(){
				this.fireEvent("onReopen");
				this.open_socket();
			}).delay(this.options.repeatDelay || 0, this);
		}
		return this;
	},
	open: function(){
		if(!this.request.running){
			this.fireEvent("onOpen");
			this.open_socket();
		}
		return this;
	},
	close: function(){
		this.request.cancel();
		$clear(this.timer);
		this.fireEvent("onAbort");
	}
	
});