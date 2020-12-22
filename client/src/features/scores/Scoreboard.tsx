import React from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';

import { selectClaims, selectPlayers, selectRound } from '../game/gameSlice';

const useStyles = makeStyles((theme) => ({
  inactivePlayerScore: {
    backgroundColor: theme.palette.grey[300],
  },
  winnerScore: {
    backgroundColor: green[50],
  },
  borderRight: {
    borderRight: `solid 1px ${theme.palette.grey['A100']}`,
  },
}));

export default function Scoreboard() {
  const classes = useStyles();
  const claims = useSelector(selectClaims);
  const players = useSelector(selectPlayers);
  const lastCompleteRound = useSelector(selectRound) - 1;

  const roundsScores: Array<Array<RoundScoreType>> = [];
  for (let i = 0; i < lastCompleteRound; ++i) {
    roundsScores.push(players.map((player) => player.roundScores[i]));
  }

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader size="small" aria-label="scoreboard">
        <TableHead>
          <TableRow>
            <TableCell className={classes.borderRight} align="center">
              Round
            </TableCell>
            <TableCell className={classes.borderRight} align="center">
              Claims
            </TableCell>
            {players.map((player) => (
              <TableCell align="center" key={player.id}>
                {player.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {roundsScores.map((roundScore, i) => (
            <ScoreboardRow
              key={i}
              round={i + 1}
              claims={claims[i]}
              scores={roundScore}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ScoreboardRow(props: {
  round: number;
  claims: number;
  scores: Array<RoundScoreType>;
}) {
  const classes = useStyles();
  const players = useSelector(selectPlayers);
  return (
    <TableRow>
      <TableCell className={classes.borderRight} align="center">
        {props.round}
      </TableCell>
      <TableCell className={classes.borderRight} align="center">
        {props.claims}
      </TableCell>
      {props.scores.map((score, i) => {
        if (props.round > players[i].lastRoundPlayed) {
          return (
            <TableCell
              key={i}
              className={classes.inactivePlayerScore}
              align="center"
            />
          );
        }
        if (score.action === 'win') {
          return (
            <TableCell key={i} className={classes.winnerScore} align="center">
              <Tooltip title="Winner" placement="right" arrow>
                <Typography variant="body2">D</Typography>
              </Tooltip>
            </TableCell>
          );
        }
        if (score.freeOfClaims || score.points == null) {
          return (
            <TableCell key={i} align="center">
              <Tooltip title="Free of claims" placement="right" arrow>
                <Typography variant="body2">F</Typography>
              </Tooltip>
            </TableCell>
          );
        }
        return (
          <TableCell key={i} align="center">
            {score.points}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
