import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import Leaderboard from './Leaderboard';
import Scoreboard from './Scoreboard';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  playerGrid: {
    marginBottom: theme.spacing(2),
  },
}));

export default function Scores() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.heroContent}>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        Scores
      </Typography>

      <Grid
        container
        className={classes.playerGrid}
        justify="center"
        spacing={5}
        alignItems="center"
      >
        <Grid item xs={12} md={8}>
          <Scoreboard />
        </Grid>
        <Grid item xs={12} md={4}>
          <Leaderboard />
        </Grid>
      </Grid>
    </Container>
  );
}
