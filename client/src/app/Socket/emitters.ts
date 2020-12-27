import { isScorekeeper } from './helpers';
import Storage from '../../utils/Storage';

export function joinRoom(
  roomId: string,
): Promise<{ roomId: string; role: ClientRole }> {
  const socket = require('./index.ts').default;
  return new Promise((resolve) => {
    console.log('@@@ going to emit SocketEvents.SET_ROOM_ID');
    socket.emit('setRoomId', roomId, ({ role }: { role: ClientRole }) => {
      console.log('received client role from server', { roomId, role });
      Storage.set('role', role);
      resolve({ roomId, role });
    });
  });
}

/******************/
/*  SCOREKEEPER   */
/******************/

export function setGameState(state: GameStateType) {
  emit('setGameState', state);
}

export function setClaimsForCurrentRound(claims: number) {
  emit('setClaimsForCurrentRound', claims);
}

export function setPlayerScoreForCurrentRound(
  payload: PlayerScoreUpdatePayloadType,
) {
  emit('setPlayerScoreForCurrentRound', payload);
}

export function startNextRound() {
  emit('startNextRound');
}

function emit(event: string, ...args: any[]) {
  if (!isScorekeeper()) {
    return;
  }
  const socket = require('./index.ts').default;
  socket.emit(event, ...args);
}

/*****************/
/*    VIEWER     */
/*****************/

export function upgradeToScorekeeper(): Promise<void> {
  if (isScorekeeper()) {
    console.warn(
      'attempted to upgrade to scorekeeper even though we are scorekeeper...',
    );
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    console.log('sending intent-to-upgrade notice...');
    const socket = require('./index.ts').default;
    socket.emit('upgradeToScorekeeper', () => {
      console.log('upgrading to scorekeeper...');
      Storage.set('role', 'scorekeeper');
      resolve();
    });
  });
}

export function requestGameState() {
  if (isScorekeeper()) {
    console.warn(
      'attempted to fetch game state even though we are scorekeeper...',
    );
    return;
  }

  console.log('sending request for game state');
  const socket = require('./index.ts').default;
  socket.emit('requestGameState');
}
