"use strict";

(function () {
	let DHT = require("webtorrent-dht");
	global.buffer = require("buffer").Buffer;
	global.bencode = require("bencode");
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
	global.dht._onquery = customOnQuery;
}).call(this);

function customOnQuery (query, peer) {
	console.log("received query in DHT.customOnQuery: " + query.q);
	let q = query.q.toString();
	global.dht._debug("received %s query from %s:%d", q, peer.address, peer.port);
	if (!query.a) return;

	switch (q) {
	case "ping":
		console.log("wtf");
		return global.dht._rpc.response(peer, query, {id: global.dht._rpc.id});
	//break;

	case "find_node":
		console.log("gimmemileftnut");
		return global.dht._onfindnode(query, peer);
	//break;

	case "get_peers":
		console.log("getPeeeeeers:!!!");
		return global.dht._ongetpeers(query, peer);

	case "announce_peer":
		return global.dht._onannouncepeer(query, peer);

	case "get":
		return global.dht._onget(query, peer);

	case "put":
		console.log("putttyyyyy");
		return global.dht._onput(query, peer);

	case "peer_connection":
		console.log("dude, we can do this!");
		console.log(JSON.stringify(peer));
		break;

	case "custom": {
		console.log("I GOT THIS!");
		let targetId = global.buffer.from(query.a).toString();
		testSend(targetId);
		break;
	}
	}
}


function nextOnRoute(target){
	//@param target String
	//Return next node on route to target or true if this is the target
	if(global.dht.nodeId.toString("hex") === target){
		return false;
	} else {
		let targetBuffer = global.buffer.from(target);
		return global.dht.nodes.closest(targetBuffer);
	}
}

function testSend(targetId) {
	let nextTarget = nextOnRoute(targetId);
	if (!nextTarget) {
		console.log("Reached Target");
	} else {
		let nextPeer = global.dht._rpc.socket.socket.get_id_mapping(nextTarget[0].id.toString("hex"));
		let msg = {y: "q", q: "custom", a: targetId};
		nextPeer.send(global.bencode.encode(msg));
	}
}