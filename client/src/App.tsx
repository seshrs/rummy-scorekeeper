import React from 'react';
import { useSelector } from 'react-redux';

import { selectRoomId, selectClientRole } from './features/room/roomSlice';
import SelectRoomView from './views/SelectRoomView';
import ScorekeeperView from './views/ScorekeeperView';
import ViewerView from './views/ViewerView';

export default function App() {
  const roomId = useSelector(selectRoomId);
  const role = useSelector(selectClientRole);

  if (!roomId) {
    return <SelectRoomView />;
  } else if (role === 'scorekeeper') {
    return <ScorekeeperView />;
  } else {
    return <ViewerView />;
  }
}
