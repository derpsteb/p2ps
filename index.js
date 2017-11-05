"use strict";

let DHT = require("webtorrent-dht");
global.magnet = require("magnet-uri");
global.buffer = require("buffer").Buffer;
global.startUp = startUp;
startUp();
global.retrieve = retrieve;
global.save = save;
global.showConnectedIds = showConnectedIds;
global.testPing = testPing;
global.lookup = lookup;
global.showId = showId;

function startUp () {
	global.dht = DHT({
		nodes: [{
			host: "127.0.0.1",
			port: 16881
		}],
		simple_peer_opts: {
			config: {
				iceServers: []
			}
		}
	});
	//global.dht._onquery = customOnQuery;
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

function lookup (link) {
	let hash = this.magnet.decode(link).infoHash;
	this.dht.lookup(hash, (err, res) => {
		console.log("errors: " + err);
		if (res === null) {
			console.log("No Data found.");
		} else {
			console.log("Retrieved value: " + res.toString());
		}
	});
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
		console.log(dict[key]);
	}
}

function customOnQuery (query, peer) {
	let q = query.q.toString();
	global.dht._debug("received %s query from %s:%d", q, peer.address, peer.port);
	if (!query.a) return;

	switch (q) {
	case "ping":
		//return global.dht._rpc.response(peer, query, {id: global.dht._rpc.id});
		console.log("wtf");
		break;

	case "find_node":
		//return global.dht._onfindnode(query, peer);
		console.log("gimmemileftnut");
		break;

	case "get_peers":
		return global.dht._ongetpeers(query, peer);

	case "announce_peer":
		return global.dht._onannouncepeer(query, peer);

	case "get":
		return global.dht._onget(query, peer);

	case "put":
		return global.dht._onput(query, peer);

	case "custom":
		return
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