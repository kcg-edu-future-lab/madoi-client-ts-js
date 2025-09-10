var _ = Object.defineProperty;
var C = (n, i, e) => i in n ? _(n, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[i] = e;
var l = (n, i, e) => C(n, typeof i != "symbol" ? i + "" : i, e);
class D extends EventTarget {
  dispatchCustomEvent(i, e) {
    return super.dispatchEvent(new CustomEvent(i, { detail: e }));
  }
}
const g = {
  sender: "__PEER__",
  castType: "PEERTOSERVER",
  recipients: void 0
}, b = {
  sender: "__PEER__",
  castType: "BROADCAST",
  recipients: void 0
}, O = {
  sender: "__PEER__",
  recipients: void 0
};
function A(n = void 0) {
  return {
    type: "Ping",
    ...g,
    body: n
  };
}
function j(n) {
  return {
    type: "EnterRoom",
    ...g,
    ...n
  };
}
function V(n) {
  return {
    type: "LeaveRoom",
    ...g,
    ...n
  };
}
function P(n) {
  return {
    type: "UpdateRoomProfile",
    ...b,
    ...n
  };
}
function R(n) {
  return {
    type: "UpdatePeerProfile",
    ...b,
    ...n
  };
}
function w(n) {
  return {
    type: "DefineFunction",
    ...g,
    ...n
  };
}
function I(n) {
  return {
    type: "DefineObject",
    ...g,
    ...n
  };
}
function U(n, i) {
  return {
    type: "InvokeFunction",
    castType: n,
    ...O,
    ...i
  };
}
function T(n) {
  return {
    type: "UpdateObjectState",
    ...g,
    ...n
  };
}
function $(n, i) {
  return {
    type: "InvokeMethod",
    castType: n,
    ...O,
    ...i
  };
}
function W(n = {}) {
  return (i) => {
    i.madoiClassConfig_ = n;
  };
}
function K(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { share: n };
  };
}
function X(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { notify: n };
  };
}
function Y(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { getState: n };
  };
}
function Z(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { setState: n };
  };
}
function ee(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { hostOnly: n };
  };
}
function te(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { beforeEnterRoom: n };
  };
}
function oe(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { enterRoomAllowed: n };
  };
}
function se(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { enterRoomDenied: n };
  };
}
function ne(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { leaveRoomDone: n };
  };
}
function re(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { roomProfileUpdated: n };
  };
}
function ie(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { peerEntered: n };
  };
}
function de(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { peerLeaved: n };
  };
}
function ae(n = {}) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { peerProfileUpdated: n };
  };
}
function fe(n) {
  return (i, e, t) => {
    i[e].madoiMethodConfig_ = { userMessageArrived: n };
  };
}
const S = { type: "beforeExec", maxLog: 0, allowedTo: ["USER"] }, E = { type: "beforeExec" }, x = { maxInterval: 5e3 }, L = { maxInterval: 5e3 }, F = {}, N = {}, k = {}, H = {}, J = {}, ce = {}, B = {}, Q = {}, G = {}, z = {};
class le extends D {
  constructor(e, t, o, s) {
    super();
    l(this, "connecting", !1);
    l(this, "interimQueue");
    l(this, "shareOrNotifyFunctions", /* @__PURE__ */ new Map());
    l(this, "shareObjects", /* @__PURE__ */ new Map());
    l(this, "shareOrNotifyMethods", /* @__PURE__ */ new Map());
    // annotated methods
    l(this, "getStateMethods", /* @__PURE__ */ new Map());
    l(this, "setStateMethods", /* @__PURE__ */ new Map());
    // objectId -> @SetState method
    l(this, "beforeEnterRoomMethods", /* @__PURE__ */ new Map());
    l(this, "enterRoomAllowedMethods", /* @__PURE__ */ new Map());
    l(this, "enterRoomDeniedMethods", /* @__PURE__ */ new Map());
    l(this, "leaveRoomDoneMethods", /* @__PURE__ */ new Map());
    l(this, "roomProfileUpdatedMethods", /* @__PURE__ */ new Map());
    l(this, "peerEnteredMethods", /* @__PURE__ */ new Map());
    l(this, "peerLeavedMethods", /* @__PURE__ */ new Map());
    l(this, "peerProfileUpdatedMethods", /* @__PURE__ */ new Map());
    l(this, "userMessageArrivedMethods", []);
    l(this, "url");
    l(this, "ws", null);
    l(this, "room", { id: "", spec: { maxLog: 1e3 }, profile: {} });
    l(this, "selfPeer", { id: "", order: -1, profile: {} });
    l(this, "peers", /* @__PURE__ */ new Map());
    l(this, "currentSenderId", null);
    l(this, "systemMessageTypes", [
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
    s && (this.room = { ...this.room, ...s }), o && (this.selfPeer = { ...this.selfPeer, ...o, order: -1 }), this.interimQueue = new Array();
    const r = e.indexOf("?") != -1 ? "&" : "?";
    if (e.match(/^wss?:\/\//))
      this.url = `${e}${r}authToken=${t}`, this.room.id = e.split("rooms/")[1].split("?")[0];
    else {
      const a = document.querySelector("script[src$='madoi.js']").src.split("/", 5), h = (a[0] == "http:" ? "ws:" : "wss:") + "//" + a[2] + "/" + a[3];
      this.url = `${h}/rooms/${e}${r}authToken=${t}`, this.room.id = e;
    }
    this.ws = new WebSocket(this.url), this.ws.onopen = (a) => this.handleOnOpen(a), this.ws.onclose = (a) => this.handleOnClose(a), this.ws.onerror = (a) => this.handleOnError(a), this.ws.onmessage = (a) => this.handleOnMessage(a), setInterval(() => {
      this.saveStates();
    }, 1e3), setInterval(() => {
      this.sendPing();
    }, 3e4);
  }
  getRoomId() {
    return this.room.id;
  }
  getRoomProfile() {
    var e;
    return (e = this.room) == null ? void 0 : e.profile;
  }
  setRoomProfile(e, t) {
    const o = {};
    o[e] = t, this.sendMessage(P(
      { updates: o }
    ));
  }
  removeRoomProfile(e) {
    this.sendMessage(P(
      { deletes: [e] }
    ));
  }
  getSelfPeerId() {
    var e;
    return (e = this.selfPeer) == null ? void 0 : e.id;
  }
  getSelfPeerProfile() {
    return this.selfPeer.profile;
  }
  updateSelfPeerProfile(e, t) {
    this.selfPeer.profile[e] = t;
    const o = {};
    o[e] = t, this.sendMessage(R(
      { updates: o }
    ));
    const s = { updates: o, peerId: this.selfPeer.id };
    for (const [r, a] of this.peerProfileUpdatedMethods)
      a(s, this);
    this.dispatchCustomEvent("peerProfileUpdated", s);
  }
  removeSelfPeerProfile(e) {
    delete this.selfPeer.profile[e], this.sendMessage(R(
      { deletes: [e] }
    ));
    const t = { deletes: [e], peerId: this.selfPeer.id };
    for (const [o, s] of this.peerProfileUpdatedMethods)
      s(t, this);
    this.dispatchCustomEvent("peerProfileUpdated", t);
  }
  isMessageProcessing() {
    return this.currentSenderId !== null;
  }
  getCurrentSender() {
    return this.currentSenderId === null ? null : this.peers.get(this.currentSenderId);
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
    for (const [o, s] of this.beforeEnterRoomMethods)
      s(this.selfPeer.profile, this);
    this.doSendMessage(j({ room: this.room, selfPeer: this.selfPeer }));
    for (let o of this.interimQueue)
      (t = this.ws) == null || t.send(JSON.stringify(o));
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
      for (const [o, s] of this.enterRoomAllowedMethods)
        s(t, this);
      this.room = e.room, this.selfPeer.order = e.selfPeer.order, this.peers.set(t.selfPeer.id, { ...t.selfPeer, profile: this.selfPeer.profile });
      for (const o of t.otherPeers)
        this.peers.set(o.id, o);
      if (this.dispatchCustomEvent("enterRoomAllowed", t), e.histories) for (const o of e.histories)
        this.data(o);
    } else if (e.type === "EnterRoomDenied") {
      const o = e;
      for (const [s, r] of this.enterRoomDeniedMethods)
        r(o, this);
      this.dispatchCustomEvent("enterRoomDenied", o);
    } else if (e.type == "LeaveRoomDone") {
      for (const [t, o] of this.leaveRoomDoneMethods)
        o(this);
      this.dispatchCustomEvent("leaveRoomDone");
    } else if (e.type === "UpdateRoomProfile") {
      const t = e;
      if (e.updates) for (const [o, s] of Object.entries(e.updates))
        this.room.profile[o] = s;
      if (e.deletes) for (const o of e.deletes)
        delete this.room.profile[o];
      for (const [o, s] of this.roomProfileUpdatedMethods)
        s(t, this);
      this.dispatchCustomEvent("roomProfileUpdated", t);
    } else if (e.type === "PeerEntered") {
      const t = e;
      this.peers.set(t.peer.id, t.peer);
      for (const [o, s] of this.peerEnteredMethods)
        s(t, this);
      this.dispatchCustomEvent("peerEntered", t);
    } else if (e.type === "PeerLeaved") {
      const t = e;
      this.peers.delete(e.peerId);
      for (const [o, s] of this.peerLeavedMethods)
        s(t, this);
      this.dispatchCustomEvent("peerLeaved", t);
    } else if (e.type === "UpdatePeerProfile") {
      const t = this.peers.get(e.sender);
      if (e.sender && t) {
        if (e.updates) for (const [s, r] of Object.entries(e.updates))
          t.profile[s] = r;
        if (e.deletes) for (const s of e.deletes)
          delete t.profile[s];
        const o = { ...e, peerId: e.sender };
        for (const [s, r] of this.peerProfileUpdatedMethods)
          r(o, this);
        this.dispatchCustomEvent("peerProfileUpdated", o);
      }
    } else if (e.type === "InvokeFunction") {
      const t = `${e.funcId}`, o = this.shareOrNotifyFunctions.get(t);
      if (o === void 0) {
        console.warn("no suitable function for ", e);
        return;
      }
      const s = this.applyInvocation(o.original, e.args);
      s instanceof Promise && s.then(() => {
        var r;
        (r = o.resolve) == null || r.apply(null, arguments);
      }).catch(() => {
        var r;
        (r = o.reject) == null || r.apply(null, arguments);
      });
    } else if (e.type === "UpdateObjectState") {
      const t = this.setStateMethods.get(e.objId);
      t && t(e.state, e.objRevision);
      const o = this.shareObjects.get(e.objId);
      o && (o.revision = e.objRevision, o.update = 0);
    } else if (e.type === "InvokeMethod") {
      const t = this.shareObjects.get(e.objId);
      if (t === void 0) {
        console.error(`Object not found for id: ${e.objId}.`, e);
        return;
      }
      const o = `${e.objId}:${e.methodId}`, s = this.shareOrNotifyMethods.get(o);
      if (s === void 0) {
        console.error(`Method not found for id: ${o}.`, e);
        return;
      }
      s.config.share && (s.config.share.type == "beforeExec" && t.revision + 1 !== e.serverObjRevision && console.error(`Found inconsistency. serverObjRevision must be ${t.revision + 1} but ${e.serverObjRevision}.`, e), t.revision++, t.update++);
      const r = this.applyInvocation(s.original, e.args);
      r instanceof Promise && r.then(() => {
        var a;
        (a = s.resolve) == null || a.apply(null, arguments);
      }).catch(() => {
        var a;
        (a = s.reject) == null || a.apply(null, arguments);
      });
    } else if (e.type) {
      const t = e;
      for (const o of this.userMessageArrivedMethods)
        o.config.type === e.type && o.method(t, this);
      this.dispatchEvent(new CustomEvent(e.type, { detail: e }));
    } else
      console.warn("Unknown message type.", e);
  }
  isSystemMessageType(e) {
    return e in this.systemMessageTypes;
  }
  send(e, t, o = "BROADCAST") {
    this.ws && this.sendMessage({
      type: e,
      sender: this.selfPeer.id,
      castType: o,
      recipients: void 0,
      content: t
    });
  }
  unicast(e, t, o) {
    this.sendMessage({
      type: e,
      sender: this.selfPeer.id,
      castType: "UNICAST",
      recipients: [o],
      content: t
    });
  }
  multicast(e, t, o) {
    this.sendMessage({
      type: e,
      sender: this.selfPeer.id,
      castType: "MULTICAST",
      recipients: o,
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
  registerFunction(e, t = { share: {} }) {
    if ("hostOnly" in t)
      return this.addHostOnlyFunction(e, t.hostOnly);
    if ("notify" in t) {
      t = { notify: { ...E, ...t.notify } };
      const o = e.name, s = this.shareOrNotifyFunctions.size, r = this.createFunctionProxy(e, { notify: t.notify }, s), a = function() {
        return r.apply(null, arguments);
      };
      return this.doSendMessage(w({
        definition: {
          funcId: s,
          name: o,
          config: t
        }
      })), a;
    } else if ("share" in t) {
      t = { share: { ...S, ...t.share } };
      const o = e.name, s = this.shareOrNotifyFunctions.size, r = this.createFunctionProxy(e, { share: t.share }, s), a = function() {
        return r.apply(null, arguments);
      };
      return this.doSendMessage(w({
        definition: {
          funcId: s,
          name: o,
          config: t
        }
      })), a;
    }
    return e;
  }
  register(e, t = []) {
    if (!this.ws) return e;
    const o = e;
    if (o.madoiObjectId_)
      return console.warn("Ignore object registration because it's already registered."), e;
    let s = o.constructor.name;
    o.__proto__.constructor.madoiClassConfig_ && (s = o.__proto__.constructor.madoiClassConfig_.className);
    const r = this.shareObjects.size, a = { instance: o, revision: 0, update: 0 };
    this.shareObjects.set(r, a), o.madoiObjectId_ = r;
    const h = new Array(), u = new Array(), m = /* @__PURE__ */ new Map();
    Object.getOwnPropertyNames(Object.getPrototypeOf(o)).forEach((p) => {
      const c = o[p];
      if (typeof c != "function" || !c.madoiMethodConfig_) return;
      const f = c.madoiMethodConfig_, d = h.length;
      m.set(p, d), h.push(c), u.push({ methodId: d, name: p, config: f }), console.debug(`add config ${s}.${p}=${JSON.stringify(f)} from decorator`);
    });
    for (const p of t) {
      const c = p.method, f = p, d = c.name, v = m.get(d);
      if (typeof v > "u") {
        const M = h.length;
        m.set(d, M), h.push(c), u.push({ methodId: M, name: p.method.name, config: f }), console.debug(`add config ${s}.${d}=${JSON.stringify(p)} from argument`);
      } else
        u[v].config = {
          ...u[v].config,
          ...p
        }, console.debug(`merge config ${s}.${d}=${JSON.stringify(p)} from argument`);
    }
    for (let p = 0; p < h.length; p++) {
      const c = h[p], f = u[p], d = f.config;
      "share" in d ? (f.config = { share: { ...S, ...d.share } }, o[f.name] = this.createMethodProxy(
        c.bind(o),
        d,
        r,
        f.methodId
      )) : "notify" in d ? (f.config = { notify: { ...E, ...d.notify } }, o[f.name] = this.createMethodProxy(
        c.bind(o),
        d,
        r,
        f.methodId
      )) : "hostOnly" in d ? (f.config = { hostOnly: { ...F, ...d.hostOnly } }, o[f.name] = this.addHostOnlyFunction(
        c.bind(o),
        d.hostOnly,
        r
      )) : "getState" in d ? (f.config = { getState: { ...x, ...d.getState } }, this.getStateMethods.set(r, {
        method: c.bind(o),
        config: d.getState,
        lastGet: 0
      })) : "setState" in d ? (f.config = { setState: { ...L, ...d.setState } }, this.setStateMethods.set(r, c.bind(o))) : "beforeEnterRoom" in d ? (f.config = { beforeEnterRoom: { ...N, ...d.beforeEnterRoom } }, this.beforeEnterRoomMethods.set(r, c.bind(o))) : "enterRoomAllowed" in d ? (f.config = { enterRoomAllowed: { ...k, ...d.enterRoomAllowed } }, this.enterRoomAllowedMethods.set(r, c.bind(o))) : "enterRoomDenied" in d ? (f.config = { enterRoomDenied: { ...H, ...d.enterRoomDenied } }, this.enterRoomDeniedMethods.set(r, c.bind(o))) : "leaveRoomDone" in d ? (f.config = { leaveRoomDone: { ...J, ...d.leaveRoomDone } }, this.leaveRoomDoneMethods.set(r, c.bind(o))) : "peerEntered" in d ? (f.config = { peerEntered: { ...B, ...d.peerEntered } }, this.peerEnteredMethods.set(r, c.bind(o))) : "peerProfileUpdated" in d ? (f.config = { peerProfileUpdated: { ...G, ...d.peerProfileUpdated } }, this.peerProfileUpdatedMethods.set(r, c.bind(o))) : "peerLeaved" in d ? (f.config = { peerLeaved: { ...Q, ...d.peerLeaved } }, this.peerLeavedMethods.set(r, c.bind(o))) : "userMessageArrived" in d && (f.config = { userMessageArrived: { type: "", ...z, ...d.userMessageArrived } }, this.userMessageArrivedMethods.push({
        method: c.bind(o),
        config: d.userMessageArrived
      }));
    }
    const y = I({
      definition: {
        objId: r,
        className: s,
        methods: u
      }
    });
    return this.doSendMessage(y), e;
  }
  createFunctionProxy(e, t, o) {
    const s = `${o}`, r = { original: e, config: t };
    this.shareOrNotifyFunctions.set(s, r), r.promise = new Promise((h, u) => {
      r.resolve = h, r.reject = u;
    });
    const a = this;
    return function() {
      var h, u;
      if (a.ws === null) {
        if (e) return e.apply(null, arguments);
      } else {
        let m = null, y = "BROADCAST";
        return (((h = t.share) == null ? void 0 : h.type) === "afterExec" || ((u = t.notify) == null ? void 0 : u.type) === "afterExec") && (m = e.apply(null, arguments), y = "OTHERCAST"), a.sendMessage(U(
          y,
          {
            funcId: o,
            args: Array.from(arguments)
          }
        )), m ?? r.promise;
      }
    };
  }
  createMethodProxy(e, t, o, s) {
    const r = `${o}:${s}`, a = { original: e, config: t };
    this.shareOrNotifyMethods.set(r, a), a.promise = new Promise((u, m) => {
      a.resolve = u, a.reject = m;
    });
    const h = this;
    return function() {
      var u, m;
      if (h.ws === null) {
        if (e) return e.apply(null, [...arguments, h]);
      } else {
        let y = null, p = "BROADCAST";
        const c = h.shareObjects.get(o), f = c.revision;
        return (((u = t.share) == null ? void 0 : u.type) === "afterExec" || ((m = t.notify) == null ? void 0 : m.type) === "afterExec") && (y = e.apply(null, [...arguments, h]), t.share && (c.revision++, c.update++), p = "OTHERCAST"), h.sendMessage($(
          p,
          {
            objId: o,
            objRevision: f,
            methodId: s,
            args: Array.from(arguments)
          }
        )), y ?? a.promise;
      }
    };
  }
  addHostOnlyFunction(e, t, o) {
    const s = this;
    return () => {
      if (s.isSelfPeerHost()) {
        if (o !== void 0) {
          const r = s.shareObjects.get(o);
          r.revision++, r.update++;
        }
        e.apply(null, [...arguments, s]);
      }
    };
  }
  saveStates() {
    if (!(!this.ws || !this.connecting) && this.isSelfPeerHost())
      for (let [e, t] of this.shareObjects) {
        if (t.update == 0) continue;
        const o = this.getStateMethods.get(e);
        if (!o) continue;
        const s = performance.now();
        (o.config.maxUpdates && o.config.maxUpdates <= t.update || o.config.maxInterval && o.config.maxInterval <= s - o.lastGet) && (this.doSendMessage(T({
          objId: e,
          objRevision: t.revision,
          state: o.method(this)
        })), o.lastGet = s, t.update = 0, console.debug(`state saved: ${e}`));
      }
  }
  applyInvocation(e, t) {
    return e.apply(null, t);
  }
  isSelfPeerHost() {
    for (const e of this.peers.values())
      if (e.order < this.selfPeer.order) return !1;
    return !0;
  }
}
export {
  te as BeforeEnterRoom,
  oe as EnterRoomAllowed,
  se as EnterRoomDenied,
  Y as GetState,
  ee as HostOnly,
  ne as LeaveRoomDone,
  le as Madoi,
  X as Notify,
  ie as PeerEntered,
  de as PeerLeaved,
  ae as PeerProfileUpdated,
  re as RoomProfileUpdated,
  Z as SetState,
  K as Share,
  W as ShareClass,
  fe as UserMessageArrived,
  N as beforeEnterRoomConfigDefault,
  k as enterRoomAllowedConfigDefault,
  H as enterRoomDeniedConfigDefault,
  x as getStateConfigDefault,
  F as hostOnlyConfigDefault,
  J as leaveRoomDoneConfigDefault,
  w as newDefineFunction,
  I as newDefineObject,
  j as newEnterRoom,
  U as newInvokeFunction,
  $ as newInvokeMethod,
  V as newLeaveRoom,
  A as newPing,
  T as newUpdateObjectState,
  R as newUpdatePeerProfile,
  P as newUpdateRoomProfile,
  E as notifyConfigDefault,
  B as peerEnteredConfigDefault,
  Q as peerLeavedConfigDefault,
  G as peerProfileUpdatedConfigDefault,
  ce as roomProfileUpdatedConfigDefault,
  L as setStateConfigDefault,
  S as shareConfigDefault,
  z as userMessageArrivedConfigDefault
};
