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

import { selectPlayers } from '../game/gameSlice';
import { sortPlayers } from './ScoreUtils';

const useStyles = makeStyles((theme) => ({
  inactivePlayer: {
    backgroundColor: theme.palette.grey[300],
  },
  leader: {
    fontWeight: 'bold',
  },
}));

export default function Leaderboard() {
  const players = useSelector(selectPlayers);

  const orderedPlayers = sortPlayers(players);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Rank</TableCell>
            <TableCell align="center">Player</TableCell>
            <TableCell align="center">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderedPlayers.map((player, rank) => (
            <LeaderboardRow
              key={player.id}
              rank={rank + 1}
              player={player}
              isLeader={player.totalScore === orderedPlayers[0].totalScore}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function LeaderboardRow(props: {
  rank: number;
  isLeader: boolean;
  player: PlayerType;
}) {
  // TODO: Decide whether to display rank
  const classes = useStyles();

  return (
    <TableRow className={props.player.active ? '' : classes.inactivePlayer}>
      <TableCell
        className={props.isLeader ? classes.leader : ''}
        align="center"
      >
        {props.rank}
      </TableCell>
      <TableCell
        className={props.isLeader ? classes.leader : ''}
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
