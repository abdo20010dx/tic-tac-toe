// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  searching: boolean;
  userName: string;
  sender: string | undefined;
  receiver: string | undefined;
  peerConnection: { current: RTCPeerConnection | null } | null;
  dataChannelRef: { current: RTCDataChannel | null } | null;
  friend: { name: string, uuid: string };
  friends: { name: string, uuid: string }[];
}

const initialState: UserState = {
  searching: false,
  userName: '',
  sender: undefined,
  receiver: undefined,
  peerConnection: { current: null },
  dataChannelRef: { current: null },
  friend: { name: '', uuid: '' },
  friends: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSearching(state, action: PayloadAction<boolean>) {
      state.searching = action.payload;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.userName = action.payload;
    },
    setSender(state, action: PayloadAction<string | undefined>) {
      state.sender = action.payload;
    },
    setReceiver(state, action: PayloadAction<string | undefined>) {
      state.receiver = action.payload;
    },
    setFriend(state, action: PayloadAction<{ name: string; uuid: string }>) {
      state.friend = action.payload;
    },
    setFriends(state, action: PayloadAction<{ name: string; uuid: string }[]>) {
      state.friends = action.payload
    },
    setPeerConnection(state, action: PayloadAction<{ current: RTCPeerConnection | null } | null>) {
      state.peerConnection = action.payload;
    },
    setDataChannelRef(state, action: PayloadAction<{ current: RTCDataChannel | null } | null>) {
      state.dataChannelRef = action.payload;
    },
    resetConnection(state) {
      state.peerConnection = { current: null };
      state.dataChannelRef = { current: null };
    },
  },
});

export const {
  setSearching,
  setUserName,
  setSender,
  setReceiver,
  setFriend,
  setFriends,
  setPeerConnection,
  setDataChannelRef,
  resetConnection,
} = userSlice.actions;

export default userSlice.reducer;
