import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

type PropsType = {
  name: string;
  selected?: boolean;
  onClick: () => void;
};

const useStyles = makeStyles((theme) => ({
  cardPlayer: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    margin: theme.spacing(3, 2, 0),
    padding: theme.spacing(2, 2, 0),
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
      cursor: 'pointer',
    },
  },
  selectedCardPlayer: {
    backgroundColor: green[50],
    '&:hover': {
      backgroundColor: green[100],
    },
  },
}));

export default function PlayerCard(props: PropsType) {
  const classes = useStyles();
  const className = `${classes.cardPlayer} ${
    props.selected ? classes.selectedCardPlayer : null
  }`;

  return (
    <Card className={className} onClick={props.onClick}>
      <CardContent>
        <Typography component="h2" variant="h4" color="textPrimary">
          {props.name}
        </Typography>
      </CardContent>
    </Card>
  );
}
