var O = class extends EventTarget {
  dispatchEvent(i, e) {
    return super.dispatchEvent(i instanceof Event ? i : new CustomEvent(i, e));
  }
};
const M = {
  sender: "__PEER__",
  castType: "PEERTOSERVER",
  recipients: void 0
}, g = {
  sender: "__PEER__",
  castType: "BROADCAST",
  recipients: void 0
}, S = {
  sender: "__PEER__",
  recipients: void 0
};
function R(i = void 0) {
  return {
    type: "Ping",
    ...M,
    body: i
  };
}
function E(i) {
  return {
    type: "EnterRoom",
    ...M,
    ...i
  };
}
function y(i) {
  return {
    type: "UpdateRoomProfile",
    ...g,
    ...i
  };
}
function P(i) {
  return {
    type: "UpdatePeerProfile",
    ...g,
    ...i
  };
}
function j(i) {
  return {
    type: "DefineFunction",
    ...M,
    ...i
  };
}
function _(i) {
  return {
    type: "DefineObject",
    ...M,
    ...i
  };
}
function A(i, e) {
  return {
    type: "InvokeFunction",
    castType: i,
    ...S,
    ...e
  };
}
function D(i) {
  return {
    type: "UpdateObjectState",
    ...M,
    ...i
  };
}
function I(i, e) {
  return {
    type: "InvokeMethod",
    castType: i,
    ...S,
    ...e
  };
}
function u(i) {
  return (e, t, s) => {
    e[t].madoiMethodConfig_ = {
      ...e[t].madoiMethodConfig_ ? e[t].madoiMethodConfig_ : {},
      ...i
    };
  };
}
function C(i) {
  return (e) => {
    e.madoiClassConfig_ = { className: i };
  };
}
const m = {
  serialized: !0
};
function T(i = m) {
  return u({ distributed: i });
}
function $() {
  return u({ changeState: {} });
}
const w = {
  maxInterval: 5e3,
  minInterval: 3e3
};
function U(i = w) {
  return u({ getState: i });
}
function k() {
  return u({ setState: {} });
}
function F() {
  return u({ hostOnly: {} });
}
function L() {
  return u({ beforeEnterRoom: {} });
}
function N() {
  return u({ enterRoomAllowed: {} });
}
function x() {
  return u({ enterRoomDenied: {} });
}
function H() {
  return u({ leaveRoomDone: {} });
}
function J() {
  return u({ roomProfileUpdated: {} });
}
function z() {
  return u({ peerEntered: {} });
}
function B() {
  return u({ peerLeaved: {} });
}
function Q() {
  return u({ peerProfileUpdated: {} });
}
function q(i) {
  return u({ userMessageArrived: { type: i } });
}
class G extends O {
  connecting = !1;
  interimQueue;
  distributedFuncs = /* @__PURE__ */ new Map();
  shareObjects = /* @__PURE__ */ new Map();
  shareOrNotifyMethods = /* @__PURE__ */ new Map();
  // annotated methods
  getStateMethods = /* @__PURE__ */ new Map();
  setStateMethods = /* @__PURE__ */ new Map();
  // objectId -> @SetState method
  beforeEnterRoomMethods = /* @__PURE__ */ new Map();
  enterRoomAllowedMethods = /* @__PURE__ */ new Map();
  enterRoomDeniedMethods = /* @__PURE__ */ new Map();
  leaveRoomDoneMethods = /* @__PURE__ */ new Map();
  roomProfileUpdatedMethods = /* @__PURE__ */ new Map();
  peerEnteredMethods = /* @__PURE__ */ new Map();
  peerLeavedMethods = /* @__PURE__ */ new Map();
  peerProfileUpdatedMethods = /* @__PURE__ */ new Map();
  userMessageArrivedMethods = [];
  url;
  ws = null;
  room;
  selfPeer;
  otherPeers = /* @__PURE__ */ new Map();
  currentSenderId = null;
  constructor(e, t, ...s) {
    super(), this.selfPeer = {
      order: -1,
      ...s.length > 0 ? s[0] : { profile: {} }
    }, this.room = {
      id: "unknown",
      spec: { maxLog: 1e3 },
      ...s.length > 1 ? s[1] : { proeile: {} }
    }, this.interimQueue = new Array();
    const n = e.indexOf("?") != -1 ? "&" : "?";
    if (e.match(/^wss?:\/\//))
      this.url = `${e}${n}authToken=${t}`, this.room.id = e.split("rooms/")[1].split("?")[0];
    else {
      const o = document.querySelector("script[src$='madoi.js']").src.split("/", 5), c = (o[0] == "http:" ? "ws:" : "wss:") + "//" + o[2] + "/" + o[3];
      this.url = `${c}/rooms/${e}${n}authToken=${t}`, this.room.id = e;
    }
    this.ws = new WebSocket(this.url), this.ws.onopen = (o) => this.handleOnOpen(o), this.ws.onclose = (o) => this.handleOnClose(o), this.ws.onerror = (o) => this.handleOnError(o), this.ws.onmessage = (o) => this.handleOnMessage(o), setInterval(() => {
      this.saveStates();
    }, 1e3), setInterval(() => {
      this.sendPing();
    }, 3e4);
  }
  getRoom() {
    return this.room;
  }
  updateRoomProfile(e, t) {
    this.sendMessage(y(
      { updates: { [e]: t } }
    ));
  }
  removeRoomProfile(e) {
    this.sendMessage(y(
      { deletes: [e] }
    ));
  }
  getSelfPeer() {
    return this.selfPeer;
  }
  updateSelfPeerProfile(e, t) {
    this.selfPeer.profile[e] = t;
    const s = { [e]: t };
    this.sendMessage(P(
      { updates: s }
    ));
    const n = { updates: s, peerId: this.selfPeer.id };
    for (const [o, c] of this.peerProfileUpdatedMethods)
      c(n, this);
    this.dispatchEvent("peerProfileUpdated", { detail: n });
  }
  removeSelfPeerProfile(e) {
    delete this.selfPeer.profile[e], this.sendMessage(P(
      { deletes: [e] }
    ));
    const t = { deletes: [e], peerId: this.selfPeer.id };
    for (const [s, n] of this.peerProfileUpdatedMethods)
      n(t, this);
    this.dispatchEvent("peerProfileUpdated", { detail: t });
  }
  getOtherPeers() {
    return Array.from(this.otherPeers.values());
  }
  isMessageProcessing() {
    return this.currentSenderId !== null;
  }
  getCurrentSender() {
    return this.currentSenderId === null ? null : this.isCurrentSenderSelf() ? this.selfPeer : this.otherPeers.get(this.currentSenderId);
  }
  isCurrentSenderSelf() {
    return this.currentSenderId === this.selfPeer.id;
  }
  close() {
    this.ws?.close(), this.ws = null;
  }
  sendPing() {
    this.ws?.send(JSON.stringify(R()));
  }
  handleOnOpen(e) {
    console.info("Madoi websocket connection opened."), this.connecting = !0;
    for (const [t, s] of this.beforeEnterRoomMethods)
      s(this.selfPeer.profile, this);
    this.doSendMessage(E({ room: this.room, selfPeer: this.selfPeer }));
    for (let t of this.interimQueue)
      this.ws?.send(JSON.stringify(t));
    this.interimQueue = [];
  }
  handleOnClose(e) {
    console.info(`Madoi websocket connection closed because: ${e.reason}.`), this.connecting = !1, this.ws = null;
  }
  handleOnError(e) {
  }
  handleOnMessage(e) {
    const t = JSON.parse(e.data);
    this.currentSenderId = t.sender;
    try {
      this.data(t);
    } finally {
      this.currentSenderId = null;
    }
  }
  data(e) {
    if (e.type != "Pong") if (e.type === "EnterRoomAllowed") {
      const t = e;
      for (const [s, n] of this.enterRoomAllowedMethods)
        n(t, this);
      this.room = e.room, this.selfPeer.order = e.selfPeer.order;
      for (const s of t.otherPeers)
        this.otherPeers.set(s.id, s);
      if (this.dispatchEvent("enterRoomAllowed", { detail: t }), e.histories) for (const s of e.histories)
        this.data(s);
    } else if (e.type === "EnterRoomDenied") {
      const s = e;
      for (const [n, o] of this.enterRoomDeniedMethods)
        o(s, this);
      this.dispatchEvent("enterRoomDenied", { detail: s });
    } else if (e.type == "LeaveRoomDone") {
      for (const [t, s] of this.leaveRoomDoneMethods)
        s(this);
      this.dispatchEvent("leaveRoomDone");
    } else if (e.type === "UpdateRoomProfile") {
      if (e.updates && Object.assign(this.room.profile, e.updates), e.deletes) for (const s of e.deletes)
        delete this.room.profile[s];
      const t = {
        updates: e.updates,
        deletes: e.deletes
      };
      for (const [s, n] of this.roomProfileUpdatedMethods)
        n(t, this);
      this.dispatchEvent("roomProfileUpdated", { detail: t });
    } else if (e.type === "PeerEntered") {
      const t = e;
      this.otherPeers.set(e.peer.id, e.peer);
      for (const [s, n] of this.peerEnteredMethods)
        n(t, this);
      this.dispatchEvent("peerEntered", { detail: t });
    } else if (e.type === "PeerLeaved") {
      const t = e;
      this.otherPeers.delete(e.peerId);
      for (const [s, n] of this.peerLeavedMethods)
        n(t, this);
      this.dispatchEvent("peerLeaved", { detail: t });
    } else if (e.type === "UpdatePeerProfile") {
      const t = this.otherPeers.get(e.sender);
      if (e.sender && t) {
        if (e.updates && Object.assign(t.profile, e.updates), e.deletes) for (const n of e.deletes)
          delete t.profile[n];
        const s = { ...e, peerId: e.sender };
        for (const [n, o] of this.peerProfileUpdatedMethods)
          o(s, this);
        this.dispatchEvent("peerProfileUpdated", { detail: s });
      }
    } else if (e.type === "InvokeFunction") {
      const t = `${e.funcId}`, s = this.distributedFuncs.get(t);
      if (s === void 0) {
        console.warn("no suitable function for ", e);
        return;
      }
      const n = this.applyInvocation(s.original, e.args);
      n instanceof Promise && n.then(() => {
        s.resolve?.apply(null, arguments);
      }).catch(() => {
        s.reject?.apply(null, arguments);
      });
    } else if (e.type === "UpdateObjectState") {
      const t = this.setStateMethods.get(e.objId);
      t && t(e.state, e.objRevision);
      const s = this.shareObjects.get(e.objId);
      s && (s.revision = e.objRevision, s.update = 0);
    } else if (e.type === "InvokeMethod") {
      const t = this.shareObjects.get(e.objId);
      if (t === void 0) {
        console.error(`Object not found for id: ${e.objId}.`, e);
        return;
      }
      const s = `${e.objId}:${e.methodId}`, n = this.shareOrNotifyMethods.get(s);
      if (n === void 0) {
        console.error(`Method not found for id: ${s}.`, e);
        return;
      }
      n.config.distributed && (n.config.distributed.serialized && t.revision + 1 !== e.serverObjRevision && console.error(`Found inconsistency. serverObjRevision must be ${t.revision + 1} but ${e.serverObjRevision}.`, e), t.revision++, t.update++);
      const o = this.applyInvocation(n.original, e.args);
      o instanceof Promise && o.then(function() {
        n.resolve?.apply(null, arguments);
      }).catch(function() {
        n.reject?.apply(null, arguments);
      });
    } else if (e.type) {
      const t = e;
      for (const s of this.userMessageArrivedMethods)
        s.config.type === e.type && s.method(t, this);
      this.dispatchEvent(new CustomEvent(e.type, { detail: e }));
    } else
      console.warn("Unknown message type.", e);
  }
  systemMessageTypes = [
    "Ping",
    "Pong",
    "EnterRoom",
    "EnterRoomAllowed",
    "EnterRoomDenied",
    "LeaveRoom",
    "LeaveRoomDone",
    "UpdateRoomProfile",
    "PeerArrived",
    "PeerLeaved",
    "UpdatePeerProfile",
    "DefineFunction",
    "DefineObject",
    "InvokeFunction",
    "UpdateObjectState",
    "InvokeMethod"
  ];
  isSystemMessageType(e) {
    return e in this.systemMessageTypes;
  }
  send(e, t, s = "BROADCAST") {
    this.ws && this.sendMessage({
      type: e,
      sender: this.selfPeer.id,
      castType: s,
      recipients: void 0,
      content: t
    });
  }
  unicast(e, t, s) {
    this.sendMessage({
      type: e,
      sender: this.selfPeer.id,
      castType: "UNICAST",
      recipients: [s],
      content: t
    });
  }
  multicast(e, t, s) {
    this.sendMessage({
      type: e,
      sender: this.selfPeer.id,
      castType: "MULTICAST",
      recipients: s,
      content: t
    });
  }
  broadcast(e, t) {
    this.sendMessage({
      type: e,
      sender: this.selfPeer.id,
      castType: "BROADCAST",
      recipients: void 0,
      content: t
    });
  }
  othercast(e, t) {
    this.sendMessage({
      type: e,
      sender: this.selfPeer.id,
      castType: "OTHERCAST",
      recipients: void 0,
      content: t
    });
  }
  sendMessage(e) {
    if (this.isSystemMessageType(e.type))
      throw new Error("システムメッセージは送信できません。");
    this.doSendMessage(e);
  }
  addReceiver(e, t) {
    if (this.isSystemMessageType(e))
      throw new Error("システムメッセージのレシーバは登録できません。");
    this.addEventListener(e, t);
  }
  removeReceiver(e, t) {
    this.removeEventListener(e, t);
  }
  replacer(e, t) {
    return t instanceof Map ? Object.fromEntries(t) : t;
  }
  doSendMessage(e) {
    this.connecting ? this.ws?.send(JSON.stringify(e, this.replacer)) : this.interimQueue.push(e);
  }
  registerFunction(e, t = { distributed: m }) {
    if (t.hostOnly)
      return this.addHostOnlyFunction(e, t);
    if (t.distributed || t.changeState) {
      const s = e.name, n = this.distributedFuncs.size, o = this.createFunctionProxy(e, t, n), c = function() {
        return o.apply(null, arguments);
      };
      return this.doSendMessage(j({
        definition: { funcId: n, name: s, config: t }
      })), c;
    }
    return e;
  }
  register(e, t = []) {
    if (!this.ws) return e;
    const s = e;
    if (s.madoiObjectId_)
      return console.warn("Ignore object registration because it's already registered."), e;
    let n = s.constructor.name;
    s.__proto__.constructor.madoiClassConfig_ && (n = s.__proto__.constructor.madoiClassConfig_.className);
    const o = this.shareObjects.size, c = { instance: s, revision: 0, update: 0 };
    this.shareObjects.set(o, c), s.madoiObjectId_ = o;
    const a = new Array(), l = new Array(), p = /* @__PURE__ */ new Map();
    Object.getOwnPropertyNames(Object.getPrototypeOf(s)).forEach((f) => {
      const d = s[f];
      if (typeof d != "function" || !d.madoiMethodConfig_) return;
      const h = d.madoiMethodConfig_, r = a.length;
      p.set(f, r), a.push(d), l.push({ methodId: r, name: f, config: h }), console.debug(`add config ${n}.${f}=${JSON.stringify(h)} from decorator`);
    });
    for (const f of t) {
      const d = f.method, h = f, r = d.name, v = p.get(r);
      if (typeof v > "u") {
        h.distributed && (h.distributed = { ...m, ...h.distributed }), h.getState && (h.getState = { ...w, ...h.getState });
        const b = a.length;
        p.set(r, b), a.push(d), l.push({ methodId: b, name: f.method.name, config: h }), console.debug(`add config ${n}.${r}=${JSON.stringify(f)} from argument`);
      } else
        l[v].config = {
          ...l[v].config,
          ...f
        }, console.debug(`merge config ${n}.${r}=${JSON.stringify(f)} from argument`);
    }
    for (let f = 0; f < a.length; f++) {
      const d = a[f], h = l[f], r = h.config;
      r.distributed || r.changeState ? s[h.name] = this.createMethodProxy(
        d.bind(s),
        r,
        o,
        h.methodId
      ) : r.hostOnly ? s[h.name] = this.addHostOnlyFunction(
        d.bind(s),
        h.config,
        o
      ) : r.getState ? this.getStateMethods.set(o, {
        method: d.bind(s),
        config: r.getState,
        firstObjModified: -1,
        lastObjModified: -1
      }) : r.setState ? this.setStateMethods.set(o, d.bind(s)) : r.beforeEnterRoom ? this.beforeEnterRoomMethods.set(o, d.bind(s)) : r.enterRoomAllowed ? this.enterRoomAllowedMethods.set(o, d.bind(s)) : r.enterRoomDenied ? this.enterRoomDeniedMethods.set(o, d.bind(s)) : r.leaveRoomDone ? this.leaveRoomDoneMethods.set(o, d.bind(s)) : r.peerEntered ? this.peerEnteredMethods.set(o, d.bind(s)) : r.peerProfileUpdated ? this.peerProfileUpdatedMethods.set(o, d.bind(s)) : r.peerLeaved ? this.peerLeavedMethods.set(o, d.bind(s)) : r.userMessageArrived && this.userMessageArrivedMethods.push({
        method: d.bind(s),
        config: r.userMessageArrived
      });
    }
    return this.doSendMessage(_({
      definition: { objId: o, className: n, methods: l }
    })), e;
  }
  createFunctionProxy(e, t, s) {
    const n = `${s}`, o = { original: e, config: t };
    this.distributedFuncs.set(n, o), o.promise = new Promise((a, l) => {
      o.resolve = a, o.reject = l;
    });
    const c = this;
    return function() {
      if (c.ws === null) {
        if (e) return e.apply(null, arguments);
      } else {
        let a = null, l = "BROADCAST";
        return t.distributed && !t.distributed.serialized && (a = e.apply(null, arguments), l = "OTHERCAST"), c.sendMessage(A(
          l,
          { funcId: s, args: Array.from(arguments) }
        )), a ?? o.promise;
      }
    };
  }
  createMethodProxy(e, t, s, n) {
    const o = `${s}:${n}`, c = { original: e, config: t };
    this.shareOrNotifyMethods.set(o, c), c.promise = new Promise((l, p) => {
      c.resolve = l, c.reject = p;
    });
    const a = this;
    return function() {
      if (a.ws === null) {
        if (e) return e.apply(null, [...arguments, a]);
      } else {
        let l = null, p = "BROADCAST";
        const f = a.shareObjects.get(s), d = f.revision;
        return t.distributed && !t.distributed.serialized && (l = e.apply(null, [...arguments, a]), p = "OTHERCAST"), t.changeState && (f.revision++, f.update++), a.sendMessage(I(
          p,
          {
            objId: s,
            objRevision: d,
            methodId: n,
            args: Array.from(arguments)
          }
        )), l ?? c.promise;
      }
    };
  }
  addHostOnlyFunction(e, t, s) {
    const n = this;
    return (function() {
      n.isSelfPeerHost() && (t.changeState && s !== void 0 && n.objectChanged(s), e.apply(null, [...arguments, n]));
    });
  }
  objectChanged(e) {
    const t = this.shareObjects.get(e);
    t.revision++, t.update++;
    const s = this.getStateMethods.get(e);
    if (!s) return;
    const n = performance.now();
    s.firstObjModified == -1 && (s.firstObjModified = n), s.lastObjModified = n;
  }
  saveStates() {
    if (!(!this.ws || !this.connecting) && this.isSelfPeerHost())
      for (let [e, t] of this.shareObjects) {
        if (t.update == 0) continue;
        const s = this.getStateMethods.get(e);
        if (!s) continue;
        const n = s.config, o = performance.now(), c = s.firstObjModified, a = s.lastObjModified;
        (o - a >= (n.minInterval || 0) || o - c >= (n.maxInterval || 0)) && (this.doSendMessage(D({
          objId: e,
          objRevision: t.revision,
          state: s.method(this)
        })), s.firstObjModified = -1, s.lastObjModified = -1, t.update = 0, console.debug(`state saved: ${e}`));
      }
  }
  applyInvocation(e, t) {
    return e.apply(null, t);
  }
  isSelfPeerHost() {
    for (const e of this.otherPeers.values())
      if (e.order < this.selfPeer.order) return !1;
    return !0;
  }
}
export {
  L as BeforeEnterRoom,
  $ as ChangeState,
  C as ClassName,
  T as Distributed,
  N as EnterRoomAllowed,
  x as EnterRoomDenied,
  U as GetState,
  F as HostOnly,
  H as LeaveRoomDone,
  G as Madoi,
  z as PeerEntered,
  B as PeerLeaved,
  Q as PeerProfileUpdated,
  J as RoomProfileUpdated,
  k as SetState,
  q as UserMessageArrived
};
