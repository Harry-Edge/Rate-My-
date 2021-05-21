import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
    footerContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    footerText: {
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 650,
        color: 'grey',
        '&:hover': {
          color: 'black'
         },
    }
}));

export default function Footer() {
  const classes = useStyles();

  return (
      <div>
          <Grid container className={classes.footerContainer}>
              <Grid item xs={2}>
                  <Typography className={classes.footerText}>Contact </Typography>
              </Grid>
              <Grid item xs={2}>
                  <Typography className={classes.footerText} >Report a Bug</Typography>
              </Grid>
          </Grid>
      </div>

  );
}