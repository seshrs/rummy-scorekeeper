import { Socket } from 'socket.io-client';

import { store } from '../store';
import { isScorekeeper } from './helpers';
import {
  setGameState,
  setClaimsForCurrentRound,
  setPlayerScoreForCurrentRound,
  startNextRound,
} from '../../features/game/gameSlice';
import { setRoleToViewer } from '../../features/room/roomSlice';
import Storage from '../../utils/Storage';

export default function registerListeners(socket: typeof Socket) {
  /****************/
  /*    VIEWER    */
  /****************/

  socket.on('setGameState', (state: GameStateType) => {
    console.log('remote: setGameState', state);
    if (isScorekeeper()) {
      console.warn('Received game state even though we are the scorekeeper...');
      return;
    }

    store.dispatch(setGameState(state));
  });

  socket.on('setClaimsForCurrentRound', (claims: number) => {
    console.log('remote: setClaimsForCurrentRound', claims);
    if (isScorekeeper()) {
      console.warn('Received claims even though we are the scorekeeper...');
      return;
    }

    store.dispatch(setClaimsForCurrentRound(claims));
  });

  socket.on(
    'setPlayerScoreForCurrentRound',
    (payload: PlayerScoreUpdatePayloadType) => {
      console.log('remote: setPlayerScoreForCurrentRound', payload);
      if (isScorekeeper()) {
        console.warn(
          'Received player score even though we are the scorekeeper...',
        );
        return;
      }

      store.dispatch(setPlayerScoreForCurrentRound(payload));
    },
  );

  socket.on('startNextRound', () => {
    console.log('remote: startNextRound');
    if (isScorekeeper()) {
      console.warn(
        'Received start-round directive even though we are the scorekeeper...',
      );
      return;
    }

    store.dispatch(startNextRound());
  });

  /******************/
  /*  SCOREKEEPER   */
  /******************/

  socket.on('sendGameState', (viewerSocketId: string) => {
    console.log('remote: requesting current game state');
    if (!isScorekeeper()) {
      console.warn(
        'Received request for full game state when we are not scorekeeper...',
      );
    }

    const gameState = store.getState().game;
    socket.emit('sendGameState', viewerSocketId, gameState);
  });

  socket.on('downgradeToViewer', () => {
    console.log('remote: directing us to downgrade to viewer');
    if (!isScorekeeper()) {
      console.warn(
        'Received request to downgrade when we are not scorekeeper...',
      );
    }

    Storage.set('role', 'viewer');
    store.dispatch(setRoleToViewer());
  });
}
