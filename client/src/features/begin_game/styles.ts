import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(4, 0, 6),
  },
  playerGrid: {
    marginBottom: theme.spacing(3),
  },
  cardHoverShade: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
      cursor: 'pointer',
    },
  },
  cardPlayer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  cardAddPlayer: {
    backgroundColor: theme.palette.grey[200],
    border: `2px dashed ${theme.palette.grey[700]}`,
    margin: theme.spacing(2),
    cursor: 'pointer',
  },
}));
