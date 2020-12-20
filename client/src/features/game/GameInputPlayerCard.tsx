import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import {
  setClaimsForCurrentRound,
  selectCurrentRoundClaims,
  selectCurrentRoundOver,
  selectRound,
  setPlayerScoreForCurrentRound,
} from './gameSlice';

type PropsType = {
  player: PlayerType;
  isDealer?: boolean;
};

const stateStrings = {
  win: 'Win',
  scoot: 'Scoot',
  middleScoot: 'Middle Scoot',
};

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  cardPlayer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    margin: theme.spacing(2),
    textAlign: 'center',
  },
  cardScoot: {
    backgroundColor: theme.palette.grey[200],
  },
  cardWin: {
    backgroundColor: green[50],
  },
  cardInactive: {
    backgroundColor: theme.palette.grey[300],
  },
  cardButton: {
    margin: theme.spacing(0.5, 0),
  },
  cardInput: {
    marginTop: theme.spacing(2),
  },
}));

export default function GameInputPlayerCard(props: PropsType) {
  return props.player.active ? (
    <ActivePlayer {...props} />
  ) : (
    <InactivePlayer {...props} />
  );
}

function ActivePlayer({ player, isDealer }: PropsType) {
  // TODO: If free of claims, then point input box should be zero and disabled.
  const classes = useStyles();
  const dispatch = useDispatch();

  const round = useSelector(selectRound);
  const isRoundOver = useSelector(selectCurrentRoundOver);
  const currentPlayerScore = player.roundScores[round - 1];
  const currentRoundClaims = useSelector(selectCurrentRoundClaims);

  const isScooted =
    currentPlayerScore.action === 'scoot' ||
    currentPlayerScore.action === 'middleScoot';

  const dispatchScoreUpdate = (scoreUpdate: Partial<RoundScoreType>) => {
    const score: RoundScoreType = {
      ...currentPlayerScore,
      ...scoreUpdate,
    };
    dispatch(setPlayerScoreForCurrentRound({ id: player.id, score }));
  };

  const regularButtons =
    isRoundOver || currentPlayerScore.action != null ? null : (
      <>
        <Button
          className={classes.cardButton}
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={() => dispatchScoreUpdate({ action: 'scoot', points: 30 })}
        >
          {stateStrings['scoot']}
        </Button>
        <Button
          className={classes.cardButton}
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={() =>
            dispatchScoreUpdate({ action: 'middleScoot', points: 60 })
          }
        >
          {stateStrings['middleScoot']}
        </Button>
        <Button
          className={classes.cardButton}
          fullWidth
          variant="contained"
          color="primary"
          onClick={() =>
            dispatchScoreUpdate({
              action: 'win',
              points: 0,
              freeOfClaims: true,
            })
          }
        >
          {stateStrings['win']}
        </Button>
      </>
    );

  const pointsInput =
    !isRoundOver || isScooted ? null : currentPlayerScore.action === 'win' ? (
      <li>
        <TextField
          className={classes.cardInput}
          label="Claims"
          variant="outlined"
          type="number"
          value={currentRoundClaims}
          inputProps={{ min: 0, step: 10 }}
          error={currentRoundClaims < 0 || currentRoundClaims % 10 !== 0}
          onChange={(e) =>
            dispatch(setClaimsForCurrentRound(parseInt(e.target.value, 10)))
          }
          onFocus={(e) => e.target.select()}
        />
      </li>
    ) : (
      <>
        {currentPlayerScore.freeOfClaims ? null : (
          <li>
            <TextField
              className={classes.cardInput}
              label="Points"
              variant="outlined"
              type="number"
              value={
                currentPlayerScore.points == null
                  ? ''
                  : currentPlayerScore.points
              }
              inputProps={{ min: 0 }}
              error={
                (currentPlayerScore.points || 0) < 0 ||
                (currentPlayerScore.points || 0) > 100
              }
              onChange={(e) => {
                const newNum = parseInt(e.target.value, 10);
                dispatchScoreUpdate({
                  points: Number.isNaN(newNum) ? null : newNum,
                });
              }}
              onFocus={(e) => e.target.select()}
            />
          </li>
        )}
        {currentPlayerScore.action == null ? (
          <li>
            <FormControlLabel
              label="Free of claims"
              control={
                <Checkbox
                  checked={currentPlayerScore.freeOfClaims}
                  onChange={(e) =>
                    dispatchScoreUpdate({
                      freeOfClaims: e.target.checked,
                      points: null,
                    })
                  }
                  color="primary"
                />
              }
            />
          </li>
        ) : null}
      </>
    );

  const resetButton =
    currentPlayerScore.action != null ? (
      <Button
        className={classes.cardButton}
        fullWidth
        variant="contained"
        color="secondary"
        onClick={() =>
          dispatchScoreUpdate({ action: null, points: 0, freeOfClaims: false })
        }
      >
        Reset
      </Button>
    ) : null;

  const card = (
    <Card
      className={
        isScooted
          ? classes.cardScoot
          : currentPlayerScore.action === 'win'
          ? classes.cardWin
          : undefined
      }
    >
      <CardContent>
        <div className={classes.cardPlayer}>
          <ul>
            <li>
              <Typography component="h2" variant="h5" color="textPrimary">
                {player.name}
              </Typography>
            </li>
            {currentPlayerScore.action != null ? (
              <li>
                <Typography component="h3" variant="h6" color="textSecondary">
                  {stateStrings[currentPlayerScore.action]}
                </Typography>
              </li>
            ) : null}
            {pointsInput ? pointsInput : null}
          </ul>
        </div>
        {regularButtons}
        {resetButton}
      </CardContent>
    </Card>
  );

  if (isDealer) {
    return (
      <Badge badgeContent="Dealer" color="primary">
        {card}
      </Badge>
    );
  }

  return card;
}

function InactivePlayer({ player }: PropsType) {
  const classes = useStyles();
  return (
    <Card className={classes.cardInactive}>
      <CardContent>
        <div className={classes.cardPlayer}>
          <ul>
            <li>
              <Typography component="h2" variant="h5" color="textPrimary">
                {player.name}
              </Typography>
            </li>
            <li>
              <Typography component="h3" variant="h6" color="textSecondary">
                Out
              </Typography>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
