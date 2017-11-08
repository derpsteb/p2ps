
const DHT = require("webtorrent-dht");
const buffer = require("buffer").Buffer;
const bencode = require("bencode");
const inherits = require("inherits");


function webtorrentDhtCustom(options) {
	DHT.call(this, options);
}

inherits(webtorrentDhtCustom, DHT);

webtorrentDhtCustom.prototype.nextOnRoute = function(target){
	//@param target String
	//Return next node on route to target or true if this is the target
	if(this.nodeId.toString("hex") === target){
		return false;
	} else {
		let targetBuffer = buffer.from(target);
		return this.nodes.closest(targetBuffer);
	}
};

webtorrentDhtCustom.prototype.testSend = function(targetId) {
	let nextTarget = this.nextOnRoute(targetId);
	if (!nextTarget) {
		console.log("Reached Target");
	} else {
		let nextPeer = this._rpc.socket.socket.get_id_mapping(nextTarget[0].id.toString("hex"));
		let msg = {y: "q", q: "custom", a: targetId};
		nextPeer.send(bencode.encode(msg));
	}
};

webtorrentDhtCustom.prototype._onquery = function(query, peer) {
	console.log("received query in DHT.customOnQuery: " + query.q);
	let q = query.q.toString();
	this._debug("received %s query from %s:%d", q, peer.address, peer.port);
	if (!query.a) return;

	switch (q) {
	case "ping":
		console.log("wtf");
		return this._rpc.response(peer, query, {id: this._rpc.id});

	case "find_node":
		console.log("gimmemileftnut");
		return this._onfindnode(query, peer);

	case "get_peers":
		console.log("getPeeeeeers:!!!");
		return this._ongetpeers(query, peer);

	case "announce_peer":
		return this._onannouncepeer(query, peer);

	case "get":
		return this._onget(query, peer);

	case "put":
		console.log("putttyyyyy");
		return this._onput(query, peer);

	case "peer_connection":
		console.log("dude, we can do this!");
		console.log(JSON.stringify(peer));
		break;

	case "custom": {
		console.log("I GOT THIS!");
		let targetId = buffer.from(query.a).toString();
		this.testSend(targetId);
		break;
	}
	}
};

module.exports = webtorrentDhtCustom;