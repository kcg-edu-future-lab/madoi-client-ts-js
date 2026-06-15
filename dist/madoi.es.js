class O extends EventTarget {
  dispatchEvent(e, t) {
    return super.dispatchEvent(
      e instanceof Event ? e : new CustomEvent(e, t)
    );
  }
}
const M = {
  sender: "__PEER__",
  castType: "PEERTOSERVER",
  recipients: void 0
}, P = {
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
function C(i) {
  return {
    type: "LeaveRoom",
    ...M,
    ...i
  };
}
function b(i) {
  return {
    type: "UpdateRoomProfile",
    ...P,
    ...i
  };
}
function g(i) {
  return {
    type: "UpdatePeerProfile",
    ...P,
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
  return (e, t) => {
    const s = e;
    return s.madoiMethodConfig_ = {
      ...s.madoiMethodConfig_ ? s.madoiMethodConfig_ : {},
      ...i
    }, e;
  };
}
function T(i) {
  return (e, t) => {
    e.madoiClassConfig_ = { className: i };
  };
}
const v = {
  serialized: !0
};
function $(i = v) {
  return u({ distributed: i });
}
function U() {
  return u({ changeState: {} });
}
const w = {
  maxInterval: 5e3,
  minInterval: 3e3
};
function k(i = w) {
  return u({ getState: i });
}
function L() {
  return u({ setState: {} });
}
function F() {
  return u({ hostOnly: {} });
}
function x() {
  return u({ beforeEnterRoom: {} });
}
function N() {
  return u({ enterRoomAllowed: {} });
}
function H() {
  return u({ enterRoomDenied: {} });
}
function J() {
  return u({ leaveRoomDone: {} });
}
function z() {
  return u({ roomProfileUpdated: {} });
}
function B() {
  return u({ peerEntered: {} });
}
function Q() {
  return u({ peerLeaved: {} });
}
function q() {
  return u({ peerProfileUpdated: {} });
}
function G(i) {
  return u({ userMessageArrived: { type: i } });
}
class V extends O {
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
  room = { id: "", spec: { maxLog: 1e3 }, profile: {} };
  selfPeer = { id: "", order: -1, profile: {} };
  otherPeers = /* @__PURE__ */ new Map();
  currentSenderId = null;
  constructor(e, t, s, n) {
    super(), n && (this.room = { ...this.room, ...n }), s && (this.selfPeer = { ...this.selfPeer, ...s, order: -1 }), this.interimQueue = new Array();
    const o = e.indexOf("?") != -1 ? "&" : "?";
    if (e.match(/^wss?:\/\//))
      this.url = `${e}${o}authToken=${t}`, this.room.id = e.split("rooms/")[1].split("?")[0];
    else {
      const r = document.querySelector("script[src$='madoi.js']").src.split("/", 5), a = (r[0] == "http:" ? "ws:" : "wss:") + "//" + r[2] + "/" + r[3];
      this.url = `${a}/rooms/${e}${o}authToken=${t}`, this.room.id = e;
    }
    this.ws = new WebSocket(this.url), this.ws.onopen = (r) => this.handleOnOpen(r), this.ws.onclose = (r) => this.handleOnClose(r), this.ws.onerror = (r) => this.handleOnError(r), this.ws.onmessage = (r) => this.handleOnMessage(r), setInterval(() => {
      this.saveStates();
    }, 1e3), setInterval(() => {
      this.sendPing();
    }, 3e4);
  }
  getRoom() {
    return this.room;
  }
  updateRoomProfile(e, t) {
    const s = {};
    s[e] = t, this.sendMessage(b(
      { updates: s }
    ));
  }
  removeRoomProfile(e) {
    this.sendMessage(b(
      { deletes: [e] }
    ));
  }
  getSelfPeer() {
    return this.selfPeer;
  }
  updateSelfPeerProfile(e, t) {
    this.selfPeer.profile[e] = t;
    const s = {};
    s[e] = t, this.sendMessage(g(
      { updates: s }
    ));
    const n = { updates: s, peerId: this.selfPeer.id };
    for (const [o, r] of this.peerProfileUpdatedMethods)
      r(n, this);
    this.dispatchEvent("peerProfileUpdated", { detail: n });
  }
  removeSelfPeerProfile(e) {
    delete this.selfPeer.profile[e], this.sendMessage(g(
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
    this.connecting = !0;
    for (const [t, s] of this.beforeEnterRoomMethods)
      s(this.selfPeer.profile, this);
    this.doSendMessage(E({ room: this.room, selfPeer: this.selfPeer }));
    for (let t of this.interimQueue)
      this.ws?.send(JSON.stringify(t));
    this.interimQueue = [];
  }
  handleOnClose(e) {
    console.debug(`websocket closed because: ${e.reason}.`), this.connecting = !1, this.ws = null;
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
      const t = e;
      if (t.updates) for (const [n, o] of Object.entries(t.updates))
        this.room.profile[n] = o;
      if (t.deletes) for (const n of t.deletes)
        delete this.room.profile[n];
      const s = { updates: t.updates, deletes: t.deletes };
      for (const [n, o] of this.roomProfileUpdatedMethods)
        o(s, this);
      this.dispatchEvent("roomProfileUpdated", { detail: s });
    } else if (e.type === "PeerEntered") {
      const t = e;
      this.otherPeers.set(t.peer.id, t.peer);
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
        if (e.updates) for (const [n, o] of Object.entries(e.updates))
          t.profile[n] = o;
        if (e.deletes) for (const n of e.deletes)
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
  registerFunction(e, t = { distributed: v }) {
    if (t.hostOnly)
      return this.addHostOnlyFunction(e, t);
    if (t.distributed || t.changeState) {
      const s = e.name, n = this.distributedFuncs.size, o = this.createFunctionProxy(e, t, n), r = function() {
        return o.apply(null, arguments);
      };
      return this.doSendMessage(j({
        definition: { funcId: n, name: s, config: t }
      })), r;
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
    const o = this.shareObjects.size, r = { instance: s, revision: 0, update: 0 };
    this.shareObjects.set(o, r), s.madoiObjectId_ = o;
    const a = new Array(), l = new Array(), p = /* @__PURE__ */ new Map();
    Object.getOwnPropertyNames(Object.getPrototypeOf(s)).forEach((c) => {
      const f = s[c];
      if (typeof f != "function" || !f.madoiMethodConfig_) return;
      const h = f.madoiMethodConfig_, d = a.length;
      p.set(c, d), a.push(f), l.push({ methodId: d, name: c, config: h }), console.debug(`add config ${n}.${c}=${JSON.stringify(h)} from decorator`);
    });
    for (const c of t) {
      const f = c.method, h = c, d = f.name, m = p.get(d);
      if (typeof m > "u") {
        h.distributed && (h.distributed = { ...v, ...h.distributed }), h.getState && (h.getState = { ...w, ...h.getState });
        const y = a.length;
        p.set(d, y), a.push(f), l.push({ methodId: y, name: c.method.name, config: h }), console.debug(`add config ${n}.${d}=${JSON.stringify(c)} from argument`);
      } else
        l[m].config = {
          ...l[m].config,
          ...c
        }, console.debug(`merge config ${n}.${d}=${JSON.stringify(c)} from argument`);
    }
    for (let c = 0; c < a.length; c++) {
      const f = a[c], h = l[c], d = h.config;
      d.distributed || d.changeState ? s[h.name] = this.createMethodProxy(
        f.bind(s),
        d,
        o,
        h.methodId
      ) : d.hostOnly ? s[h.name] = this.addHostOnlyFunction(
        f.bind(s),
        h.config,
        o
      ) : d.getState ? this.getStateMethods.set(o, {
        method: f.bind(s),
        config: d.getState,
        firstObjModified: -1,
        lastObjModified: -1
      }) : d.setState ? this.setStateMethods.set(o, f.bind(s)) : d.beforeEnterRoom ? this.beforeEnterRoomMethods.set(o, f.bind(s)) : d.enterRoomAllowed ? this.enterRoomAllowedMethods.set(o, f.bind(s)) : d.enterRoomDenied ? this.enterRoomDeniedMethods.set(o, f.bind(s)) : d.leaveRoomDone ? this.leaveRoomDoneMethods.set(o, f.bind(s)) : d.peerEntered ? this.peerEnteredMethods.set(o, f.bind(s)) : d.peerProfileUpdated ? this.peerProfileUpdatedMethods.set(o, f.bind(s)) : d.peerLeaved ? this.peerLeavedMethods.set(o, f.bind(s)) : d.userMessageArrived && this.userMessageArrivedMethods.push({
        method: f.bind(s),
        config: d.userMessageArrived
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
    const r = this;
    return function() {
      if (r.ws === null) {
        if (e) return e.apply(null, arguments);
      } else {
        let a = null, l = "BROADCAST";
        return t.distributed && !t.distributed.serialized && (a = e.apply(null, arguments), l = "OTHERCAST"), r.sendMessage(A(
          l,
          { funcId: s, args: Array.from(arguments) }
        )), a ?? o.promise;
      }
    };
  }
  createMethodProxy(e, t, s, n) {
    const o = `${s}:${n}`, r = { original: e, config: t };
    this.shareOrNotifyMethods.set(o, r), r.promise = new Promise((l, p) => {
      r.resolve = l, r.reject = p;
    });
    const a = this;
    return function() {
      if (a.ws === null) {
        if (e) return e.apply(null, [...arguments, a]);
      } else {
        let l = null, p = "BROADCAST";
        const c = a.shareObjects.get(s), f = c.revision;
        return t.distributed && !t.distributed.serialized && (l = e.apply(null, [...arguments, a]), p = "OTHERCAST"), t.changeState && (c.revision++, c.update++), a.sendMessage(I(
          p,
          {
            objId: s,
            objRevision: f,
            methodId: n,
            args: Array.from(arguments)
          }
        )), l ?? r.promise;
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
        const n = s.config, o = performance.now(), r = s.firstObjModified, a = s.lastObjModified;
        (o - a >= (n.minInterval || 0) || o - r >= (n.maxInterval || 0)) && (this.doSendMessage(D({
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
  x as BeforeEnterRoom,
  U as ChangeState,
  T as ClassName,
  $ as Distributed,
  N as EnterRoomAllowed,
  H as EnterRoomDenied,
  k as GetState,
  F as HostOnly,
  J as LeaveRoomDone,
  V as Madoi,
  B as PeerEntered,
  Q as PeerLeaved,
  q as PeerProfileUpdated,
  z as RoomProfileUpdated,
  L as SetState,
  G as UserMessageArrived,
  j as newDefineFunction,
  _ as newDefineObject,
  E as newEnterRoom,
  A as newInvokeFunction,
  I as newInvokeMethod,
  C as newLeaveRoom,
  R as newPing,
  D as newUpdateObjectState,
  g as newUpdatePeerProfile,
  b as newUpdateRoomProfile
};
