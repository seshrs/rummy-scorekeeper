import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  joinRoom,
  upgradeToScorekeeper,
  requestGameState,
} from '../../app/Socket/emitters';

type RoomStateType = {
  id: string;
  role: ClientRole;
  serverStatus: ServerResponseStatus;
};

const initialState: RoomStateType = {
  id: '',
  role: 'viewer',
  serverStatus: 'uninitialized',
};

export const setRoomId = createAsyncThunk('room/setRoomId', joinRoom);
export const setRoleToScorekeeper = createAsyncThunk(
  'room/setRoleToScorekeeper',
  upgradeToScorekeeper,
);

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoleToViewer: (state) => {
      state.role = 'viewer';
      requestGameState();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setRoomId.fulfilled, (state, { payload }) => {
      state.id = payload.roomId;
      state.role = payload.role;
      state.serverStatus = 'ready';
    });
    builder.addCase(setRoomId.pending, (state) => {
      state.serverStatus = 'pending';
    });
    builder.addCase(setRoomId.rejected, (state) => {
      console.error('roomSlice: Failed to set room ID due to server error');
      state.serverStatus = 'error';
      state.id = '';
      state.role = 'viewer';
    });

    builder.addCase(setRoleToScorekeeper.fulfilled, (state) => {
      state.role = 'scorekeeper';
    });
    builder.addCase(setRoleToScorekeeper.rejected, () => {
      console.log('roomSlice: Failed to upgrade to scorekeeper');
    });
  },
});

export const { setRoleToViewer } = roomSlice.actions;

// Selectors
export const selectRoomId = ({ room }: { room: RoomStateType }) =>
  room.id !== '' && room.serverStatus === 'ready' ? room.id : null;
export const selectIsServerPending = ({ room }: { room: RoomStateType }) =>
  room.serverStatus === 'pending';
export const selectClientRole = ({ room }: { room: RoomStateType }) =>
  selectRoomId({ room }) == null ? null : room.role;

export const selectServerStatus = ({ room }: { room: RoomStateType }) =>
  room.serverStatus;

export default roomSlice.reducer;
