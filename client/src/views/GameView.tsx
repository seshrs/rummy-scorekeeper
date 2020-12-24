import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

import { setPlayerNames, selectGameHasBegun } from '../features/game/gameSlice';
import BeginGame from '../features/begin_game/BeginGame';
import GameRoundInput from '../features/game/GameRoundInput';
import GameScores from '../features/scores/GameScores';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));

export default function GameView() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = React.useState(0);

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [tabValue]);

  const gameHasBegun = useSelector(selectGameHasBegun);

  const handleChangeTabs = (
    event: React.ChangeEvent<{}>,
    newTabValue: number,
  ) => {
    setTabValue(newTabValue);
  };

  // Show tabs only if the game has begun
  const tabs = gameHasBegun ? (
    <Tabs
      variant="fullWidth"
      value={tabValue}
      onChange={handleChangeTabs}
      aria-label="nav tabs"
    >
      <LinkTab label="Round Input" href="#" {...a11yProps(0)} />
      <LinkTab label="Scores" href="#" {...a11yProps(1)} />
    </Tabs>
  ) : null;

  const mainComponent = gameHasBegun ? (
    <>
      <TabPanel value={tabValue} index={0}>
        <GameRoundInput />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <GameScores />
      </TabPanel>
    </>
  ) : (
    <BeginGame
      onBeginGame={(playerNames) => dispatch(setPlayerNames(playerNames))}
    />
  );

  return (
    <>
      <CssBaseline />
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            component="h1"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            Rummy Scorekeeper
          </Typography>
          {tabs}
          <Button
            href="#"
            color="primary"
            variant="outlined"
            className={classes.link}
          >
            Settings
          </Button>
        </Toolbar>
      </AppBar>

      {mainComponent}
    </>
  );
}

function TabPanel(props: {
  children?: React.ReactNode;
  index: any;
  value: any;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props: { label?: string; href?: string }) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}
