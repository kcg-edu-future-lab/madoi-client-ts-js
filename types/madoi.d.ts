import { CustomEventListenerOrEventListenerObject, KeyOf, TypedCustomEventTarget } from "tcet";
export type CastType = "UNICAST" | "MULTICAST" | "BROADCAST" | "SELFCAST" | "OTHERCAST" | "PEERTOSERVER" | "SERVERTOPEER";
export interface Message {
    type: string;
    sender: string;
    castType: CastType;
    recipients: string[] | undefined;
    [name: string]: any;
}
export interface RoomSpec {
    maxLog: number;
}
type ProfileValue = object | number | string | undefined;
export type Profile = {
    [key: string]: ProfileValue;
};
export interface RoomInfo<T extends Profile> {
    id: string;
    spec: RoomSpec;
    profile: T;
}
export interface PeerInfo<T extends Profile> {
    id: string;
    order: number;
    profile: T;
}
export interface ServerToPeerMessage extends Message {
    sender: "__SERVER__";
    castType: "SERVERTOPEER";
    recipients: undefined;
}
export interface PeerToServerMessage extends Message {
    castType: "PEERTOSERVER";
    recipients: undefined;
}
export interface PeerToPeerMessage extends Message {
    castType: "UNICAST" | "MULTICAST" | "BROADCAST" | "SELFCAST" | "OTHERCAST";
}
export interface BroadcastMessage extends PeerToPeerMessage {
    castType: "BROADCAST";
    recipients: undefined;
}
export interface BroadcastOrOthercastMessage extends PeerToPeerMessage {
    castType: "BROADCAST" | "OTHERCAST";
    recipients: undefined;
}
export interface Ping extends PeerToServerMessage {
    type: "Ping";
    body: object | undefined;
}
export interface Pong extends ServerToPeerMessage {
    type: "Pong";
    body: object | undefined;
}
export interface EnterRoomBody<TP extends Profile, TR extends Profile> {
    room: {
        spec: RoomSpec;
        profile: TR;
    };
    selfPeer: PeerInfo<TP>;
}
export interface EnterRoom<TP extends Profile, TR extends Profile> extends PeerToServerMessage, EnterRoomBody<TP, TR> {
    type: "EnterRoom";
}
export interface EnterRoomAllowed<TP extends Profile, TR extends Profile> extends ServerToPeerMessage {
    type: "EnterRoomAllowed";
    room: RoomInfo<TR>;
    selfPeer: PeerInfo<TP>;
    otherPeers: PeerInfo<TP>[];
    histories: StoredMessageType[];
}
export interface EnterRoomDenied extends ServerToPeerMessage {
    type: "EnterRoomDenied";
    message: string;
}
export interface LeaveRoomBody {
}
export interface LeaveRoom extends PeerToServerMessage, LeaveRoomBody {
    type: "LeaveRoom";
}
export interface LeaveRoomDone extends ServerToPeerMessage {
    type: "LeaveRoomDone";
}
interface UpdateRoomProfileBody<T extends Profile> {
    updates?: Partial<T>;
    deletes?: KeyOf<T>[];
}
export interface UpdateRoomProfile<T extends Profile> extends BroadcastMessage, UpdateRoomProfileBody<T> {
    type: "UpdateRoomProfile";
}
export interface PeerEntered<T extends Profile> extends ServerToPeerMessage {
    type: "PeerEntered";
    peer: PeerInfo<T>;
}
export interface PeerLeaved extends ServerToPeerMessage {
    type: "PeerLeaved";
    peerId: string;
}
export interface UpdatePeerProfileBody<T extends Profile> {
    updates?: Partial<T>;
    deletes?: KeyOf<T>[];
}
export interface UpdatePeerProfile<T extends Profile> extends BroadcastMessage, UpdatePeerProfileBody<T> {
    type: "UpdatePeerProfile";
}
export interface FunctionDefinition {
    funcId: number;
    name: string;
    config: MethodConfig;
}
export interface DefineFunctionBody {
    definition: FunctionDefinition;
}
export interface DefineFunction extends PeerToServerMessage, DefineFunctionBody {
    type: "DefineFunction";
}
export interface MethodDefinition {
    methodId: number;
    name: string;
    config: MethodConfig;
}
export interface ObjectDefinition {
    objId: number;
    className: string;
    methods: MethodDefinition[];
}
export interface DefineObjectBody {
    definition: ObjectDefinition;
}
export interface DefineObject extends PeerToServerMessage, DefineObjectBody {
    type: "DefineObject";
}
export interface InvokeFunctionBody {
    funcId: number;
    args: any[];
}
export interface InvokeFunction extends BroadcastOrOthercastMessage, InvokeFunctionBody {
    type: "InvokeFunction";
}
export interface UpdateObjectStateBody {
    objId: number;
    objRevision: number;
    state: string;
}
export interface UpdateObjectState extends PeerToServerMessage {
    type: "UpdateObjectState";
}
export interface InvokeMethodBody {
    objId: number;
    objRevision: number;
    methodId: number;
    args: any[];
    serverObjRevision?: number;
}
export interface InvokeMethod extends BroadcastOrOthercastMessage, InvokeMethodBody {
    type: "InvokeMethod";
}
export interface UserMessage<C> extends Message {
    content: C;
}
export type UpstreamMessageType<TP extends Profile, TR extends Profile> = Ping | EnterRoom<TP, TR> | LeaveRoom | UpdateRoomProfile<Profile> | UpdatePeerProfile<Profile> | DefineFunction | DefineObject | InvokeFunction | UpdateObjectState | InvokeMethod;
export type DownStreamMessageType<TP extends Profile, TR extends Profile> = Pong | EnterRoomAllowed<TP, TR> | EnterRoomDenied | LeaveRoomDone | UpdateRoomProfile<Profile> | PeerEntered<TP> | PeerLeaved | UpdatePeerProfile<TP> | InvokeFunction | UpdateObjectState | InvokeMethod | UserMessage<any>;
export type StoredMessageType = InvokeMethod | InvokeFunction | UpdateObjectState;
type MethodConfig = {
    beforeEnterRoom?: {};
    enterRoomAllowed?: {};
    enterRoomDenied?: {};
    leaveRoomDone?: {};
    roomProfileUpdated?: {};
    peerEntered?: {};
    peerLeaved?: {};
    peerProfileUpdated?: {};
    userMessageArrived?: {
        type: string;
    };
    distributed?: DistributedConfig;
    changeState?: {};
    getState?: GetStateConfig;
    setState?: {};
    hostOnly?: {};
};
export interface DecoratedMethod extends FunctionConstructor {
    madoiMethodConfig_: MethodConfig;
}
export declare function ClassName(name: string): (target: any, _context: ClassDecoratorContext) => void;
interface DistributedConfig {
    /**
     * 実行の順序付けを行うかどうか。trueを指定すると、同じルームに参加しているアプリケーション間でメソッドが同時に実行されても、
     * 常に同じ順序で実行される。順序づけは、通常、実行要求を一旦サーバに送信してサーバに届いた順に実行要求を各アプリケーションに一斉送信し、
     * 受信するとメソッドを実行する、という仕組みで実現される。
     */
    serialized: boolean;
}
export declare function Distributed(config?: DistributedConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export declare function ChangeState(): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface GetStateConfig {
    /**
     * 最初の変更から最大何ミリ秒経過すると変更の取得と送信を行うか。default: 5000。
     */
    maxInterval?: number;
    /**
     * 最後の変更から何ミリ秒経過すると変更の取得と送信を行うか。default: 3000。
     */
    minInterval?: number;
}
export declare function GetState(config?: GetStateConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface SetStateConfig {
}
export declare function SetState(): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export declare function HostOnly(): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export declare function BeforeEnterRoom(): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export declare function EnterRoomAllowed(): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export declare function EnterRoomDenied(): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export declare function LeaveRoomDone(): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export declare function RoomProfileUpdated(): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export declare function PeerEntered(): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export declare function PeerLeaved(): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export declare function PeerProfileUpdated(): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface UserMessageArrivedConfig {
    type: string;
}
export declare function UserMessageArrived(type: string): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export type MethodAndConfigParam = {
    method: Function;
} & MethodConfig;
export interface EnterRoomAllowedDetail<TP extends Profile, TR extends Profile> {
    room: RoomInfo<TR>;
    selfPeer: PeerInfo<TP>;
    otherPeers: PeerInfo<TP>[];
}
export interface EnterRoomDeniedDetail {
    message: string;
}
export interface RoomProfileUpdatedDetail<T extends Profile> {
    updates?: Partial<T>;
    deletes?: KeyOf<T>[];
}
export interface PeerEnteredDetail<T extends Profile> {
    peer: PeerInfo<T>;
}
export interface PeerLeavedDetail {
    peerId: string;
}
export interface PeerProfileUpdatedDetail<T extends Profile> {
    peerId: string;
    updates?: Partial<T>;
    deletes?: KeyOf<T>[];
}
export interface UserMessageDetail<T> {
    type: string;
    sender?: string;
    castType?: CastType;
    recipients?: string[];
    content: T;
}
interface ErrorDetail {
    error: any;
}
interface InitialRoomInfo<T extends Profile> {
    spec?: RoomSpec;
    profile: T;
}
interface InitialPeerInfo<T extends Profile> {
    id?: string;
    profile: T;
}
export declare const PEERINFO_DEFAULT: {
    profile: {};
};
export declare const ROOMINFO_DEFAULT: {
    profile: {};
};
export declare class Madoi<TP extends Profile = {}, TR extends Profile = {}> extends TypedCustomEventTarget<Madoi<TP, TR>, {
    enterRoomAllowed: EnterRoomAllowedDetail<TP, TR>;
    enterRoomDenied: EnterRoomDeniedDetail;
    leaveRoomDone: void;
    roomProfileUpdated: RoomProfileUpdatedDetail<TR>;
    peerEntered: PeerEnteredDetail<TP>;
    peerProfileUpdated: PeerProfileUpdatedDetail<TP>;
    peerLeaved: PeerLeavedDetail;
    error: ErrorDetail;
}> {
    private connecting;
    private interimQueue;
    private distributedFuncs;
    private shareObjects;
    private shareOrNotifyMethods;
    private getStateMethods;
    private setStateMethods;
    private beforeEnterRoomMethods;
    private enterRoomAllowedMethods;
    private enterRoomDeniedMethods;
    private leaveRoomDoneMethods;
    private roomProfileUpdatedMethods;
    private peerEnteredMethods;
    private peerLeavedMethods;
    private peerProfileUpdatedMethods;
    private userMessageArrivedMethods;
    private url;
    private ws;
    private room;
    private selfPeer;
    private otherPeers;
    private currentSenderId;
    constructor(roomIdOrUrl: string, authToken: string, peerInfo: InitialPeerInfo<TP>, roomInfo: InitialRoomInfo<TR>);
    getRoom(): RoomInfo<TR>;
    updateRoomProfile(name: KeyOf<TR>, value: ProfileValue): void;
    removeRoomProfile(name: KeyOf<TR>): void;
    getSelfPeer(): PeerInfo<TP>;
    updateSelfPeerProfile<Name extends KeyOf<TP>>(name: Name, value: TP[Name]): void;
    removeSelfPeerProfile(name: string): void;
    getOtherPeers(): PeerInfo<TP>[];
    isMessageProcessing(): boolean;
    getCurrentSender(): PeerInfo<TP> | null | undefined;
    isCurrentSenderSelf(): boolean;
    close(): void;
    private sendPing;
    private handleOnOpen;
    private handleOnClose;
    private handleOnError;
    private handleOnMessage;
    private data;
    private systemMessageTypes;
    private isSystemMessageType;
    send(type: string, content: any, castType?: "BROADCAST" | "SELFCAST" | "OTHERCAST" | "PEERTOSERVER"): void;
    unicast(type: string, content: any, recipient: string): void;
    multicast(type: string, content: any, recipients: string[]): void;
    broadcast(type: string, content: any): void;
    othercast(type: string, content: any): void;
    sendMessage(msg: Message): void;
    addReceiver<D>(type: string, listener: CustomEventListenerOrEventListenerObject<D>): void;
    removeReceiver<D>(type: string, listener: CustomEventListenerOrEventListenerObject<D>): void;
    private replacer;
    private doSendMessage;
    registerFunction<T extends Function>(func: T, config?: MethodConfig): T;
    register<T>(object: T, methodAndConfigs?: MethodAndConfigParam[]): T;
    private createFunctionProxy;
    private createMethodProxy;
    private addHostOnlyFunction;
    private objectChanged;
    saveStates(): void;
    private applyInvocation;
    private isSelfPeerHost;
}
export {};
//# sourceMappingURL=madoi.d.ts.map