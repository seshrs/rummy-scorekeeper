import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import {
  startNextRound,
  selectAreCurrentRoundScoresValid,
  selectCurrentRoundOver,
  selectPlayers,
  selectRound,
  selectCurrentDealerIndex,
  selectIsGameOver,
} from './gameSlice';
import GameInputPlayerCard from './GameInputPlayerCard';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(4, 0, 6),
  },
  playerGrid: {
    marginBottom: theme.spacing(2),
  },
}));

export default function GameRoundInput() {
  const classes = useStyles();
  const round = useSelector(selectRound);
  const players = useSelector(selectPlayers);
  const isRoundOver = useSelector(selectCurrentRoundOver);
  const isGameOver = useSelector(selectIsGameOver);
  const areCurrentRoundScoresValid = useSelector(
    selectAreCurrentRoundScoresValid,
  );
  const currentDealerIndex = useSelector(selectCurrentDealerIndex);
  const dispatch = useDispatch();

  const playerCards = players.map((player, i) => (
    <Grid item key={player.id}>
      <GameInputPlayerCard
        player={player}
        isDealer={i === currentDealerIndex}
        isGameOver={isGameOver}
      />
    </Grid>
  ));

  return (
    <Container maxWidth="lg" className={classes.heroContent} component="main">
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        Round {round}
      </Typography>

      <Grid
        container
        className={classes.playerGrid}
        justify="center"
        spacing={5}
        alignItems="center"
      >
        {playerCards}
      </Grid>

      {isRoundOver ? (
        <Grid container justify="center" spacing={0} alignItems="center">
          <Button
            variant="contained"
            color="primary"
            disabled={!areCurrentRoundScoresValid}
            onClick={() => dispatch(startNextRound())}
          >
            Complete round
          </Button>
        </Grid>
      ) : null}
    </Container>
  );
}
