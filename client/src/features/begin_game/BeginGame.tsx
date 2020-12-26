import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Icon from '@material-ui/core/Icon';
import Add from '@material-ui/icons/Add';
import PlayerCard from './PlayerCard';
import useStyles from './styles';

type Player = {
  name: string;
  id: number;
};

type PropsType = { onBeginGame: (playerNames: Array<string>) => void };

let nextPlayerId = 0;

export default function BeginGame(props: PropsType) {
  const classes = useStyles();
  const [players, setPlayers] = React.useState<Array<Player>>([]);

  const addPlayer = () =>
    setPlayers([...players, { name: 'Player', id: nextPlayerId++ }]); // TODO: Replace the default player name with a random generator
  const removePlayer = (index: number) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };
  const setPlayerName = (index: number, newName: string) => {
    const newPlayers = [...players];
    players[index].name = newName;
    setPlayers(newPlayers);
  };

  const onBeginGame = () =>
    props.onBeginGame(players.map((player) => player.name));

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
          Add players to begin the game.
        </Typography>
      </Container>

      <Container maxWidth="lg">
        <Grid
          container
          justify="center"
          spacing={5}
          alignItems="center"
          className={classes.playerGrid}
        >
          {players.map((player, index) => (
            <Grid item key={player.id}>
              <PlayerCard
                name={player.name}
                onChange={(newName) => setPlayerName(index, newName)}
                onRemove={() => removePlayer(index)}
              />
            </Grid>
          ))}

          <Grid item key="Add Player">
            <Card
              elevation={0}
              className={classes.cardAddPlayer}
              onClick={addPlayer}
            >
              <CardContent>
                <div className={classes.cardPlayer}>
                  <Typography component="h2" variant="h4" color="textPrimary">
                    <Icon>
                      <Add />
                    </Icon>{' '}
                    Add Player
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={5} justify="center" alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onBeginGame}
              disabled={players.length < 2}
            >
              Begin game
            </Button>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
