import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import Grid from "@material-ui/core/Grid";
import {Divider, Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({


}));

export default function About() {
    const classes = useStyles()

  return (
    <div className={classes.root}>
        <Box>
            <Divider/>
            <br/>
            <Grid item lg={12} md={12} sm={12}>
                    <Paper elevation={3} style={{height: 100,    border: '2px', borderStyle: 'solid', borderColor: 'grey'}}>
                        <Typography style={{paddingTop: 20, paddingLeft: 20}}>Not all pints are created equal. The
                            same delicious beer can taste completely
                            different depending on venue. Rate my beer give people the chance to for the
                            people to have their say on their favourite pint and the venues that serve them.
                        </Typography>
                    </Paper>
            </Grid>
            <br/>
             <Divider/>
        </Box>
    </div>
  );
}