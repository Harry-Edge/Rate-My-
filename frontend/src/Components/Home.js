import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({

}));

export default function Home() {

  const classes = useStyles();


  return (
    <div className={classes.root}>
        <Box m={3}>
              <Grid container>
                    <Paper elevation={1}>
                        <Grid item xs={4} style={{marginLeft: 20, }}>
                            <Typography>Not all pints are created equal. The same delicious beer can taste completely
                                        different depending on venue. Rate my beer give people the chance to for the
                                        people to have their say on their favourite pint and the venues that serve them.
                            </Typography>
                        </Grid>
                    </Paper>
              </Grid>
        </Box>
    </div>
  );
}