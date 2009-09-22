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
		this.options.request = $merge(this.options.request, {
			url: url,
			onSuccess: function(){
				if(204 === this.request.status){
					this.fireEvent("onClose", arguments);
					this.reopen();
				} else{
					this.fireEvent("onPush", arguments);
					
				}
				if(this.options.keep_open){
					this.timer = this.reopen.delay(this.options.repeatDelay || 0, this);
				}
			}.bind(this),
			onFailure: function(){
				this.fireEvent("onFail", arguments);
			}.bind(this)
		});
		this.request = new Request(this.options.request);
		this.timer = false;
		this.waiting = false;
	},
	open_socket: function(){
		this.request.send();
		return this;
	}.protect(),
	reopen: function(){
		this.fireEvent("onReopen");
		this.open_socket();
		return this;
	}.protect(),
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