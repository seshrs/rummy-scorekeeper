import React from 'react';
import { useSelector } from 'react-redux';

import { selectRoomReady } from './features/room/roomSlice';
import GameView from './views/GameView';
import SelectRoomView from './views/SelectRoomView';

export default function App() {
  const roomReady = useSelector(selectRoomReady);

  if (!roomReady) {
    return <SelectRoomView />;
  } else {
    return <GameView />;
  }
}
