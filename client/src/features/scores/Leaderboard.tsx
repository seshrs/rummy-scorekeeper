import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';

import { selectPlayers, selectIsGameOver } from '../game/gameSlice';
import { sortPlayers } from './ScoreUtils';

const useStyles = makeStyles((theme) => ({
  winner: {
    backgroundColor: green[50],
  },
  inactivePlayer: {
    backgroundColor: theme.palette.grey[300],
  },
  leader: {
    fontWeight: 'bold',
  },
  borderRight: {
    borderRight: `solid 1px ${theme.palette.grey['A100']}`,
  },
}));

export default function Leaderboard() {
  const players = useSelector(selectPlayers);
  const isGameOver = useSelector(selectIsGameOver);

  const orderedPlayers = sortPlayers(players);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="leaderboard">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} align="center">
              <Typography
                component="h2"
                variant="h4"
                align="center"
                color="textSecondary"
              >
                Leaderboard
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderedPlayers.map((player) => {
            const isLeader = player.totalScore === orderedPlayers[0].totalScore;
            return (
              <LeaderboardRow
                key={player.id}
                player={player}
                isLeader={isLeader}
                isWinner={isLeader && isGameOver}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function LeaderboardRow(props: {
  isLeader: boolean;
  isWinner: boolean;
  player: PlayerType;
}) {
  const classes = useStyles();
  const tableCellClassNames = [
    props.isLeader ? classes.leader : null,
    props.isWinner ? classes.winner : null,
    classes.borderRight,
  ];

  return (
    <TableRow className={props.player.active ? '' : classes.inactivePlayer}>
      <TableCell
        className={[...tableCellClassNames, classes.borderRight].join(' ')}
        align="center"
        scope="row"
      >
        {props.player.name}
      </TableCell>
      <TableCell className={tableCellClassNames.join(' ')} align="center">
        {props.player.totalScore}
      </TableCell>
    </TableRow>
  );
}
