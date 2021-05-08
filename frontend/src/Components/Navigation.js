import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import Home from "./Home";
import TopPints from "./TopPints";
import About from "./About";
import Venues from "./Venues";


const useStyles = makeStyles((theme) => ({
    navMenuItemsText: {
        fontWeight: 650,
        fontSize: 18,
        color: 'black',
        display: 'flex',
        textDecoration: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 7
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
                                 style={window.location.pathname === '/' ? {backgroundColor: '#f2f2f2'} : null}>
                               <Link onClick={() => setCurrentPage('home')}
                                     className={classes.navMenuItemsText} to='/'>Home</Link>
                           </Grid>
                           <Grid item xs={2}
                                 className={classes.navMenuItem}
                                 style={window.location.pathname === '/top-pints' ? {backgroundColor: '#f2f2f2'} : null}>
                                <Link onClick={() => setCurrentPage('topPints')}
                                      className={classes.navMenuItemsText} to='/top-pints'>Top Pints</Link>
                           </Grid>
                            <Grid item xs={2}
                                  className={classes.navMenuItem}
                                  style={window.location.pathname === '/venues' ? {backgroundColor: '#f2f2f2'} : null}>
                                 <Link onClick={() => setCurrentPage('venues')}
                                     className={classes.navMenuItemsText} to='/venues'>Locations</Link>

                           </Grid>
                            <Grid item xs={2}
                                  className={classes.navMenuItem}
                                  style={window.location.pathname === '/about' ? {backgroundColor: '#f2f2f2'} : null}>
                                  <Link onClick={() => setCurrentPage('about')}
                                     className={classes.navMenuItemsText} to='/about'>About</Link>
                           </Grid>
                            <Grid item xs={4}>
                               <Button className={classes.addEntryButton}>Add Pint Entry</Button>
                           </Grid>
                       </Grid>
                </Box>
            </div>
            <Switch>
                <Route exact path='/'>
                    <Home/>
                </Route>
                <Route exact path='/top-pints'>
                    <TopPints/>
                </Route>
                <Route exact path='/venues'>
                    <Venues/>
                </Route>
                <Route exact path='/about'>
                    <About/>
                </Route>
            </Switch>
        </Router>
      );
}