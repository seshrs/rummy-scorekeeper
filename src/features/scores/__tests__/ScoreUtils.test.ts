import { sortPlayers } from '../ScoreUtils';

type MockPlayerInputType = {
  id: string;
  active: boolean;
  totalScore: number;
  lastRoundPlayed: number;
};

describe('ScoreUtils', () => {
  describe('sortPlayers', () => {
    const createMockPlayer: (input: MockPlayerInputType) => PlayerType = (
      input,
    ) => ({
      name: 'Baked Beans',
      roundScores: [],
      ...input,
    });

    test('list with single player', () => {
      const mockPlayer = createMockPlayer({
        id: 'Mock Player',
        active: true,
        totalScore: 0,
        lastRoundPlayed: 1,
      });
      expect(sortPlayers([mockPlayer])).toEqual([mockPlayer]);
    });

    test('list with multiple active players', () => {
      // Last round played should be ignored
      const player1 = createMockPlayer({
        id: 'Player 1',
        active: true,
        totalScore: 20,
        lastRoundPlayed: 3,
      });
      const player2 = createMockPlayer({
        id: 'Player 2',
        active: true,
        totalScore: 100,
        lastRoundPlayed: 2,
      });
      const player3 = createMockPlayer({
        id: 'Player 3',
        active: true,
        totalScore: 50,
        lastRoundPlayed: 2,
      });

      expect(sortPlayers([player1, player2, player3])).toEqual([
        player1,
        player3,
        player2,
      ]);
    });

    test('list with multiple inactive players', () => {
      // Last round played should be ignored
      const player1 = createMockPlayer({
        id: 'Player 1',
        active: false,
        totalScore: 20,
        lastRoundPlayed: 3,
      });
      const player2 = createMockPlayer({
        id: 'Player 2',
        active: false,
        totalScore: 100,
        lastRoundPlayed: 2,
      });
      const player3 = createMockPlayer({
        id: 'Player 3',
        active: false,
        totalScore: 50,
        lastRoundPlayed: 2,
      });

      expect(sortPlayers([player1, player2, player3])).toEqual([
        player1,
        player3,
        player2,
      ]);
    });

    test('list with mix of active and inactive players', () => {
      // Last round played should be ignored
      const player1 = createMockPlayer({
        id: 'Player 1',
        active: false,
        totalScore: 250,
        lastRoundPlayed: 3,
      });
      const player2 = createMockPlayer({
        id: 'Player 2',
        active: false,
        totalScore: 200,
        lastRoundPlayed: 2,
      });
      const player3 = createMockPlayer({
        id: 'Player 3',
        active: true,
        totalScore: 400,
        lastRoundPlayed: 5,
      });
      const player4 = createMockPlayer({
        id: 'Player 4',
        active: true,
        totalScore: 0,
        lastRoundPlayed: 5,
      });

      expect(sortPlayers([player1, player2, player3, player4])).toEqual([
        player4,
        player3,
        player1,
        player2,
      ]);
    });
  });
});
