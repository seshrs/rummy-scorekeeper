import React from 'react';
import { useDispatch } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { setRoomId } from '../features/room/roomSlice';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(8, 0, 8),
  },
}));

export default function SelectRoomView() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [roomId, setRoomIdState] = React.useState('');
  const onSubmit = () => dispatch(setRoomId(roomId));

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
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => onSubmit()}
                  disabled={roomId.length === 0}
                >
                  Join room
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </main>
    </>
  );
}
