import Peer from "peerjs";
import Component from "engine/ecs/Component";

class PeerReceiver {
  private _peer: Peer;
  constructor() {
    this._peer = new Peer();
    this._peer.on("connection", (connection) => {
      connection.on("data", (data) => {
        console.log("received data", data);
      });
      connection.on("open", () => {
        console.log("connected!");
      });
    });
  }
}
