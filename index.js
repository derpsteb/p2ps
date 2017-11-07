"use strict";

let DHT = require("webtorrent-dht");
global.magnet = require("magnet-uri");
global.buffer = require("buffer").Buffer;
let inherits = require('inherits');
global.startUp = startUp;
startUp();
global.retrieve = retrieve;
global.save = save;
global.showConnectedIds = showConnectedIds;
global.testPing = testPing;
global.lookup = lookup;
global.showId = showId;
global.testAnnounce = testAnnounce;

function startUp () {
	let options = {
		nodes: [{
			host: "127.0.0.1",
			port: 16881
		}],
		simple_peer_opts: {
			config: {
				iceServers: []
			}
		}
	};
	global.dht = DHT.call(this, options);
	global.dht._onquery = customOnQuery;
	localStorage.debug = "webtorrent-dht";
}

function save (msgString) {
	let value = this.buffer.from(msgString);
	this.dht.put({v: value}, (err, hash) => {
		hash = hash.toString("hex");
		createLink(hash);
		console.log("Hash " + hash);
		console.log("Error " + err);
	});
}

function retrieve (link) {
	let hash = this.magnet.decode(link).infoHash;
	this.dht.get(hash, (err, res) => {
		console.log("errors: " + err);
		if (res === null) {
			console.log("No Data found.");
		} else {
			console.log("Retrieved value: " + this.buffer.from(res.v).toString());
		}
	});
}

function testAnnounce(hash){
	this.dht.announce(hash, (err) => {
		if(err !== null){
			console.log("Error: " + err);
		}else{
			console.log("testAnnounce successfully completed");
		}
	});
}

function lookup (link) {
	//let hash = this.magnet.decode(link).infoHash;
	this.dht.on("peer", (peer, infoHash, from) => {
		console.log("found potential peer " + peer.host + ":" + peer.port + " through " + from.address + ":" + from.port);
	});
	this.dht.lookup(link, (err, res) => {
		console.log("errors: " + err);
		if (res === null) {
			console.log("No Data found.");
		} else {
			console.log("Retrieved value: " + res.toString());
		}
	});
	this.dht.announce(link);
}

function createLink (hash) {
	let uri = global.magnet.encode({
		infoHash: [hash]
	});
	let list = global.document.getElementById("magnets");
	let entry = global.document.createElement("li");
	entry.appendChild(global.document.createTextNode(uri));
	list.appendChild(entry);
}

function showConnectedIds () {
	let dict = global.dht._rpc.socket.socket.peer_connections;
	for (var key in dict) {
		console.log(dict[key]["id"]);
	}
}

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

	case "custom":
		return null;
	}
}

function testPing(nodeId){
	this.dht._sendPing(nodeId, (idk, response) => {
		console.log(`Pong: ${JSON.stringify(response)}`);
	});
}

function showId(){
	console.log(global.buffer.from(global.dht.nodeId).toString('hex'));
}