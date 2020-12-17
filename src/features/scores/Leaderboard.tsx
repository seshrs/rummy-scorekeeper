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

import { selectPlayers } from '../game/gameSlice';
import { sortPlayers } from './ScoreUtils';

const useStyles = makeStyles((theme) => ({
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
          {orderedPlayers.map((player) => (
            <LeaderboardRow
              key={player.id}
              player={player}
              isLeader={player.totalScore === orderedPlayers[0].totalScore}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function LeaderboardRow(props: { isLeader: boolean; player: PlayerType }) {
  const classes = useStyles();

  return (
    <TableRow className={props.player.active ? '' : classes.inactivePlayer}>
      <TableCell
        className={`${props.isLeader ? classes.leader : ''} ${
          classes.borderRight
        }`}
        align="center"
        scope="row"
      >
        {props.player.name}
      </TableCell>
      <TableCell
        className={props.isLeader ? classes.leader : ''}
        align="center"
      >
        {props.player.totalScore}
      </TableCell>
    </TableRow>
  );
}
