import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Chance from 'chance';

import { RootState } from '../../app/store';

type GameStateType = {
  numPlayers: number;
  players: Array<PlayerType>;
  claims: Array<number>;
  currentDealerIndex: number;
};

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
    },

    setClaimsForCurrentRound: (state, { payload }: PayloadAction<number>) => {
      state.claims[state.claims.length - 1] = payload;
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
          player.roundScores.push({
            freeOfClaims: false,
            points: 0,
            action: null,
          });
        }
        // TODO: Determine if we should add a round score for inactive players
        return player;
      });

      do {
        state.currentDealerIndex =
          (state.currentDealerIndex + 1) % state.numPlayers;
      } while (!state.players[state.currentDealerIndex].active);
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
} = gameSlice.actions;

// Selectors
export const selectGameHasBegun = (state: RootState) =>
  state.game.players.length !== 0;
export const selectRound = (state: RootState) => state.game.claims.length;
export const selectCurrentDealerIndex = (state: RootState) =>
  state.game.currentDealerIndex;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectCurrentRoundClaims = (state: RootState) =>
  state.game.claims[state.game.claims.length - 1];
export const selectCurrentRoundOver = (state: RootState) => {
  const currentRoundIndex = selectRound(state) - 1;
  return state.game.players.some(
    (player) => player.roundScores[currentRoundIndex].action === 'win',
  );
};
export const selectAreCurrentRoundScoresValid = (state: RootState) => {
  const currentRoundIndex = selectRound(state) - 1;
  const winners = state.game.players.filter(
    (player) => player.roundScores[currentRoundIndex].action === 'win',
  );
  if (winners.length !== 1 || !winners[0].active) {
    // There should be exactly 1 winner and they should be active
    return false;
  }
  if (
    state.game.claims[currentRoundIndex] < 0 ||
    state.game.claims[currentRoundIndex] % 10 !== 0
  ) {
    // The claims should be a non-negative multiple of 10
    return false;
  }
  for (const player of state.game.players) {
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
