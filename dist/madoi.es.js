var E = Object.defineProperty;
var j = (i, f, e) => f in i ? E(i, f, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[f] = e;
var a = (i, f, e) => j(i, typeof f != "symbol" ? f + "" : f, e);
class _ extends EventTarget {
  dispatchEvent(f, e) {
    return super.dispatchEvent(
      f instanceof Event ? f : new CustomEvent(f, e)
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
function g(i) {
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
function T(i, f) {
  return {
    type: "InvokeFunction",
    castType: i,
    ...O,
    ...f
  };
}
function $(i) {
  return {
    type: "UpdateObjectState",
    ...v,
    ...i
  };
}
function U(i, f) {
  return {
    type: "InvokeMethod",
    castType: i,
    ...O,
    ...f
  };
}
function M(i) {
  return (f, e, t) => {
    f[e].madoiMethodConfig_ = {
      ...f[e].madoiMethodConfig_ ? f[e].madoiMethodConfig_ : {},
      ...i
    };
  };
}
function F(i) {
  return (f) => {
    f.madoiClassConfig_ = { className: i };
  };
}
const b = {
  serialized: !0
};
function N(i = b) {
  return M({ distributed: i });
}
function x() {
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
  constructor(e, t, s, o) {
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
    o && (this.room = { ...this.room, ...o }), s && (this.selfPeer = { ...this.selfPeer, ...s, order: -1 }), this.interimQueue = new Array();
    const n = e.indexOf("?") != -1 ? "&" : "?";
    if (e.match(/^wss?:\/\//))
      this.url = `${e}${n}authToken=${t}`, this.room.id = e.split("rooms/")[1].split("?")[0];
    else {
      const r = document.querySelector("script[src$='madoi.js']").src.split("/", 5), c = (r[0] == "http:" ? "ws:" : "wss:") + "//" + r[2] + "/" + r[3];
      this.url = `${c}/rooms/${e}${n}authToken=${t}`, this.room.id = e;
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
    s[e] = t, this.sendMessage(g(
      { updates: s }
    ));
  }
  removeRoomProfile(e) {
    this.sendMessage(g(
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
    const o = { updates: s, peerId: this.selfPeer.id };
    for (const [n, r] of this.peerProfileUpdatedMethods)
      r(o, this);
    this.dispatchEvent("peerProfileUpdated", { detail: o });
  }
  removeSelfPeerProfile(e) {
    delete this.selfPeer.profile[e], this.sendMessage(S(
      { deletes: [e] }
    ));
    const t = { deletes: [e], peerId: this.selfPeer.id };
    for (const [s, o] of this.peerProfileUpdatedMethods)
      o(t, this);
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
    for (const [s, o] of this.beforeEnterRoomMethods)
      o(this.selfPeer.profile, this);
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
      for (const [s, o] of this.enterRoomAllowedMethods)
        o(t, this);
      this.room = e.room, this.selfPeer.order = e.selfPeer.order;
      for (const s of t.otherPeers)
        this.otherPeers.set(s.id, s);
      if (this.dispatchEvent("enterRoomAllowed", { detail: t }), e.histories) for (const s of e.histories)
        this.data(s);
    } else if (e.type === "EnterRoomDenied") {
      const s = e;
      for (const [o, n] of this.enterRoomDeniedMethods)
        n(s, this);
      this.dispatchEvent("enterRoomDenied", { detail: s });
    } else if (e.type == "LeaveRoomDone") {
      for (const [t, s] of this.leaveRoomDoneMethods)
        s(this);
      this.dispatchEvent("leaveRoomDone");
    } else if (e.type === "UpdateRoomProfile") {
      const t = e;
      if (t.updates) for (const [o, n] of Object.entries(t.updates))
        this.room.profile[o] = n;
      if (t.deletes) for (const o of t.deletes)
        delete this.room.profile[o];
      const s = { updates: t.updates, deletes: t.deletes };
      for (const [o, n] of this.roomProfileUpdatedMethods)
        n(s, this);
      this.dispatchEvent("roomProfileUpdated", { detail: s });
    } else if (e.type === "PeerEntered") {
      const t = e;
      this.otherPeers.set(t.peer.id, t.peer);
      for (const [s, o] of this.peerEnteredMethods)
        o(t, this);
      this.dispatchEvent("peerEntered", { detail: t });
    } else if (e.type === "PeerLeaved") {
      const t = e;
      this.otherPeers.delete(e.peerId);
      for (const [s, o] of this.peerLeavedMethods)
        o(t, this);
      this.dispatchEvent("peerLeaved", { detail: t });
    } else if (e.type === "UpdatePeerProfile") {
      const t = this.otherPeers.get(e.sender);
      if (e.sender && t) {
        if (e.updates) for (const [o, n] of Object.entries(e.updates))
          t.profile[o] = n;
        if (e.deletes) for (const o of e.deletes)
          delete t.profile[o];
        const s = { ...e, peerId: e.sender };
        for (const [o, n] of this.peerProfileUpdatedMethods)
          n(s, this);
        this.dispatchEvent("peerProfileUpdated", { detail: s });
      }
    } else if (e.type === "InvokeFunction") {
      const t = `${e.funcId}`, s = this.distributedFuncs.get(t);
      if (s === void 0) {
        console.warn("no suitable function for ", e);
        return;
      }
      const o = this.applyInvocation(s.original, e.args);
      o instanceof Promise && o.then(() => {
        var n;
        (n = s.resolve) == null || n.apply(null, arguments);
      }).catch(() => {
        var n;
        (n = s.reject) == null || n.apply(null, arguments);
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
      const s = `${e.objId}:${e.methodId}`, o = this.shareOrNotifyMethods.get(s);
      if (o === void 0) {
        console.error(`Method not found for id: ${s}.`, e);
        return;
      }
      o.config.distributed && (o.config.distributed.serialized && t.revision + 1 !== e.serverObjRevision && console.error(`Found inconsistency. serverObjRevision must be ${t.revision + 1} but ${e.serverObjRevision}.`, e), t.revision++, t.update++);
      const n = this.applyInvocation(o.original, e.args);
      n instanceof Promise && n.then(function() {
        var r;
        (r = o.resolve) == null || r.apply(null, arguments);
      }).catch(function() {
        var r;
        (r = o.reject) == null || r.apply(null, arguments);
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
      const s = e.name, o = this.distributedFuncs.size, n = this.createFunctionProxy(e, t, o), r = function() {
        return n.apply(null, arguments);
      };
      return this.doSendMessage(I({
        definition: { funcId: o, name: s, config: t }
      })), r;
    }
    return e;
  }
  register(e, t = []) {
    if (!this.ws) return e;
    const s = e;
    if (s.madoiObjectId_)
      return console.warn("Ignore object registration because it's already registered."), e;
    let o = s.constructor.name;
    s.__proto__.constructor.madoiClassConfig_ && (o = s.__proto__.constructor.madoiClassConfig_.className);
    const n = this.shareObjects.size, r = { instance: s, revision: 0, update: 0 };
    this.shareObjects.set(n, r), s.madoiObjectId_ = n;
    const c = new Array(), u = new Array(), m = /* @__PURE__ */ new Map();
    Object.getOwnPropertyNames(Object.getPrototypeOf(s)).forEach((h) => {
      const l = s[h];
      if (typeof l != "function" || !l.madoiMethodConfig_) return;
      const p = l.madoiMethodConfig_, d = c.length;
      m.set(h, d), c.push(l), u.push({ methodId: d, name: h, config: p }), console.debug(`add config ${o}.${h}=${JSON.stringify(p)} from decorator`);
    });
    for (const h of t) {
      const l = h.method, p = h, d = l.name, y = m.get(d);
      if (typeof y > "u") {
        p.distributed && (p.distributed = { ...b, ...p.distributed }), p.getState && (p.getState = { ...R, ...p.getState });
        const P = c.length;
        m.set(d, P), c.push(l), u.push({ methodId: P, name: h.method.name, config: p }), console.debug(`add config ${o}.${d}=${JSON.stringify(h)} from argument`);
      } else
        u[y].config = {
          ...u[y].config,
          ...h
        }, console.debug(`merge config ${o}.${d}=${JSON.stringify(h)} from argument`);
    }
    for (let h = 0; h < c.length; h++) {
      const l = c[h], p = u[h], d = p.config;
      d.distributed || d.changeState ? s[p.name] = this.createMethodProxy(
        l.bind(s),
        d,
        n,
        p.methodId
      ) : d.hostOnly ? s[p.name] = this.addHostOnlyFunction(
        l.bind(s),
        p.config,
        n
      ) : d.getState ? this.getStateMethods.set(n, {
        method: l.bind(s),
        config: d.getState,
        firstObjModified: -1,
        lastObjModified: -1
      }) : d.setState ? this.setStateMethods.set(n, l.bind(s)) : d.beforeEnterRoom ? this.beforeEnterRoomMethods.set(n, l.bind(s)) : d.enterRoomAllowed ? this.enterRoomAllowedMethods.set(n, l.bind(s)) : d.enterRoomDenied ? this.enterRoomDeniedMethods.set(n, l.bind(s)) : d.leaveRoomDone ? this.leaveRoomDoneMethods.set(n, l.bind(s)) : d.peerEntered ? this.peerEnteredMethods.set(n, l.bind(s)) : d.peerProfileUpdated ? this.peerProfileUpdatedMethods.set(n, l.bind(s)) : d.peerLeaved ? this.peerLeavedMethods.set(n, l.bind(s)) : d.userMessageArrived && this.userMessageArrivedMethods.push({
        method: l.bind(s),
        config: d.userMessageArrived
      });
    }
    return this.doSendMessage(C({
      definition: { objId: n, className: o, methods: u }
    })), e;
  }
  createFunctionProxy(e, t, s) {
    const o = `${s}`, n = { original: e, config: t };
    this.distributedFuncs.set(o, n), n.promise = new Promise((c, u) => {
      n.resolve = c, n.reject = u;
    });
    const r = this;
    return function() {
      if (r.ws === null) {
        if (e) return e.apply(null, arguments);
      } else {
        let c = null, u = "BROADCAST";
        return t.distributed && !t.distributed.serialized && (c = e.apply(null, arguments), u = "OTHERCAST"), r.sendMessage(T(
          u,
          { funcId: s, args: Array.from(arguments) }
        )), c ?? n.promise;
      }
    };
  }
  createMethodProxy(e, t, s, o) {
    const n = `${s}:${o}`, r = { original: e, config: t };
    this.shareOrNotifyMethods.set(n, r), r.promise = new Promise((u, m) => {
      r.resolve = u, r.reject = m;
    });
    const c = this;
    return function() {
      if (c.ws === null) {
        if (e) return e.apply(null, [...arguments, c]);
      } else {
        let u = null, m = "BROADCAST";
        const h = c.shareObjects.get(s), l = h.revision;
        return t.distributed && !t.distributed.serialized && (u = e.apply(null, [...arguments, c]), m = "OTHERCAST"), t.changeState && (h.revision++, h.update++), c.sendMessage(U(
          m,
          {
            objId: s,
            objRevision: l,
            methodId: o,
            args: Array.from(arguments)
          }
        )), u ?? r.promise;
      }
    };
  }
  addHostOnlyFunction(e, t, s) {
    const o = this;
    return function() {
      o.isSelfPeerHost() && (t.changeState && s !== void 0 && o.objectChanged(s), e.apply(null, [...arguments, o]));
    };
  }
  objectChanged(e) {
    const t = this.shareObjects.get(e);
    t.revision++, t.update++;
    const s = this.getStateMethods.get(e);
    if (!s) return;
    const o = performance.now();
    s.firstObjModified == -1 && (s.firstObjModified = o), s.lastObjModified = o;
  }
  saveStates() {
    if (!(!this.ws || !this.connecting) && this.isSelfPeerHost())
      for (let [e, t] of this.shareObjects) {
        if (t.update == 0) continue;
        const s = this.getStateMethods.get(e);
        if (!s) continue;
        const o = s.config, n = performance.now(), r = s.firstObjModified, c = s.lastObjModified;
        (n - c >= (o.minInterval || 0) || n - r >= (o.maxInterval || 0)) && (this.doSendMessage($({
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
  x as ChangeState,
  F as ClassName,
  N as Distributed,
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
  g as newUpdateRoomProfile
};
