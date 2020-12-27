import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import GameScores from '../features/scores/GameScores';
import { selectRound } from '../features/game/gameSlice';
import { setRoleToScorekeeper } from '../features/room/roomSlice';
import Cmd from '../utils/Cmd';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(8, 0, 4),
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));

export default function ViewerView() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const areScoresAvailable = useSelector(selectRound) > 1;

  return (
    <>
      <CssBaseline />
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            component="h1"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            Rummy Scorekeeper
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            className={classes.link}
            onClick={() =>
              Cmd.openModal({
                title: 'Take over the room?',
                description:
                  'If you take over the room, you can enter scores for the room. The current scorekeeper will be downgraded into a "viewer".',
                cancelText: 'Cancel',
                okText: 'Become scorekeeper',
                onOk: () => dispatch(setRoleToScorekeeper()),
              })
            }
          >
            Take Over
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        {areScoresAvailable ? null : (
          <Container maxWidth="lg" className={classes.heroContent}>
            <Typography
              component="p"
              variant="h5"
              align="center"
              color="textSecondary"
              gutterBottom
            >
              Waiting for scores...
            </Typography>
          </Container>
        )}

        {areScoresAvailable ? <GameScores /> : null}
      </main>
    </>
  );
}
