declare type PlayerType = {
  id: string;
  name: string;
  active: boolean;
  lastRoundPlayed: number;
  roundScores: Array<RoundScoreType>;
  totalScore: number;
};

declare type RoundScoreType = {
  freeOfClaims: boolean;
  points: number | null;
  action: ActionType | null;
};

declare type ActionType = 'win' | 'scoot' | 'middleScoot';

declare type PlayerScoreUpdatePayloadType = {
  id: string;
  score: RoundScoreType;
};

type GameStateType = {
  numPlayers: number;
  players: Array<PlayerType>;
  claims: Array<number>;
  currentDealerIndex: number;
};

declare type ServerResponseStatus = 'ready' | 'pending';

declare type ClientRole = 'scorekeeper' | 'viewer';
