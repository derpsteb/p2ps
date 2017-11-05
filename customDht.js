"use strict";

(function(){
	let webtorrentDht = require("webtorrent-dht");
	//let inherits = require("inherits");
	function customDht(options){
		webtorrentDht.call(this, options);
	}
}).call(this);