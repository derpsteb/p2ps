"use strict";

(function () {
	let DHT;
	DHT = require("webtorrent-dht");
	global.dht = new DHT({
		nodes: [],
		simple_peer_opts: {
			config: {
				iceServers: []
			}
		}
	});
	global.dht.listen(16881, "127.0.0.1", function () {
		console.log("now listening");
		console.log(JSON.stringify(global.dht.toJSON()));
	});
	global.dht.on("error", function (err) {
		console.log(err);
	});
	global.dht.on("warning", function (war) {
		console.log(war);
	});
	global.dht.on("peer", (peer, infoHash, from) => {
		console.log("found potential peer " + peer.host + ":" + peer.port + " through " + from.address + ":" + from.port)
	});
}).call(this);