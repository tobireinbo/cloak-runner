import Peer from "peerjs";
import Component from "engine/ecs/Component";

class PeerSender {
  private _peer: Peer;
  constructor(id: string) {
    this._peer = new Peer();
    const connection = this._peer.connect(id);
  }
}
