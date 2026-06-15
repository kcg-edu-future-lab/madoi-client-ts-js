var E = Object.defineProperty;
var j = (i, l, e) => l in i ? E(i, l, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[l] = e;
var a = (i, l, e) => j(i, typeof l != "symbol" ? l + "" : l, e);
class _ extends EventTarget {
  dispatchEvent(l, e) {
    return super.dispatchEvent(
      l instanceof Event ? l : new CustomEvent(l, e)
    );
  }
}
const v = {
  sender: "__PEER__",
  castType: "PEERTOSERVER",
  recipients: void 0
}, w = {
  sender: "__PEER__",
  castType: "BROADCAST",
  recipients: void 0
}, O = {
  sender: "__PEER__",
  recipients: void 0
};
function A(i = void 0) {
  return {
    type: "Ping",
    ...v,
    body: i
  };
}
function D(i) {
  return {
    type: "EnterRoom",
    ...v,
    ...i
  };
}
function L(i) {
  return {
    type: "LeaveRoom",
    ...v,
    ...i
  };
}
function P(i) {
  return {
    type: "UpdateRoomProfile",
    ...w,
    ...i
  };
}
function S(i) {
  return {
    type: "UpdatePeerProfile",
    ...w,
    ...i
  };
}
function I(i) {
  return {
    type: "DefineFunction",
    ...v,
    ...i
  };
}
function C(i) {
  return {
    type: "DefineObject",
    ...v,
    ...i
  };
}
function T(i, l) {
  return {
    type: "InvokeFunction",
    castType: i,
    ...O,
    ...l
  };
}
function $(i) {
  return {
    type: "UpdateObjectState",
    ...v,
    ...i
  };
}
function U(i, l) {
  return {
    type: "InvokeMethod",
    castType: i,
    ...O,
    ...l
  };
}
function M(i) {
  return (l, e) => {
    const t = l;
    return t.madoiMethodConfig_ = {
      ...t.madoiMethodConfig_ ? t.madoiMethodConfig_ : {},
      ...i
    }, l;
  };
}
function F(i) {
  return (l, e) => {
    l.madoiClassConfig_ = { className: i };
  };
}
const b = {
  serialized: !0
};
function x(i = b) {
  return M({ distributed: i });
}
function N() {
  return M({ changeState: {} });
}
const R = {
  maxInterval: 5e3,
  minInterval: 3e3
};
function H(i = R) {
  return M({ getState: i });
}
function J() {
  return M({ setState: {} });
}
function z() {
  return M({ hostOnly: {} });
}
function B() {
  return M({ beforeEnterRoom: {} });
}
function Q() {
  return M({ enterRoomAllowed: {} });
}
function q() {
  return M({ enterRoomDenied: {} });
}
function G() {
  return M({ leaveRoomDone: {} });
}
function V() {
  return M({ roomProfileUpdated: {} });
}
function W() {
  return M({ peerEntered: {} });
}
function K() {
  return M({ peerLeaved: {} });
}
function X() {
  return M({ peerProfileUpdated: {} });
}
function Y(i) {
  return M({ userMessageArrived: { type: i } });
}
class Z extends _ {
  constructor(e, t, s, n) {
    super();
    a(this, "connecting", !1);
    a(this, "interimQueue");
    a(this, "distributedFuncs", /* @__PURE__ */ new Map());
    a(this, "shareObjects", /* @__PURE__ */ new Map());
    a(this, "shareOrNotifyMethods", /* @__PURE__ */ new Map());
    // annotated methods
    a(this, "getStateMethods", /* @__PURE__ */ new Map());
    a(this, "setStateMethods", /* @__PURE__ */ new Map());
    // objectId -> @SetState method
    a(this, "beforeEnterRoomMethods", /* @__PURE__ */ new Map());
    a(this, "enterRoomAllowedMethods", /* @__PURE__ */ new Map());
    a(this, "enterRoomDeniedMethods", /* @__PURE__ */ new Map());
    a(this, "leaveRoomDoneMethods", /* @__PURE__ */ new Map());
    a(this, "roomProfileUpdatedMethods", /* @__PURE__ */ new Map());
    a(this, "peerEnteredMethods", /* @__PURE__ */ new Map());
    a(this, "peerLeavedMethods", /* @__PURE__ */ new Map());
    a(this, "peerProfileUpdatedMethods", /* @__PURE__ */ new Map());
    a(this, "userMessageArrivedMethods", []);
    a(this, "url");
    a(this, "ws", null);
    a(this, "room", { id: "", spec: { maxLog: 1e3 }, profile: {} });
    a(this, "selfPeer", { id: "", order: -1, profile: {} });
    a(this, "otherPeers", /* @__PURE__ */ new Map());
    a(this, "currentSenderId", null);
    a(this, "systemMessageTypes", [
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
    ]);
    n && (this.room = { ...this.room, ...n }), s && (this.selfPeer = { ...this.selfPeer, ...s, order: -1 }), this.interimQueue = new Array();
    const o = e.indexOf("?") != -1 ? "&" : "?";
    if (e.match(/^wss?:\/\//))
      this.url = `${e}${o}authToken=${t}`, this.room.id = e.split("rooms/")[1].split("?")[0];
    else {
      const r = document.querySelector("script[src$='madoi.js']").src.split("/", 5), f = (r[0] == "http:" ? "ws:" : "wss:") + "//" + r[2] + "/" + r[3];
      this.url = `${f}/rooms/${e}${o}authToken=${t}`, this.room.id = e;
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
    s[e] = t, this.sendMessage(P(
      { updates: s }
    ));
  }
  removeRoomProfile(e) {
    this.sendMessage(P(
      { deletes: [e] }
    ));
  }
  getSelfPeer() {
    return this.selfPeer;
  }
  updateSelfPeerProfile(e, t) {
    this.selfPeer.profile[e] = t;
    const s = {};
    s[e] = t, this.sendMessage(S(
      { updates: s }
    ));
    const n = { updates: s, peerId: this.selfPeer.id };
    for (const [o, r] of this.peerProfileUpdatedMethods)
      r(n, this);
    this.dispatchEvent("peerProfileUpdated", { detail: n });
  }
  removeSelfPeerProfile(e) {
    delete this.selfPeer.profile[e], this.sendMessage(S(
      { deletes: [e] }
    ));
    const t = { deletes: [e], peerId: this.selfPeer.id };
    for (const [s, n] of this.peerProfileUpdatedMethods)
      n(t, this);
    this.dispatchEvent("peerProfileUpdated", { detail: t });
  }
  getOtherPeers() {
    return this.otherPeers;
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
    var e;
    (e = this.ws) == null || e.close(), this.ws = null;
  }
  sendPing() {
    var e;
    (e = this.ws) == null || e.send(JSON.stringify(A()));
  }
  handleOnOpen(e) {
    var t;
    this.connecting = !0;
    for (const [s, n] of this.beforeEnterRoomMethods)
      n(this.selfPeer.profile, this);
    this.doSendMessage(D({ room: this.room, selfPeer: this.selfPeer }));
    for (let s of this.interimQueue)
      (t = this.ws) == null || t.send(JSON.stringify(s));
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
        var o;
        (o = s.resolve) == null || o.apply(null, arguments);
      }).catch(() => {
        var o;
        (o = s.reject) == null || o.apply(null, arguments);
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
        var r;
        (r = n.resolve) == null || r.apply(null, arguments);
      }).catch(function() {
        var r;
        (r = n.reject) == null || r.apply(null, arguments);
      });
    } else if (e.type) {
      const t = e;
      for (const s of this.userMessageArrivedMethods)
        s.config.type === e.type && s.method(t, this);
      this.dispatchEvent(new CustomEvent(e.type, { detail: e }));
    } else
      console.warn("Unknown message type.", e);
  }
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
    var t;
    this.connecting ? (t = this.ws) == null || t.send(JSON.stringify(e, this.replacer)) : this.interimQueue.push(e);
  }
  registerFunction(e, t = { distributed: b }) {
    if (t.hostOnly)
      return this.addHostOnlyFunction(e, t);
    if (t.distributed || t.changeState) {
      const s = e.name, n = this.distributedFuncs.size, o = this.createFunctionProxy(e, t, n), r = function() {
        return o.apply(null, arguments);
      };
      return this.doSendMessage(I({
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
    const f = new Array(), u = new Array(), m = /* @__PURE__ */ new Map();
    Object.getOwnPropertyNames(Object.getPrototypeOf(s)).forEach((h) => {
      const c = s[h];
      if (typeof c != "function" || !c.madoiMethodConfig_) return;
      const p = c.madoiMethodConfig_, d = f.length;
      m.set(h, d), f.push(c), u.push({ methodId: d, name: h, config: p }), console.debug(`add config ${n}.${h}=${JSON.stringify(p)} from decorator`);
    });
    for (const h of t) {
      const c = h.method, p = h, d = c.name, y = m.get(d);
      if (typeof y > "u") {
        p.distributed && (p.distributed = { ...b, ...p.distributed }), p.getState && (p.getState = { ...R, ...p.getState });
        const g = f.length;
        m.set(d, g), f.push(c), u.push({ methodId: g, name: h.method.name, config: p }), console.debug(`add config ${n}.${d}=${JSON.stringify(h)} from argument`);
      } else
        u[y].config = {
          ...u[y].config,
          ...h
        }, console.debug(`merge config ${n}.${d}=${JSON.stringify(h)} from argument`);
    }
    for (let h = 0; h < f.length; h++) {
      const c = f[h], p = u[h], d = p.config;
      d.distributed || d.changeState ? s[p.name] = this.createMethodProxy(
        c.bind(s),
        d,
        o,
        p.methodId
      ) : d.hostOnly ? s[p.name] = this.addHostOnlyFunction(
        c.bind(s),
        p.config,
        o
      ) : d.getState ? this.getStateMethods.set(o, {
        method: c.bind(s),
        config: d.getState,
        firstObjModified: -1,
        lastObjModified: -1
      }) : d.setState ? this.setStateMethods.set(o, c.bind(s)) : d.beforeEnterRoom ? this.beforeEnterRoomMethods.set(o, c.bind(s)) : d.enterRoomAllowed ? this.enterRoomAllowedMethods.set(o, c.bind(s)) : d.enterRoomDenied ? this.enterRoomDeniedMethods.set(o, c.bind(s)) : d.leaveRoomDone ? this.leaveRoomDoneMethods.set(o, c.bind(s)) : d.peerEntered ? this.peerEnteredMethods.set(o, c.bind(s)) : d.peerProfileUpdated ? this.peerProfileUpdatedMethods.set(o, c.bind(s)) : d.peerLeaved ? this.peerLeavedMethods.set(o, c.bind(s)) : d.userMessageArrived && this.userMessageArrivedMethods.push({
        method: c.bind(s),
        config: d.userMessageArrived
      });
    }
    return this.doSendMessage(C({
      definition: { objId: o, className: n, methods: u }
    })), e;
  }
  createFunctionProxy(e, t, s) {
    const n = `${s}`, o = { original: e, config: t };
    this.distributedFuncs.set(n, o), o.promise = new Promise((f, u) => {
      o.resolve = f, o.reject = u;
    });
    const r = this;
    return function() {
      if (r.ws === null) {
        if (e) return e.apply(null, arguments);
      } else {
        let f = null, u = "BROADCAST";
        return t.distributed && !t.distributed.serialized && (f = e.apply(null, arguments), u = "OTHERCAST"), r.sendMessage(T(
          u,
          { funcId: s, args: Array.from(arguments) }
        )), f ?? o.promise;
      }
    };
  }
  createMethodProxy(e, t, s, n) {
    const o = `${s}:${n}`, r = { original: e, config: t };
    this.shareOrNotifyMethods.set(o, r), r.promise = new Promise((u, m) => {
      r.resolve = u, r.reject = m;
    });
    const f = this;
    return function() {
      if (f.ws === null) {
        if (e) return e.apply(null, [...arguments, f]);
      } else {
        let u = null, m = "BROADCAST";
        const h = f.shareObjects.get(s), c = h.revision;
        return t.distributed && !t.distributed.serialized && (u = e.apply(null, [...arguments, f]), m = "OTHERCAST"), t.changeState && (h.revision++, h.update++), f.sendMessage(U(
          m,
          {
            objId: s,
            objRevision: c,
            methodId: n,
            args: Array.from(arguments)
          }
        )), u ?? r.promise;
      }
    };
  }
  addHostOnlyFunction(e, t, s) {
    const n = this;
    return function() {
      n.isSelfPeerHost() && (t.changeState && s !== void 0 && n.objectChanged(s), e.apply(null, [...arguments, n]));
    };
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
        const n = s.config, o = performance.now(), r = s.firstObjModified, f = s.lastObjModified;
        (o - f >= (n.minInterval || 0) || o - r >= (n.maxInterval || 0)) && (this.doSendMessage($({
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
  B as BeforeEnterRoom,
  N as ChangeState,
  F as ClassName,
  x as Distributed,
  Q as EnterRoomAllowed,
  q as EnterRoomDenied,
  H as GetState,
  z as HostOnly,
  G as LeaveRoomDone,
  Z as Madoi,
  W as PeerEntered,
  K as PeerLeaved,
  X as PeerProfileUpdated,
  V as RoomProfileUpdated,
  J as SetState,
  Y as UserMessageArrived,
  I as newDefineFunction,
  C as newDefineObject,
  D as newEnterRoom,
  T as newInvokeFunction,
  U as newInvokeMethod,
  L as newLeaveRoom,
  A as newPing,
  $ as newUpdateObjectState,
  S as newUpdatePeerProfile,
  P as newUpdateRoomProfile
};
