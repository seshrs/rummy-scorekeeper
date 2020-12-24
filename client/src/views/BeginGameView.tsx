import React from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import { selectRoomPlayers } from '../features/room/roomSlice';
import BeginGamePlayerCard from './BeginGamePlayerCard';

type RoomPlayerType = {
  name: string;
  roomPlayerId: number;
};

type PropsType = { onBeginGame: (playerNames: Array<string>) => void };

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(4, 0, 6),
  },
  playerGrid: {
    marginBottom: theme.spacing(4),
  },
}));

export default function BeginGameView(props: PropsType) {
  const classes = useStyles();
  const roomPlayers = useSelector(selectRoomPlayers);
  const [selectedGamePlayers, setSelectedGamePlayers] = React.useState<
    Array<RoomPlayerType>
  >([]);

  const roomPlayersNotInGame = roomPlayers
    .map((playerName, roomPlayerId) => ({
      name: playerName,
      roomPlayerId,
    }))
    .filter(
      (_player, i) =>
        selectedGamePlayers.findIndex(
          (gamePlayer) => gamePlayer.roomPlayerId === i,
        ) === -1,
    );

  const selectPlayer = (roomPlayerId: number) => {
    if (
      selectedGamePlayers.findIndex(
        (player) => player.roomPlayerId === roomPlayerId,
      ) !== -1 ||
      roomPlayerId >= roomPlayers.length
    ) {
      console.warn(
        'selectPlayer: Ignoring selection of roomPlayerId: ',
        roomPlayerId,
      );
      return;
    }
    setSelectedGamePlayers([
      ...selectedGamePlayers,
      { name: roomPlayers[roomPlayerId], roomPlayerId },
    ]);
  };
  const unselectPlayer = (roomPlayerId: number) => {
    const indexOfDeselection = selectedGamePlayers.findIndex(
      (player) => player.roomPlayerId === roomPlayerId,
    );
    if (indexOfDeselection === -1 || roomPlayerId >= roomPlayers.length) {
      console.warn(
        'unselectPlayer: Ignorind de-selection of roomPlayerId: ',
        roomPlayerId,
      );
    }
    const newSelectedPlayers = [...selectedGamePlayers];
    newSelectedPlayers.splice(indexOfDeselection, 1);
    setSelectedGamePlayers(newSelectedPlayers);
  };

  const onBeginGame = () =>
    props.onBeginGame(selectedGamePlayers.map((player) => player.name));

  const availablePlayerGrid =
    roomPlayersNotInGame.length === 0 ? null : (
      <PlayerGrid title="Available Players">
        {roomPlayersNotInGame.map((player) => (
          <Grid item key={player.roomPlayerId}>
            <BeginGamePlayerCard
              name={player.name}
              onClick={() => selectPlayer(player.roomPlayerId)}
            />
          </Grid>
        ))}
      </PlayerGrid>
    );

  const selectedPlayerGrid =
    selectedGamePlayers.length === 0 ? null : (
      <PlayerGrid title="Selected Players">
        {selectedGamePlayers.map((player) => (
          <Grid item key={player.roomPlayerId}>
            <BeginGamePlayerCard
              name={player.name}
              selected
              onClick={() => unselectPlayer(player.roomPlayerId)}
            />
          </Grid>
        ))}
      </PlayerGrid>
    );

  return (
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
          Select players to begin the game.
        </Typography>
      </Container>

      <Container maxWidth="lg">
        <Grid container justify="center" spacing={3} alignItems="center">
          {availablePlayerGrid}
          {selectedPlayerGrid}
        </Grid>

        <Grid container spacing={5} justify="center" alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onBeginGame}
              disabled={selectedGamePlayers.length === 0}
            >
              Begin game
            </Button>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}

function PlayerGrid(props: { title: string; children: React.ReactNode }) {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="column"
        spacing={0}
      >
        <Grid item>
          <Typography component="h3" variant="h5" color="textPrimary">
            {props.title}
          </Typography>
        </Grid>
        <Grid item>
          <Grid
            container
            justify="center"
            spacing={5}
            alignItems="center"
            className={classes.playerGrid}
          >
            {props.children}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
