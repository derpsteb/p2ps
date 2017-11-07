"use strict";

const webtorrentDht = require("./webtorrentDhtExtension");
global.magnet = require("magnet-uri");
global.buffer = require("buffer").Buffer;
global.bencode = require("bencode");
global.startUp = startUp;
startUp();
// global.retrieve = retrieve;
// global.save = save;
// global.showConnectedIds = showConnectedIds;
// global.lookup = lookup;
// global.showId = showId;
// global.nextOnRoute = nextOnRoute;
// global.testSend = testSend;

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
	global.dht = new webtorrentDht(options);
	localStorage.debug = "webtorrent-dht";
}

// function save (msgString) {
// 	let value = this.buffer.from(msgString);
// 	this.dht.put({v: value}, (err, hash) => {
// 		hash = hash.toString("hex");
// 		createLink(hash);
// 		console.log("Hash " + hash);
// 		console.log("Error " + err);
// 	});
// }
//
// function retrieve (link) {
// 	//let hash = this.magnet.decode(link).infoHash;
// 	this.dht.get(link, (err, res) => {
// 		console.log("errors: " + err);
// 		if (res === null) {
// 			console.log("No Data found.");
// 		} else {
// 			console.log("Retrieved value: " + this.buffer.from(res.v).toString());
// 		}
// 	});
// }
//
// function lookup (link) {
// 	//let hash = this.magnet.decode(link).infoHash;
// 	this.dht.on("peer", (peer, infoHash, from) => {
// 		console.log("found potential peer " + JSON.stringify(peer));
// 	});
// 	this.dht.announce(link, () => {
// 		this.dht.lookup(link, (err, res) => {
// 			console.log("errors: " + err);
// 			if (res === null) {
// 				console.log("No Data found.");
// 			} else {
// 				console.log("Retrieved value: " + res.toString());
// 			}
// 		});
// 	});
// }
//
// function createLink (hash) {
// 	let uri = global.magnet.encode({
// 		infoHash: [hash]
// 	});
// 	let list = global.document.getElementById("magnets");
// 	let entry = global.document.createElement("li");
// 	entry.appendChild(global.document.createTextNode(uri));
// 	list.appendChild(entry);
// }
//
// function showConnectedIds () {
// 	let dict = global.dht._rpc.socket.socket.peer_connections;
// 	for (var key in dict) {
// 		console.log(dict[key]["id"]);
// 	}
// }
//
// function customOnQuery (query, peer) {
// 	console.log("received query in DHT.customOnQuery: " + query.q);
// 	let q = query.q.toString();
// 	global.dht._debug("received %s query from %s:%d", q, peer.address, peer.port);
// 	if (!query.a) return;
//
// 	switch (q) {
// 	case "ping":
// 		console.log("wtf");
// 		return global.dht._rpc.response(peer, query, {id: global.dht._rpc.id});
// 		//break;
//
// 	case "find_node":
// 		console.log("gimmemileftnut");
// 		return global.dht._onfindnode(query, peer);
// 		//break;
//
// 	case "get_peers":
// 		console.log("getPeeeeeers:!!!");
// 		return global.dht._ongetpeers(query, peer);
//
// 	case "announce_peer":
// 		return global.dht._onannouncepeer(query, peer);
//
// 	case "get":
// 		return global.dht._onget(query, peer);
//
// 	case "put":
// 		console.log("putttyyyyy");
// 		return global.dht._onput(query, peer);
//
// 	case "peer_connection":
// 		console.log("dude, we can do this!");
// 		console.log(JSON.stringify(peer));
// 		break;
//
// 	case "custom": {
// 		console.log("I GOT THIS!");
// 		let targetId = global.buffer.from(query.a).toString();
// 		testSend(targetId);
// 		break;
// 	}
// 	}
// }
//
// function showId(){
// 	console.log(global.buffer.from(global.dht.nodeId).toString('hex'));
// }