import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  selectRoomId,
  selectClientRole,
  setRoomId,
  selectServerStatus,
} from '../features/room/roomSlice';
import ScorekeeperView from './ScorekeeperView';
import ViewerView from './ViewerView';
import Modal from './Modal';
import { leaveRoom } from '../app/Socket/emitters';
import { CircularProgress, Grid } from '@material-ui/core';

const ProgressView = () => (
  <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justify="center"
    style={{ minHeight: '100vh' }}
  >
    <Grid item xs={3}>
      <CircularProgress />
    </Grid>
  </Grid>
);

// Once navigated to view container, you have two possibilities:
// 1. The room already exists and we just need to render it
// 2. The room does not exist, so we need to create it
export default function ViewContainer() {
  const roomIdInState = useSelector(selectRoomId);
  const serverStatus = useSelector(selectServerStatus);
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const role = useSelector(selectClientRole);

  React.useEffect(() => {
    if (roomIdInState) {
      const unloadHandler = () => leaveRoom(roomIdInState);
      window.addEventListener('beforeunload', unloadHandler);
      return () => {
        window.removeEventListener('beforeunload', unloadHandler);
      };
    } else {
      dispatch(setRoomId(roomId));
    }
  }, [roomIdInState, dispatch, roomId]);

  if (roomIdInState && roomIdInState !== roomId) {
    throw new Error(
      'Some catastrophic error occurred and the room you are logged in to and URL do not match',
    );
  }

  let view;
  if (
    !roomIdInState &&
    (serverStatus === 'pending' || serverStatus === 'uninitialized')
  ) {
    view = <ProgressView />;
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
