var C = Object.defineProperty;
var I = (n, r, e) => r in n ? C(n, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[r] = e;
var l = (n, r, e) => I(n, typeof r != "symbol" ? r + "" : r, e);
class j extends EventTarget {
  dispatchCustomEvent(r, e) {
    return super.dispatchEvent(new CustomEvent(r, { detail: e }));
  }
}
const v = {
  sender: "__PEER__",
  castType: "PEERTOSERVER",
  recipients: void 0
}, E = {
  sender: "__PEER__",
  castType: "BROADCAST",
  recipients: void 0
}, O = {
  sender: "__PEER__",
  recipients: void 0
};
function x(n = void 0) {
  return {
    type: "Ping",
    ...v,
    body: n
  };
}
function D(n) {
  return {
    type: "EnterRoom",
    ...v,
    ...n
  };
}
function F(n) {
  return {
    type: "LeaveRoom",
    ...v,
    ...n
  };
}
function w(n) {
  return {
    type: "UpdateRoomProfile",
    ...E,
    ...n
  };
}
function R(n) {
  return {
    type: "UpdatePeerProfile",
    ...E,
    ...n
  };
}
function b(n) {
  return {
    type: "DefineFunction",
    ...v,
    ...n
  };
}
function T(n) {
  return {
    type: "DefineObject",
    ...v,
    ...n
  };
}
function A(n, r) {
  return {
    type: "InvokeFunction",
    castType: n,
    ...O,
    ...r
  };
}
function U(n) {
  return {
    type: "UpdateObjectState",
    ...v,
    ...n
  };
}
function L(n, r) {
  return {
    type: "InvokeMethod",
    castType: n,
    ...O,
    ...r
  };
}
function N(n = {}) {
  return (r) => {
    r.madoiClassConfig_ = n;
  };
}
const M = {
  type: "beforeExec",
  maxLog: 0,
  allowedTo: ["USER"]
};
function k(n = M) {
  const r = n;
  return r.type || (r.type = "beforeExec"), r.maxLog || (r.maxLog = 0), (e, t, o) => {
    const s = { share: r };
    e[t].madoiMethodConfig_ = s;
  };
}
const P = {
  type: "beforeExec"
};
function H(n = P) {
  const r = { ...n };
  return (e, t, o) => {
    const s = { notify: r };
    e[t].madoiMethodConfig_ = s;
  };
}
const _ = {
  maxInterval: 5e3
};
function J(n = _) {
  const r = n;
  return (e, t, o) => {
    const s = { getState: r };
    e[t].madoiMethodConfig_ = s;
  };
}
function B(n = {}) {
  const r = n;
  return (e, t, o) => {
    const s = { setState: r };
    e[t].madoiMethodConfig_ = s;
  };
}
function Q(n = {}) {
  return (r, e, t) => {
    const s = { hostOnly: n };
    r[e].madoiMethodConfig_ = s;
  };
}
function G(n = {}) {
  const r = n;
  return (e, t, o) => {
    const s = { beforeEnterRoom: r };
    e[t].madoiMethodConfig_ = s;
  };
}
function z(n = {}) {
  const r = n;
  return (e, t, o) => {
    const s = { enterRoomAllowed: r };
    e[t].madoiMethodConfig_ = s;
  };
}
function q(n = {}) {
  const r = n;
  return (e, t, o) => {
    const s = { enterRoomDenied: r };
    e[t].madoiMethodConfig_ = s;
  };
}
function V(n = {}) {
  const r = n;
  return (e, t, o) => {
    const s = { leaveRoomDone: r };
    e[t].madoiMethodConfig_ = s;
  };
}
function W(n = {}) {
  const r = n;
  return (e, t, o) => {
    const s = { roomProfileUpdated: r };
    e[t].madoiMethodConfig_ = s;
  };
}
function K(n = {}) {
  const r = n;
  return (e, t, o) => {
    const s = { peerEntered: r };
    e[t].madoiMethodConfig_ = s;
  };
}
function X(n = {}) {
  const r = n;
  return (e, t, o) => {
    const s = { peerLeaved: r };
    e[t].madoiMethodConfig_ = s;
  };
}
function Y(n = {}) {
  const r = n;
  return (e, t, o) => {
    const s = { peerProfileUpdated: r };
    e[t].madoiMethodConfig_ = s;
  };
}
class Z extends j {
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
    o[e] = t, this.sendMessage(w(
      { updates: o }
    ));
  }
  removeRoomProfile(e) {
    this.sendMessage(w(
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
    for (const [i, d] of this.peerProfileUpdatedMethods)
      d(s, this);
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
    (e = this.ws) == null || e.send(JSON.stringify(x()));
  }
  handleOnOpen(e) {
    var t;
    this.connecting = !0;
    for (const [o, s] of this.beforeEnterRoomMethods)
      s(this.selfPeer.profile, this);
    this.doSendMessage(D({ room: this.room, selfPeer: this.selfPeer }));
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
      for (const [s, i] of this.enterRoomDeniedMethods)
        i(o, this);
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
        if (e.updates) for (const [s, i] of Object.entries(e.updates))
          t.profile[s] = i;
        if (e.deletes) for (const s of e.deletes)
          delete t.profile[s];
        const o = { ...e, peerId: e.sender };
        for (const [s, i] of this.peerProfileUpdatedMethods)
          i(o, this);
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
      const i = this.applyInvocation(s.original, e.args);
      i instanceof Promise && i.then(() => {
        var d;
        (d = s.resolve) == null || d.apply(null, arguments);
      }).catch(() => {
        var d;
        (d = s.reject) == null || d.apply(null, arguments);
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
      t.notify.type || (t.notify.type = P.type);
      const o = e.name, s = this.shareOrNotifyFunctions.size, i = this.createFunctionProxy(e, { notify: t.notify }, s), d = function() {
        return i.apply(null, arguments);
      };
      return this.doSendMessage(b({
        definition: {
          funcId: s,
          name: o,
          config: t
        }
      })), d;
    } else if ("share" in t) {
      t.share.type || (t.share.type = M.type), t.share.maxLog || (t.share.maxLog = M.maxLog);
      const o = e.name, s = this.shareOrNotifyFunctions.size, i = this.createFunctionProxy(e, { share: t.share }, s), d = function() {
        return i.apply(null, arguments);
      };
      return this.doSendMessage(b({
        definition: {
          funcId: s,
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
    let s = o.constructor.name;
    o.__proto__.constructor.madoiClassConfig_ && (s = o.__proto__.constructor.madoiClassConfig_.className);
    const i = this.shareObjects.size, d = { instance: o, revision: 0, update: 0 };
    this.shareObjects.set(i, d), o.madoiObjectId_ = i;
    const h = new Array(), u = new Array(), m = /* @__PURE__ */ new Map();
    Object.getOwnPropertyNames(Object.getPrototypeOf(o)).forEach((p) => {
      const c = o[p];
      if (typeof c != "function" || !c.madoiMethodConfig_) return;
      const a = c.madoiMethodConfig_, f = h.length;
      m.set(p, f), h.push(c), u.push({ methodId: f, name: p, config: a }), console.debug(`add config ${s}.${p}=${JSON.stringify(a)} from decorator`);
    });
    for (const p of t) {
      const c = p.method, a = p, f = c.name;
      if ("share" in a)
        a.share.type || (a.share.type = M.type), a.share.maxLog || (a.share.maxLog = M.maxLog);
      else if ("notify" in a)
        a.notify.type || (a.notify.type = P.type);
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
      const g = m.get(f);
      if (typeof g > "u") {
        const S = h.length;
        m.set(f, S), h.push(c), u.push({ methodId: S, name: p.method.name, config: a }), console.debug(`add config ${s}.${f}=${JSON.stringify(p)} from argument`);
      } else
        u[g].config = p, console.debug(`replace config ${s}.${f}=${JSON.stringify(p)} from argument`);
    }
    for (let p = 0; p < h.length; p++) {
      const c = h[p], a = u[p], f = a.config;
      "share" in f ? o[a.name] = this.createMethodProxy(
        c.bind(o),
        { share: f.share },
        i,
        a.methodId
      ) : "notify" in f ? o[a.name] = this.createMethodProxy(
        c.bind(o),
        { notify: f.notify },
        i,
        a.methodId
      ) : "hostOnly" in f ? o[a.name] = this.addHostOnlyFunction(
        c.bind(o),
        f.hostOnly,
        i
      ) : "getState" in f ? this.getStateMethods.set(i, {
        method: c.bind(o),
        config: f.getState,
        lastGet: 0
      }) : "setState" in f ? this.setStateMethods.set(i, c.bind(o)) : "beforeEnterRoom" in f ? this.beforeEnterRoomMethods.set(i, c.bind(o)) : "enterRoomAllowed" in f ? this.enterRoomAllowedMethods.set(i, c.bind(o)) : "enterRoomDenied" in f ? this.enterRoomDeniedMethods.set(i, c.bind(o)) : "leaveRoomDone" in f ? this.leaveRoomDoneMethods.set(i, c.bind(o)) : "peerEntered" in f ? this.peerEnteredMethods.set(i, c.bind(o)) : "peerProfileUpdated" in f ? this.peerProfileUpdatedMethods.set(i, c.bind(o)) : "peerLeaved" in f && this.peerLeavedMethods.set(i, c.bind(o));
    }
    const y = T({
      definition: {
        objId: i,
        className: s,
        methods: u
      }
    });
    return this.doSendMessage(y), e;
  }
  createFunctionProxy(e, t, o) {
    const s = `${o}`, i = { original: e, config: t };
    this.shareOrNotifyFunctions.set(s, i), i.promise = new Promise((h, u) => {
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
  createMethodProxy(e, t, o, s) {
    const i = `${o}:${s}`, d = { original: e, config: t };
    this.shareOrNotifyMethods.set(i, d), d.promise = new Promise((u, m) => {
      d.resolve = u, d.reject = m;
    });
    const h = this;
    return function() {
      var u, m;
      if (h.ws === null) {
        if (e) return e.apply(null, [...arguments, h]);
      } else {
        let y = null, p = "BROADCAST";
        const c = h.shareObjects.get(o), a = c.revision;
        return (((u = t.share) == null ? void 0 : u.type) === "afterExec" || ((m = t.notify) == null ? void 0 : m.type) === "afterExec") && (y = e.apply(null, [...arguments, h]), t.share && (c.revision++, c.update++), p = "OTHERCAST"), h.sendMessage(L(
          p,
          {
            objId: o,
            objRevision: a,
            methodId: s,
            args: Array.from(arguments)
          }
        )), y ?? d.promise;
      }
    };
  }
  addHostOnlyFunction(e, t, o) {
    const s = this;
    return () => {
      if (s.isSelfPeerHost()) {
        if (o !== void 0) {
          const i = s.shareObjects.get(o);
          i.revision++, i.update++;
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
        (o.config.maxUpdates && o.config.maxUpdates <= t.update || o.config.maxInterval && o.config.maxInterval <= s - o.lastGet) && (this.doSendMessage(U({
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
  D as newEnterRoom,
  A as newInvokeFunction,
  L as newInvokeMethod,
  F as newLeaveRoom,
  x as newPing,
  U as newUpdateObjectState,
  R as newUpdatePeerProfile,
  w as newUpdateRoomProfile,
  P as notifyConfigDefault,
  M as shareConfigDefault
};
