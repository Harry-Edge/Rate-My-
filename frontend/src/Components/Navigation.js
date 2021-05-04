import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import Home from "./Home";
import TopPints from "./TopPints";


const useStyles = makeStyles((theme) => ({
    navMenuItemsText: {
        fontWeight: 650,
        fontSize: 18,
        color: 'black',
        display: 'flex',
        textDecoration: 'none',
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

        width: '90%',
        float: 'right',
        fontWeight: 650,
        backgroundColor: '#009933',
        borderColor: '#009933',

        '&:hover': {
          backgroundColor: '#00802b',
          borderColor: '#00802b'
         },
    }
}));

export default function MainNavigation() {

  const [currentPage, setCurrentPage] = useState('home');

  const classes = useStyles();

  return (
        <Router>
            <div className={classes.root}>
                <Box m={3}>
                       <Grid container>
                           <Grid item xs={2}
                                 className={classes.navMenuItem}
                                 onClick={() => setCurrentPage('home')}
                                 style={currentPage === 'home' ? {backgroundColor: '#f2f2f2'} : null}>
                               <Link className={classes.navMenuItemsText} to='/'>Home</Link>
                           </Grid>
                           <Grid item xs={2}
                                 className={classes.navMenuItem}
                                 onClick={() => setCurrentPage('topPints')}
                                 style={currentPage === 'topPints' ? {backgroundColor: '#f2f2f2'} : null}>
                                <Link className={classes.navMenuItemsText} to='/top-pints'>Top Pints</Link>
                           </Grid>
                            <Grid item xs={2}
                                  className={classes.navMenuItem}>
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
                </Box>
            </div>
            <Switch>
                <Route exact path='/'>
                    <Home/>
                </Route>
                <Route exact path='/top-pints'>
                    <TopPints/>
                </Route>
            </Switch>
        </Router>
      );
}