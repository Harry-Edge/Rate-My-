import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({

}));

export default function TopPints() {

  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Box m={3}>
              <Grid container>
                    <Paper elevation={3}>
                        <Grid item xs={4} style={{marginLeft: 20, }}>
                            <Typography>TOP PINTS M9
                            </Typography>
                        </Grid>
                    </Paper>
              </Grid>
        </Box>
    </div>
  );
}