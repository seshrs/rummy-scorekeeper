import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Chance from 'chance';

import * as Remote from '../../app/Socket/emitters';

const MAX_SCORE = 500;
const chance = new Chance();

const initialState: GameStateType = {
  numPlayers: 0,
  players: [],
  claims: [],
  currentDealerIndex: 0,
};

export const gameSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayerNames: (state, { payload }: PayloadAction<Array<string>>) => {
      state.numPlayers = payload.length;
      state.players = payload.map<PlayerType>((playerName) => ({
        id: chance.guid(),
        name: playerName,
        active: true,
        lastRoundPlayed: 0,
        roundScores: [{ freeOfClaims: false, points: 0, action: null }],
        totalScore: 0,
      }));
      state.claims = [0];
      Remote.setGameState({
        numPlayers: state.numPlayers,
        players: [...state.players],
        claims: [0],
        currentDealerIndex: 0,
      });
    },

    setClaimsForCurrentRound: (state, { payload }: PayloadAction<number>) => {
      state.claims[state.claims.length - 1] = payload;
      Remote.setClaimsForCurrentRound(payload);
    },

    setPlayerScoreForCurrentRound: (
      state,
      { payload }: PayloadAction<PlayerScoreUpdatePayloadType>,
    ) => {
      const playerIndex = state.players.findIndex(
        (player) => player.id === payload.id,
      );
      if (playerIndex < 0) {
        throw new Error(
          'game reducer: setPlayerScoreForCurrentRound: Invalid player ID',
        );
      }
      state.players[playerIndex].roundScores.pop();
      state.players[playerIndex].roundScores.push(payload.score);
      Remote.setPlayerScoreForCurrentRound(payload);
    },

    startNextRound: (state) => {
      const currentRoundIndex = selectRound({ game: state }) - 1;
      const prevRoundClaims = selectCurrentRoundClaims({ game: state });

      state.claims.push(0);
      state.players = state.players.map((player) => {
        if (player.active) {
          const playerScore = player.roundScores[currentRoundIndex];
          player.lastRoundPlayed += 1;
          player.totalScore = calculateTotalScore(
            player.totalScore,
            playerScore,
            prevRoundClaims,
          );
          player.active = player.totalScore < MAX_SCORE;
        }
        player.roundScores.push({
          freeOfClaims: !player.active,
          points: 0,
          action: null,
        });
        return player;
      });

      do {
        state.currentDealerIndex =
          (state.currentDealerIndex + 1) % state.numPlayers;
      } while (!state.players[state.currentDealerIndex].active);

      Remote.startNextRound();
    },

    deleteLastRound: (state) => {
      state.claims.pop();
      const newCurrentRound = state.claims.length;

      do {
        state.currentDealerIndex = state.currentDealerIndex - 1;
        if (state.currentDealerIndex < 0) {
          state.currentDealerIndex = state.players.length - 1;
        }
      } while (!state.players[state.currentDealerIndex].active);

      state.players = state.players.map((player) => {
        player.roundScores.pop();

        if (player.lastRoundPlayed !== newCurrentRound) {
          // The player was not active in the newCurrentRound
          // so do nothing.
        } else {
          player.lastRoundPlayed -= 1;
        }

        const score = player.roundScores[newCurrentRound - 1];
        const deletedClaims = state.claims[newCurrentRound - 1];
        if (!score.freeOfClaims && score.action !== 'win') {
          player.totalScore -= score.points || 0;
          player.totalScore -= deletedClaims || 0;
          player.active = player.totalScore < MAX_SCORE;
        }
        return player;
      });

      Remote.setGameState({
        numPlayers: state.numPlayers,
        players: [...state.players],
        claims: [...state.claims],
        currentDealerIndex: 0,
      });
    },

    /**
     * Consider using other reducers instead, this is meant for remote updates.
     */
    setGameState: (state, { payload }: PayloadAction<GameStateType>) => {
      state.numPlayers = payload.numPlayers;
      state.players = payload.players;
      state.claims = payload.claims;
      state.currentDealerIndex = payload.currentDealerIndex;
    },
  },
});

function calculateTotalScore(
  previousScore: number,
  nextRoundScore: RoundScoreType,
  claims: number,
) {
  if (nextRoundScore.freeOfClaims) {
    return previousScore;
  }
  if (nextRoundScore.points == null) {
    throw new Error('calculateTotalScore: expected non-null points');
  }
  return previousScore + nextRoundScore.points + claims;
}

export const {
  setPlayerNames,
  setClaimsForCurrentRound,
  setPlayerScoreForCurrentRound,
  startNextRound,
  deleteLastRound,
  setGameState,
} = gameSlice.actions;

// Selectors
export const selectGameHasBegun = ({ game }: { game: GameStateType }) =>
  game.players.length !== 0;
export const selectRound = ({ game }: { game: GameStateType }) =>
  game.claims.length;
export const selectCurrentDealerIndex = ({ game }: { game: GameStateType }) =>
  game.currentDealerIndex;
export const selectClaims = ({ game }: { game: GameStateType }) => game.claims;
export const selectPlayers = ({ game }: { game: GameStateType }) =>
  game.players;
export const selectCurrentRoundClaims = ({ game }: { game: GameStateType }) =>
  game.claims[game.claims.length - 1];
export const selectNumActivePlayers = ({ game }: { game: GameStateType }) =>
  game.players.reduce(
    (numActivePlayers, player) =>
      player.active ? numActivePlayers + 1 : numActivePlayers,
    0,
  );
export const selectIsGameOver = ({ game }: { game: GameStateType }) =>
  selectNumActivePlayers({ game }) === 1;
export const selectCurrentRoundOver = ({ game }: { game: GameStateType }) => {
  const currentRoundIndex = selectRound({ game }) - 1;
  return game.players.some(
    (player) => player.roundScores[currentRoundIndex].action === 'win',
  );
};
export const selectAreCurrentRoundScoresValid = ({
  game,
}: {
  game: GameStateType;
}) => {
  const currentRoundIndex = selectRound({ game }) - 1;
  const winners = game.players.filter(
    (player) => player.roundScores[currentRoundIndex].action === 'win',
  );
  if (winners.length !== 1 || !winners[0].active) {
    // There should be exactly 1 winner and they should be active
    return false;
  }
  if (
    game.claims[currentRoundIndex] < 0 ||
    game.claims[currentRoundIndex] % 10 !== 0
  ) {
    // The claims should be a non-negative multiple of 10
    return false;
  }
  for (const player of game.players) {
    if (player.active) {
      const currentScore = player.roundScores[currentRoundIndex];
      if (!currentScore.freeOfClaims && currentScore.points == null) {
        // Each player's score must be non-null if they aren't free of claims
        return false;
      }
      if (currentScore.action === 'scoot' && currentScore.points !== 30) {
        // Beginning scoot points should be 30
        return false;
      }
      if (currentScore.action === 'middleScoot' && currentScore.points !== 60) {
        // Beginning scoot points should be 30
        return false;
      }
      if (currentScore.action === 'win' && !currentScore.freeOfClaims) {
        // Winners should be marked as being free of claims
        return false;
      }
    }
  }
  return true;
};

export default gameSlice.reducer;
