import { TypedCustomEventListenerOrObject, TypedCustomEventTarget } from "tcet";
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
export interface RoomInfo {
    id: string;
    spec: RoomSpec;
    profile: {
        [key: string]: any;
    };
}
export interface PeerInfo {
    id: string;
    order: number;
    profile: {
        [key: string]: any;
    };
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
export declare function newPing(body?: undefined): Ping;
export interface Pong extends ServerToPeerMessage {
    type: "Pong";
    body: object | undefined;
}
export interface EnterRoomBody {
    room?: {
        spec: RoomSpec;
        profile: {
            [key: string]: any;
        };
    };
    selfPeer?: PeerInfo;
}
export interface EnterRoom extends PeerToServerMessage, EnterRoomBody {
    type: "EnterRoom";
}
export declare function newEnterRoom(body: EnterRoomBody): EnterRoom;
export interface EnterRoomAllowed extends ServerToPeerMessage {
    type: "EnterRoomAllowed";
    room: RoomInfo;
    selfPeer: PeerInfo;
    otherPeers: PeerInfo[];
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
export declare function newLeaveRoom(body: LeaveRoomBody): LeaveRoom;
export interface LeaveRoomDone extends ServerToPeerMessage {
    type: "LeaveRoomDone";
}
export interface UpdateRoomProfileBody {
    updates?: {
        [key: string]: any;
    };
    deletes?: string[];
}
export interface UpdateRoomProfile extends BroadcastMessage, UpdateRoomProfileBody {
    type: "UpdateRoomProfile";
}
export declare function newUpdateRoomProfile(body: UpdateRoomProfileBody): UpdateRoomProfile;
export interface PeerEntered extends ServerToPeerMessage {
    type: "PeerEntered";
    peer: PeerInfo;
}
export interface PeerLeaved extends ServerToPeerMessage {
    type: "PeerLeaved";
    peerId: string;
}
export interface UpdatePeerProfileBody {
    updates?: {
        [key: string]: any;
    };
    deletes?: string[];
}
export interface UpdatePeerProfile extends BroadcastMessage, UpdatePeerProfileBody {
    type: "UpdatePeerProfile";
}
export declare function newUpdatePeerProfile(body: UpdatePeerProfileBody): UpdatePeerProfile;
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
export declare function newDefineFunction(body: DefineFunctionBody): DefineFunction;
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
export declare function newDefineObject(body: DefineObjectBody): DefineObject;
export interface InvokeFunctionBody {
    funcId: number;
    args: any[];
}
export interface InvokeFunction extends BroadcastOrOthercastMessage, InvokeFunctionBody {
    type: "InvokeFunction";
}
export declare function newInvokeFunction(castType: "BROADCAST" | "OTHERCAST", body: InvokeFunctionBody): InvokeFunction;
export interface UpdateObjectStateBody {
    objId: number;
    objRevision: number;
    state: string;
}
export interface UpdateObjectState extends PeerToServerMessage {
    type: "UpdateObjectState";
}
export declare function newUpdateObjectState(body: UpdateObjectStateBody): UpdateObjectState;
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
export declare function newInvokeMethod(castType: "BROADCAST" | "OTHERCAST", body: InvokeMethodBody): InvokeMethod;
export interface UserMessage<C> extends Message {
    content: C;
}
export type UpstreamMessageType = Ping | EnterRoom | LeaveRoom | UpdateRoomProfile | UpdatePeerProfile | DefineFunction | DefineObject | InvokeFunction | UpdateObjectState | InvokeMethod;
export type DownStreamMessageType = Pong | EnterRoomAllowed | EnterRoomDenied | LeaveRoomDone | UpdateRoomProfile | PeerEntered | PeerLeaved | UpdatePeerProfile | InvokeFunction | UpdateObjectState | InvokeMethod | UserMessage<any>;
export type StoredMessageType = InvokeMethod | InvokeFunction | UpdateObjectState;
export interface DecoratedMethod {
    madoiMethodConfig_: MethodConfig;
}
export declare function ShareClass(config?: {
    className?: string;
}): (target: any) => void;
export interface ShareConfig {
    type?: "beforeExec" | "afterExec";
    maxLog?: number;
    allowedTo?: string[];
    update?: {
        freq?: number;
        interpolateBy?: number;
        reckonUntil?: number;
    };
}
export declare function Share(config?: ShareConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface NotifyConfig {
    type?: "beforeExec" | "afterExec";
}
export declare function Notify(config?: NotifyConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface GetStateConfig {
    maxInterval?: number;
    maxUpdates?: number;
}
export declare function GetState(config?: GetStateConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface SetStateConfig {
}
export declare function SetState(config?: SetStateConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface HostOnlyConfig {
}
export declare function HostOnly(config?: HostOnlyConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface BeforeEnterRoomConfig {
}
export declare function BeforeEnterRoom(config?: BeforeEnterRoomConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface EnterRoomAllowedConfig {
}
export declare function EnterRoomAllowed(config?: EnterRoomAllowedConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface EnterRoomDeniedConfig {
}
export declare function EnterRoomDenied(config?: EnterRoomDeniedConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface LeaveRoomDoneConfig {
}
export declare function LeaveRoomDone(config?: LeaveRoomDoneConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface RoomProfileUpdatedConfig {
}
export declare function RoomProfileUpdated(config?: RoomProfileUpdatedConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface PeerEnteredConfig {
}
export declare function PeerEntered(config?: PeerEnteredConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface PeerLeavedConfig {
}
export declare function PeerLeaved(config?: PeerLeavedConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface PeerProfileUpdatedConfig {
}
export declare function PeerProfileUpdated(config?: PeerProfileUpdatedConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface UserMessageArrivedConfig {
    type: string;
}
export declare function UserMeesageArrived(config: UserMessageArrivedConfig): (target: any, name: string, _descriptor: PropertyDescriptor) => void;
export interface MethodConfig {
    share?: ShareConfig;
    notify?: NotifyConfig;
    hostOnly?: HostOnlyConfig;
    getState?: GetStateConfig;
    setState?: SetStateConfig;
    beforeEnterRoom?: BeforeEnterRoomConfig;
    enterRoomAllowed?: EnterRoomAllowedConfig;
    enterRoomDenied?: EnterRoomDeniedConfig;
    leaveRoomDone?: LeaveRoomDoneConfig;
    roomProfileUpdated?: RoomProfileUpdatedConfig;
    peerEntered?: PeerEnteredConfig;
    peerLeaved?: PeerLeavedConfig;
    peerProfileUpdated?: PeerProfileUpdatedConfig;
    userMessageArrived?: UserMessageArrivedConfig;
}
export declare const shareConfigDefault: ShareConfig;
export declare const notifyConfigDefault: NotifyConfig;
export declare const getStateConfigDefault: GetStateConfig;
export declare const setStateConfigDefault: SetStateConfig;
export declare const hostOnlyConfigDefault: HostOnlyConfig;
export declare const beforeEnterRoomConfigDefault: BeforeEnterRoomConfig;
export declare const enterRoomAllowedConfigDefault: EnterRoomAllowedConfig;
export declare const enterRoomDeniedConfigDefault: EnterRoomDeniedConfig;
export declare const leaveRoomDoneConfigDefault: LeaveRoomDoneConfig;
export declare const roomProfileUpdatedConfigDefault: RoomProfileUpdatedConfig;
export declare const peerEnteredConfigDefault: PeerEnteredConfig;
export declare const peerLeavedConfigDefault: PeerLeavedConfig;
export declare const peerProfileUpdatedConfigDefault: PeerProfileUpdatedConfig;
export declare const userMessageArrivedConfigDefault: {};
export type MethodAndConfigParam = {
    method: Function;
} & MethodConfig;
export interface EnterRoomAllowedDetail {
    room: RoomInfo;
    selfPeer: PeerInfo;
    otherPeers: PeerInfo[];
}
export type EnterRoomAllowedListenerOrObject = TypedCustomEventListenerOrObject<Madoi, EnterRoomAllowedDetail>;
export interface EnterRoomDeniedDetail {
    message: string;
}
export type EnterRoomDeniedListenerOrObject = TypedCustomEventListenerOrObject<Madoi, EnterRoomDeniedDetail>;
export interface LeaveRoomDoneDetail {
}
export type LeaveRoomDoneListenerOrObject = TypedCustomEventListenerOrObject<Madoi, LeaveRoomDoneDetail>;
export interface RoomProfileUpdatedDetail {
    updates?: {
        [key: string]: any;
    };
    deletes?: string[];
}
export type RoomProfileUpdatedListenerOrObject = TypedCustomEventListenerOrObject<Madoi, RoomProfileUpdatedDetail>;
export interface PeerEnteredDetail {
    peer: PeerInfo;
}
export type PeerEnteredListenerOrObject = TypedCustomEventListenerOrObject<Madoi, PeerEnteredDetail>;
export interface PeerLeavedDetail {
    peerId: string;
}
export type PeerLeavedListenerOrObject = TypedCustomEventListenerOrObject<Madoi, PeerLeavedDetail>;
export interface PeerProfileUpdatedDetail {
    peerId: string;
    updates?: {
        [key: string]: any;
    };
    deletes?: string[];
}
export type PeerProfileUpdatedListenerOrObject = TypedCustomEventListenerOrObject<Madoi, PeerProfileUpdatedDetail>;
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
export type ErrorListenerOrObject = TypedCustomEventListenerOrObject<Madoi, ErrorDetail>;
export type UserMessageListenerOrObject<D> = TypedCustomEventListenerOrObject<Madoi, UserMessageDetail<D>> | null;
export declare class Madoi extends TypedCustomEventTarget<Madoi, {
    enterRoomAllowed: EnterRoomAllowedDetail;
    enterRoomDenied: EnterRoomDeniedDetail;
    leaveRoomDone: LeaveRoomDoneDetail;
    roomProfileUpdated: RoomProfileUpdatedDetail;
    peerEntered: PeerEnteredDetail;
    peerProfileUpdated: PeerProfileUpdatedDetail;
    peerLeaved: PeerLeavedDetail;
    error: ErrorDetail;
}> {
    private connecting;
    private interimQueue;
    private shareOrNotifyFunctions;
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
    private peers;
    private currentSenderId;
    constructor(roomIdOrUrl: string, authToken: string, selfPeer?: {
        id: string;
        profile: {
            [key: string]: any;
        };
    }, room?: {
        spec: RoomSpec;
        profile: {
            [key: string]: any;
        };
    });
    getRoomId(): string;
    getRoomProfile(): {
        [key: string]: any;
    };
    setRoomProfile(name: string, value: any): void;
    removeRoomProfile(name: string): void;
    getSelfPeerId(): string;
    getSelfPeerProfile(): {
        [key: string]: any;
    };
    updateSelfPeerProfile(name: string, value: any): void;
    removeSelfPeerProfile(name: string): void;
    isMessageProcessing(): boolean;
    getCurrentSender(): PeerInfo | null | undefined;
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
    addReceiver<D>(type: string, listener: UserMessageListenerOrObject<D>): void;
    removeReceiver<D>(type: string, listener: UserMessageListenerOrObject<D>): void;
    private replacer;
    private doSendMessage;
    registerFunction<T extends Function>(func: T, config?: MethodConfig): T;
    register<T>(object: T, methodAndConfigs?: MethodAndConfigParam[]): T;
    private createFunctionProxy;
    private createMethodProxy;
    private addHostOnlyFunction;
    saveStates(): void;
    private applyInvocation;
    private isSelfPeerHost;
}
export {};
//# sourceMappingURL=madoi.d.ts.map