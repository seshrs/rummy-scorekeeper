import React from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/Delete';
import useStyles from './styles';

type PropsType = {
  name: string;
  onChange: (newName: string) => void;
  onRemove: () => void;
};

export default function PlayerCard(props: PropsType) {
  const classes = useStyles();

  const [isEditing, setIsEditing] = React.useState(true);

  // TODO: Listen to escape event to set is editing to false

  const cardContent = isEditing ? (
    <form
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        setIsEditing(false);
      }}
    >
      <TextField
        // TODO: Audit mobile experience
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        label="Player name"
        variant="outlined"
        value={props.name}
        onChange={(e) => props.onChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={() => setIsEditing(false)}
      />
    </form>
  ) : (
    <div className={classes.cardPlayer}>
      <Typography component="h2" variant="h4" color="textPrimary">
        {props.name}
      </Typography>
    </div>
  );

  return (
    <Card className={classes.cardHoverShade} onClick={() => setIsEditing(true)}>
      <CardContent>{cardContent}</CardContent>
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          startIcon={<Delete />}
          onClick={(e) => {
            e.stopPropagation();
            props.onRemove();
          }}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
}
