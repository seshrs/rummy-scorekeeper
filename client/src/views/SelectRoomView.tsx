import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {
  setRoomId,
  selectIsServerPending,
  selectNavigateToRoom,
  selectRoomId,
} from '../features/room/roomSlice';
import { Navigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(8, 0, 8),
  },
}));

export default function SelectRoomView() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [roomId, setRoomIdState] = React.useState('');
  const [error, setError] = React.useState(false);
  const isServerPending = useSelector(selectIsServerPending);
  // In this form I need to know whether I can navigate or not. Right now I have added extra state,
  // but I think this can simply be done as is server ready?
  const navigateToRoom = useSelector(selectNavigateToRoom);
  // This is the roomId saved in server and is the source of truth for navigation
  const savedRoomId = useSelector(selectRoomId);

  const onSubmit = () => {
    if (!roomId || !roomId.trim()) {
      setError(true);
    } else {
      setError(false);
      dispatch(setRoomId(roomId));
    }
  };
  const validate = (input: string) => {
    if (!input || !input.trim()) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const button = isServerPending ? (
    <Button variant="contained" color="primary" size="large" disabled>
      Joining room...
    </Button>
  ) : (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={() => onSubmit()}
      disabled={roomId.length === 0}
    >
      Join room
    </Button>
  );
  return (
    <>
      {navigateToRoom && <Navigate to={`/${savedRoomId}`} />}
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
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            component="p"
          >
            Enter your room ID
          </Typography>
        </Container>

        <Container maxWidth="lg">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <Grid
              container
              spacing={3}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <TextField
                  value={roomId}
                  onChange={(e) => setRoomIdState(e.target.value)}
                  label="Room ID"
                  variant="outlined"
                  required
                  onBlur={(e) => validate(e.target.value)}
                  error={error}
                />
              </Grid>
              <Grid item>{button}</Grid>
            </Grid>
          </form>
        </Container>
      </main>
    </>
  );
}
