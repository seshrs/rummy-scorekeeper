/**
 * Sort the players in increasing rank order. (Players with fewer points and
 * who has played longer have a smaller rank.)
 *
 * @param players List of players in the game
 */
export function sortPlayers(players: Array<PlayerType>) {
  return [...players].sort((player1, player2) => {
    if (player1.active && player2.active) {
      return player1.totalScore - player2.totalScore;
    } else if (player1.active) {
      return -1;
    } else if (player2.active) {
      return 1;
    } else if (player1.lastRoundPlayed !== player2.lastRoundPlayed) {
      // If both are inactive, whoever played more rounds has a higher rank

      return player2.lastRoundPlayed - player1.lastRoundPlayed;
    }
    // If both inactive players have the same lastRoundPlayed, rank them by
    // scores
    return player1.totalScore - player2.totalScore;
  });
}
