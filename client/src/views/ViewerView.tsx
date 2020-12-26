import React from 'react';
import { useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import GameScores from '../features/scores/GameScores';
import { selectRound } from '../features/game/gameSlice';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(8, 0, 8),
  },
}));

export default function ViewerView() {
  const classes = useStyles();
  const areScoresAvailable = useSelector(selectRound) > 1;

  return (
    <>
      <CssBaseline />
      <main>
        <Container maxWidth="lg" className={classes.heroContent}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Rummy Scorekeeper
          </Typography>
          {areScoresAvailable ? null : (
            <Typography
              component="p"
              variant="h5"
              align="center"
              color="textSecondary"
              gutterBottom
            >
              Waiting for scores...
            </Typography>
          )}
        </Container>

        {areScoresAvailable ? <GameScores /> : null}
      </main>
    </>
  );
}
