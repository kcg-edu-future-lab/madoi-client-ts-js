var C = Object.defineProperty;
var I = (s, r, e) => r in s ? C(s, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[r] = e;
var l = (s, r, e) => I(s, typeof r != "symbol" ? r + "" : r, e);
class j extends EventTarget {
  dispatchCustomEvent(r, e) {
    return super.dispatchEvent(new CustomEvent(r, { detail: e }));
  }
}
const M = {
  sender: "__PEER__",
  castType: "PEERTOSERVER",
  recipients: void 0
}, O = {
  sender: "__PEER__",
  castType: "BROADCAST",
  recipients: void 0
}, E = {
  sender: "__PEER__",
  recipients: void 0
};
function D(s = void 0) {
  return {
    type: "Ping",
    ...M,
    body: s
  };
}
function x(s) {
  return {
    type: "EnterRoom",
    ...M,
    ...s
  };
}
function F(s) {
  return {
    type: "LeaveRoom",
    ...M,
    ...s
  };
}
function R(s) {
  return {
    type: "UpdateRoomProfile",
    ...O,
    ...s
  };
}
function S(s) {
  return {
    type: "UpdatePeerProfile",
    ...O,
    ...s
  };
}
function b(s) {
  return {
    type: "DefineFunction",
    ...M,
    ...s
  };
}
function T(s) {
  return {
    type: "DefineObject",
    ...M,
    ...s
  };
}
function A(s, r) {
  return {
    type: "InvokeFunction",
    castType: s,
    ...E,
    ...r
  };
}
function U(s) {
  return {
    type: "UpdateObjectState",
    ...M,
    ...s
  };
}
function L(s, r) {
  return {
    type: "InvokeMethod",
    castType: s,
    ...E,
    ...r
  };
}
function N(s = {}) {
  return (r) => {
    r.madoiClassConfig_ = s;
  };
}
const P = {
  type: "beforeExec",
  maxLog: 0,
  allowedTo: ["USER"]
};
function k(s = P) {
  const r = s;
  return r.type || (r.type = "beforeExec"), r.maxLog || (r.maxLog = 0), (e, t, o) => {
    const n = { share: r };
    e[t].madoiMethodConfig_ = n;
  };
}
const g = {
  type: "beforeExec"
};
function H(s = g) {
  const r = { ...s };
  return (e, t, o) => {
    const n = { notify: r };
    e[t].madoiMethodConfig_ = n;
  };
}
const _ = {
  maxInterval: 5e3
};
function J(s = _) {
  const r = s;
  return (e, t, o) => {
    const n = { getState: r };
    e[t].madoiMethodConfig_ = n;
  };
}
function B(s = {}) {
  const r = s;
  return (e, t, o) => {
    const n = { setState: r };
    e[t].madoiMethodConfig_ = n;
  };
}
function Q(s = {}) {
  return (r, e, t) => {
    const n = { hostOnly: s };
    r[e].madoiMethodConfig_ = n;
  };
}
function G(s = {}) {
  const r = s;
  return (e, t, o) => {
    const n = { beforeEnterRoom: r };
    e[t].madoiMethodConfig_ = n;
  };
}
function z(s = {}) {
  const r = s;
  return (e, t, o) => {
    const n = { enterRoomAllowed: r };
    e[t].madoiMethodConfig_ = n;
  };
}
function q(s = {}) {
  const r = s;
  return (e, t, o) => {
    const n = { enterRoomDenied: r };
    e[t].madoiMethodConfig_ = n;
  };
}
function V(s = {}) {
  const r = s;
  return (e, t, o) => {
    const n = { leaveRoomDone: r };
    e[t].madoiMethodConfig_ = n;
  };
}
function W(s = {}) {
  const r = s;
  return (e, t, o) => {
    const n = { roomProfileUpdated: r };
    e[t].madoiMethodConfig_ = n;
  };
}
function K(s = {}) {
  const r = s;
  return (e, t, o) => {
    const n = { peerEntered: r };
    e[t].madoiMethodConfig_ = n;
  };
}
function X(s = {}) {
  const r = s;
  return (e, t, o) => {
    const n = { peerLeaved: r };
    e[t].madoiMethodConfig_ = n;
  };
}
function Y(s = {}) {
  const r = s;
  return (e, t, o) => {
    const n = { peerProfileUpdated: r };
    e[t].madoiMethodConfig_ = n;
  };
}
class Z extends j {
  constructor(e, t, o, n) {
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
    n && (this.room = { ...this.room, ...n }), o && (this.selfPeer = { ...this.selfPeer, ...o, order: -1 }), this.interimQueue = new Array();
    const i = e.indexOf("?") != -1 ? "&" : "?";
    if (e.match(/^wss?:\/\//))
      this.url = `${e}${i}authToken=${t}`, this.room.id = e.split("rooms/")[1].split("?")[0];
    else {
      const d = document.querySelector("script[src$='madoi.js']").src.split("/", 5), h = (d[0] == "http:" ? "ws:" : "wss:") + "//" + d[2] + "/" + d[3];
      this.url = `${h}/rooms/${e}${i}authToken=${t}`, this.room.id = e;
    }
    this.ws = new WebSocket(this.url), this.ws.onopen = (d) => this.handleOnOpen(d), this.ws.onclose = (d) => this.handleOnClose(d), this.ws.onerror = (d) => this.handleOnError(d), this.ws.onmessage = (d) => this.handleOnMessage(d), setInterval(() => {
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
    o[e] = t, this.sendMessage(R(
      { updates: o }
    ));
  }
  removeRoomProfile(e) {
    this.sendMessage(R(
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
    o[e] = t, this.sendMessage(S(
      { updates: o }
    ));
    const n = { updates: o, peerId: this.selfPeer.id };
    for (const [i, d] of this.peerProfileUpdatedMethods)
      d(n, this);
    this.dispatchCustomEvent("peerProfileUpdated", n);
  }
  removeSelfPeerProfile(e) {
    delete this.selfPeer.profile[e], this.sendMessage(S(
      { deletes: [e] }
    ));
    const t = { deletes: [e], peerId: this.selfPeer.id };
    for (const [o, n] of this.peerProfileUpdatedMethods)
      n(t, this);
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
    (e = this.ws) == null || e.send(JSON.stringify(D()));
  }
  handleOnOpen(e) {
    var t;
    this.connecting = !0;
    for (const [o, n] of this.beforeEnterRoomMethods)
      n(this.selfPeer.profile, this);
    this.doSendMessage(x({ room: this.room, selfPeer: this.selfPeer }));
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
      for (const [o, n] of this.enterRoomAllowedMethods)
        n(t, this);
      this.room = e.room, this.selfPeer.order = e.selfPeer.order, this.peers.set(t.selfPeer.id, { ...t.selfPeer, profile: this.selfPeer.profile });
      for (const o of t.otherPeers)
        this.peers.set(o.id, o);
      if (this.dispatchCustomEvent("enterRoomAllowed", t), e.histories) for (const o of e.histories)
        this.data(o);
    } else if (e.type === "EnterRoomDenied") {
      const o = e;
      for (const [n, i] of this.enterRoomDeniedMethods)
        i(o, this);
      this.dispatchCustomEvent("enterRoomDenied", o);
    } else if (e.type == "LeaveRoomDone") {
      for (const [t, o] of this.leaveRoomDoneMethods)
        o(this);
      this.dispatchCustomEvent("leaveRoomDone");
    } else if (e.type === "UpdateRoomProfile") {
      const t = e;
      if (e.updates) for (const [o, n] of Object.entries(e.updates))
        this.room.profile[o] = n;
      if (e.deletes) for (const o of e.deletes)
        delete this.room.profile[o];
      for (const [o, n] of this.roomProfileUpdatedMethods)
        n(t, this);
      this.dispatchCustomEvent("roomProfileUpdated", t);
    } else if (e.type === "PeerEntered") {
      const t = e;
      this.peers.set(t.peer.id, t.peer);
      for (const [o, n] of this.peerEnteredMethods)
        n(t, this);
      this.dispatchCustomEvent("peerEntered", t);
    } else if (e.type === "PeerLeaved") {
      const t = e;
      this.peers.delete(e.peerId);
      for (const [o, n] of this.peerLeavedMethods)
        n(t, this);
      this.dispatchCustomEvent("peerLeaved", t);
    } else if (e.type === "UpdatePeerProfile") {
      const t = this.peers.get(e.sender);
      if (e.sender && t) {
        if (e.updates) for (const [n, i] of Object.entries(e.updates))
          t.profile[n] = i;
        if (e.deletes) for (const n of e.deletes)
          delete t.profile[n];
        const o = { ...e, peerId: e.sender };
        for (const [n, i] of this.peerProfileUpdatedMethods)
          i(o, this);
        this.dispatchCustomEvent("peerProfileUpdated", o);
      }
    } else if (e.type === "InvokeFunction") {
      const t = `${e.funcId}`, o = this.shareOrNotifyFunctions.get(t);
      if (o === void 0) {
        console.warn("no suitable function for ", e);
        return;
      }
      const n = this.applyInvocation(o.original, e.args);
      n instanceof Promise && n.then(() => {
        var i;
        (i = o.resolve) == null || i.apply(null, arguments);
      }).catch(() => {
        var i;
        (i = o.reject) == null || i.apply(null, arguments);
      });
    } else if (e.type === "UpdateObjectState") {
      const t = this.setStateMethods.get(e.objId);
      t && t(e.state, e.objRevision);
      const o = this.shareObjects.get(e.objId);
      o && (o.revision = e.objRevision);
    } else if (e.type === "InvokeMethod") {
      const t = this.shareObjects.get(e.objId);
      if (t === void 0) {
        console.error(`Object not found for id: ${e.objId}.`, e);
        return;
      }
      const o = `${e.objId}:${e.methodId}`, n = this.shareOrNotifyMethods.get(o);
      if (n === void 0) {
        console.error(`Method not found for id: ${o}.`, e);
        return;
      }
      n.config.share && (t.revision + 1 !== e.serverObjRevision && console.error(`Found inconsistency. serverObjRevision must be ${t.revision + 1} but ${e.serverObjRevision}.`, e), t.revision = e.serverObjRevision);
      const i = this.applyInvocation(n.original, e.args);
      i instanceof Promise && i.then(() => {
        var d;
        (d = n.resolve) == null || d.apply(null, arguments);
      }).catch(() => {
        var d;
        (d = n.reject) == null || d.apply(null, arguments);
      });
    } else e.type ? this.dispatchEvent(new CustomEvent(e.type, { detail: e })) : console.warn("Unknown message type.", e);
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
      return this.addHostOnlyFunction(e, t);
    if ("notify" in t) {
      t.notify.type || (t.notify.type = g.type);
      const o = e.name, n = this.shareOrNotifyFunctions.size, i = this.createFunctionProxy(e, { notify: t.notify }, n), d = function() {
        return i.apply(null, arguments);
      };
      return this.doSendMessage(b({
        definition: {
          funcId: n,
          name: o,
          config: t
        }
      })), d;
    } else if ("share" in t) {
      t.share.type || (t.share.type = P.type), t.share.maxLog || (t.share.maxLog = P.maxLog);
      const o = e.name, n = this.shareOrNotifyFunctions.size, i = this.createFunctionProxy(e, { share: t.share }, n), d = function() {
        return i.apply(null, arguments);
      };
      return this.doSendMessage(b({
        definition: {
          funcId: n,
          name: o,
          config: t
        }
      })), d;
    }
    return e;
  }
  register(e, t = []) {
    if (!this.ws) return e;
    const o = e;
    if (o.madoiObjectId_)
      return console.warn("Ignore object registration because it's already registered."), e;
    let n = o.constructor.name;
    o.__proto__.constructor.madoiClassConfig_ && (n = o.__proto__.constructor.madoiClassConfig_.className);
    const i = this.shareObjects.size, d = { instance: o, revision: 0, modification: 0 };
    this.shareObjects.set(i, d), o.madoiObjectId_ = i;
    const h = new Array(), u = new Array(), m = /* @__PURE__ */ new Map();
    Object.getOwnPropertyNames(Object.getPrototypeOf(o)).forEach((p) => {
      const f = o[p];
      if (typeof f != "function" || !f.madoiMethodConfig_) return;
      const a = f.madoiMethodConfig_, c = h.length;
      m.set(p, c), h.push(f), u.push({ methodId: c, name: p, config: a }), console.debug(`add config ${n}.${p}=${JSON.stringify(a)} from decorator`);
    });
    for (const p of t) {
      const f = p.method, a = p, c = f.name;
      if ("share" in a)
        a.share.type || (a.share.type = P.type), a.share.maxLog || (a.share.maxLog = P.maxLog);
      else if ("notify" in a)
        a.notify.type || (a.notify.type = g.type);
      else if (!("hostOnly" in a)) {
        if ("getState" in a)
          a.getState.maxInterval || (a.getState.maxInterval = _.maxInterval);
        else if (!("setState" in a)) {
          if (!("enterRoomAllowed" in a)) {
            if (!("enterRoomDenied" in a)) {
              if (!("leaveRoomDone" in a)) {
                if (!("peerEntered" in a)) {
                  if (!("peerLeaved" in a)) continue;
                }
              }
            }
          }
        }
      }
      const v = m.get(c);
      if (typeof v > "u") {
        const w = h.length;
        m.set(c, w), h.push(f), u.push({ methodId: w, name: p.method.name, config: a }), console.debug(`add config ${n}.${c}=${JSON.stringify(p)} from argument`);
      } else
        u[v].config = p, console.debug(`replace config ${n}.${c}=${JSON.stringify(p)} from argument`);
    }
    for (let p = 0; p < h.length; p++) {
      const f = h[p], a = u[p], c = a.config;
      if ("share" in c) {
        const v = this.createMethodProxy(
          f.bind(o),
          { share: c.share },
          i,
          a.methodId
        );
        o[a.name] = function() {
          return d.modification++, v.apply(null, arguments);
        };
      } else if ("notify" in c) {
        const v = this.createMethodProxy(
          f.bind(o),
          { notify: c.notify },
          i,
          a.methodId
        );
        o[a.name] = function() {
          return v.apply(null, arguments);
        };
      } else if ("hostOnly" in c) {
        const v = this.addHostOnlyFunction(
          f.bind(o),
          c.hostOnly
        );
        o[a.name] = function() {
          return d.modification++, v.apply(null, arguments);
        };
      } else "getState" in c ? this.getStateMethods.set(i, {
        method: f.bind(o),
        config: c.getState,
        lastGet: 0
      }) : "setState" in c ? this.setStateMethods.set(i, f.bind(o)) : "beforeEnterRoom" in c ? this.beforeEnterRoomMethods.set(i, f.bind(o)) : "enterRoomAllowed" in c ? this.enterRoomAllowedMethods.set(i, f.bind(o)) : "enterRoomDenied" in c ? this.enterRoomDeniedMethods.set(i, f.bind(o)) : "leaveRoomDone" in c ? this.leaveRoomDoneMethods.set(i, f.bind(o)) : "peerEntered" in c ? this.peerEnteredMethods.set(i, f.bind(o)) : "peerProfileUpdated" in c ? this.peerProfileUpdatedMethods.set(i, f.bind(o)) : "peerLeaved" in c && this.peerLeavedMethods.set(i, f.bind(o));
    }
    const y = T({
      definition: {
        objId: i,
        className: n,
        methods: u
      }
    });
    return this.doSendMessage(y), e;
  }
  createFunctionProxy(e, t, o) {
    const n = `${o}`, i = { original: e, config: t };
    this.shareOrNotifyFunctions.set(n, i), i.promise = new Promise((h, u) => {
      i.resolve = h, i.reject = u;
    });
    const d = this;
    return function() {
      var h, u;
      if (d.ws === null) {
        if (e) return e.apply(null, arguments);
      } else {
        let m = null, y = "BROADCAST";
        return (((h = t.share) == null ? void 0 : h.type) === "afterExec" || ((u = t.notify) == null ? void 0 : u.type) === "afterExec") && (m = e.apply(null, arguments), y = "OTHERCAST"), d.sendMessage(A(
          y,
          {
            funcId: o,
            args: Array.from(arguments)
          }
        )), m ?? i.promise;
      }
    };
  }
  createMethodProxy(e, t, o, n) {
    const i = `${o}:${n}`, d = { original: e, config: t };
    this.shareOrNotifyMethods.set(i, d), d.promise = new Promise((u, m) => {
      d.resolve = u, d.reject = m;
    });
    const h = this;
    return function() {
      var u, m;
      if (h.ws === null) {
        if (e) return e.apply(null, [...arguments, h]);
      } else {
        let y = null, p = "BROADCAST", f = h.shareObjects.get(o).revision;
        return (((u = t.share) == null ? void 0 : u.type) === "afterExec" || ((m = t.notify) == null ? void 0 : m.type) === "afterExec") && (y = e.apply(null, [...arguments, h]), t.share && f++, p = "OTHERCAST"), h.sendMessage(L(
          p,
          {
            objId: o,
            objRevision: f,
            methodId: n,
            args: Array.from(arguments)
          }
        )), y ?? d.promise;
      }
    };
  }
  addHostOnlyFunction(e, t) {
    const o = this;
    return function() {
      let n = o.selfPeer.order;
      for (const i of o.peers.values())
        n > i.order && (n = i.order);
      o.selfPeer.order === n && e.apply(null, [...arguments, o]);
    };
  }
  saveStates() {
    if (!(!this.ws || !this.connecting))
      for (let [e, t] of this.shareObjects) {
        if (t.modification == 0) continue;
        const o = this.getStateMethods.get(e);
        if (!o) continue;
        const n = performance.now();
        (o.config.maxUpdates && o.config.maxUpdates <= t.modification || o.config.maxInterval && o.config.maxInterval <= n - o.lastGet) && (this.doSendMessage(U({
          objId: e,
          objRevision: t.revision,
          state: o.method(this)
        })), o.lastGet = n, t.modification = 0, console.debug(`state saved: ${e}`));
      }
  }
  applyInvocation(e, t) {
    return e.apply(null, t);
  }
}
export {
  G as BeforeEnterRoom,
  z as EnterRoomAllowed,
  q as EnterRoomDenied,
  J as GetState,
  Q as HostOnly,
  V as LeaveRoomDone,
  Z as Madoi,
  H as Notify,
  K as PeerEntered,
  X as PeerLeaved,
  Y as PeerProfileUpdated,
  W as RoomProfileUpdated,
  B as SetState,
  k as Share,
  N as ShareClass,
  _ as getStateConfigDefault,
  b as newDefineFunction,
  T as newDefineObject,
  x as newEnterRoom,
  A as newInvokeFunction,
  L as newInvokeMethod,
  F as newLeaveRoom,
  D as newPing,
  U as newUpdateObjectState,
  S as newUpdatePeerProfile,
  R as newUpdateRoomProfile,
  g as notifyConfigDefault,
  P as shareConfigDefault
};
