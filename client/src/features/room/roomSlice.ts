import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RoomStateType = {
  id: string;
  roomReady: boolean;
  players: Array<string>;
};

const initialState: RoomStateType = {
  id: '',
  roomReady: false,
  players: [],
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId: (state, { payload }: PayloadAction<string>) => {
      if (payload !== '') {
        state.id = payload;
        state.roomReady = true;
        state.players = ['Player 1', 'Player 2', 'Player 3']; // TODO: Need to fetch this from server
      }
    },
  },
});

export const { setRoomId } = roomSlice.actions;

// Selectors
export const selectRoomReady = ({ room }: { room: RoomStateType }) =>
  room.roomReady && room.id !== '' && room.players.length !== 0;

export default roomSlice.reducer;