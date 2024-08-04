// src/utils/userSingelton.ts
import { v4 as uuidv4 } from 'uuid';

class UserSingleton {
    private static instance: UserSingleton;
    private _sender: string | undefined;
    private _receiver: string | undefined;
    private _peerConnection: { current: RTCPeerConnection | null } | null;
    private _dataChannelRef: { current: RTCDataChannel | null } | null;
    private _userName: string;
    private _friend: { name: string, uuid: string };
    private _friends: { name: string, uuid: string }[] = [];

    private constructor() {
        this._userName = '';
        this._friend = { name: '', uuid: '' };
        this._friends = [];
        this._sender = '';
        this._receiver = '';
        this._peerConnection = { current: new RTCPeerConnection() };
        this._dataChannelRef = { current: null };


    }

    public static getInstance(): UserSingleton {
        if (!UserSingleton.instance) {
            UserSingleton.instance = new UserSingleton();
        }
        return UserSingleton.instance;
    }

    // Getter and Setter for sender
    public get userName(): string {
        return this._userName;
    }
    public set userName(value: string) {
        this._userName = value;
    }
    public get sender(): string | undefined {
        return this._sender;
    }

    public set sender(value: string | undefined) {
        this._sender = value;
    }

    // Getter and Setter for receiver
    public get receiver(): string | undefined {
        return this._receiver;
    }

    public set receiver(value: string | undefined) {
        this._receiver = value;
    }
    public get friend(): { name: string, uuid: string } {
        return this._friend;
    }
    public set friend(value: { name: string, uuid: string }) {
        this._friend = value;
    }
    public get friends(): { name: string, uuid: string }[] {
        return this._friends;
    }
    public set friends(value: { name: string, uuid: string }[]) {
        this._friends = value;
    }
    // Getter and Setter for peerConnection
    public get peerConnection(): { current: RTCPeerConnection | null } | null {
        return this._peerConnection;
    }

    public set peerConnection(value: { current: RTCPeerConnection | null } | null) {
        this._peerConnection = value;
    }

    // Getter and Setter for dataChannelRef
    public get dataChannelRef(): { current: RTCDataChannel | null } | null {
        return this._dataChannelRef;
    }

    public set dataChannelRef(value: { current: RTCDataChannel | null } | null) {
        this._dataChannelRef = value;
    }

    // Method to reset connection
    public resetConnection() {
        this._peerConnection = { current: new RTCPeerConnection() };
        this._dataChannelRef = null; // or initialize as needed
    }
}

export default UserSingleton.getInstance();
