import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { joinRoom } from '../../app/Socket';

type RoomStateType = {
  id: string;
  role: ClientRole;
  serverStatus: ServerResponseStatus;
};

const initialState: RoomStateType = {
  id: '',
  role: 'viewer',
  serverStatus: 'ready',
};

export const setRoomId = createAsyncThunk('room/setRoomId', joinRoom);

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
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
      state.serverStatus = 'ready';
      state.id = '';
      state.role = 'viewer';
    });
  },
});

// Selectors
export const selectRoomId = ({ room }: { room: RoomStateType }) =>
  room.id !== '' && room.serverStatus === 'ready' ? room.id : null;
export const selectIsServerPending = ({ room }: { room: RoomStateType }) =>
  room.serverStatus === 'pending';
export const selectClientRole = ({ room }: { room: RoomStateType }) =>
  selectRoomId({ room }) == null ? null : room.role;

export default roomSlice.reducer;
