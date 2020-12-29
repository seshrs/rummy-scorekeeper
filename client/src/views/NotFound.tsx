import React from 'react';
import { Typography, Grid } from '@material-ui/core';

const NotFound = () => (
  <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justify="center"
    style={{ minHeight: '100vh' }}
  >
    <Grid item xs={3}>
      <Typography align="center" variant="h1">
        Not found!
      </Typography>
    </Grid>
  </Grid>
);

export default NotFound;
