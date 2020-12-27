import React from 'react';
import { useSelector } from 'react-redux';

import { selectRoomId, selectClientRole } from './features/room/roomSlice';
import SelectRoomView from './views/SelectRoomView';
import ScorekeeperView from './views/ScorekeeperView';
import ViewerView from './views/ViewerView';
import Modal from './views/Modal';

export default function App() {
  const roomId = useSelector(selectRoomId);
  const role = useSelector(selectClientRole);

  let view;
  if (!roomId) {
    view = <SelectRoomView />;
  } else if (role === 'scorekeeper') {
    view = <ScorekeeperView />;
  } else {
    view = <ViewerView />;
  }

  return (
    <>
      {view}
      <Modal />
    </>
  );
}
