import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from '@material-ui/core/Button'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'


const useStyles = makeStyles((theme) => ({
    navMenuItemsText: {
        fontWeight: 650,
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5

    },
    navMenuItem:{
        '&:hover': {
          backgroundColor: '#f2f2f2',
          borderColor: '#f2f2f2'
         },
    },
    addEntryButton: {
        color: 'white',
        textTransform: 'none',
        width: '100%',
        fontWeight: 650,
        backgroundColor: '#009933',
        borderColor: '#009933',

        '&:hover': {
          backgroundColor: '#00802b',
          borderColor: '#00802b'
         },
    }



}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Box m={3}>

               <Grid container>
                   <Grid item xs={2} style={{backgroundColor: '#f2f2f2'}}>
                       <Typography className={classes.navMenuItemsText}>Home</Typography>
                   </Grid>
                   <Grid item xs={2} className={classes.navMenuItem}>
                       <Typography className={classes.navMenuItemsText}>Top Pints</Typography>
                   </Grid>
                    <Grid item xs={2} className={classes.navMenuItem}>
                       <Typography className={classes.navMenuItemsText}>Locations</Typography>
                   </Grid>
                    <Grid item xs={2} className={classes.navMenuItem}>
                       <Typography className={classes.navMenuItemsText}>Venues</Typography>
                   </Grid>
                    <Grid item xs={2} className={classes.navMenuItem}>
                       <Typography className={classes.navMenuItemsText}>About</Typography>
                   </Grid>
                    <Grid item xs={2}>
                       <Button className={classes.addEntryButton}>Add Pint Entry</Button>
                   </Grid>
               </Grid>
             <br/>
              <Grid>
                    <Paper>
                        <Box>
                            <Typography>Not all pints are created equal. The same delicious beer can taste completely
                                        different depending on venue. Rate my beer give people the chance to for the
                                        people to have their say on their favourite pint and the venues that serve them.
                            </Typography>

                        </Box>

                    </Paper>
              </Grid>
        </Box>
    </div>
  );
}