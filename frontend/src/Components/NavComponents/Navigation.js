import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import {Link} from 'react-router-dom'
import AddPintEntry from "../PagesComponents/AddPintEntry";
import SuccessMessage from "../MiscComponents/PintEntrySucessMessage";

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
        display: 'none',
        '&:hover': {
          backgroundColor: '#f2f2f2',
          borderColor: '#f2f2f2',
         },
        [theme.breakpoints.up('sm')]: {
              display: 'block',}
    },
    addEntryButton: {
        color: 'white',
        textTransform: 'none',
        width: '85%',
        float: 'right',
        fontWeight: 650,
        backgroundColor: '#009933',
        borderColor: '#009933',
        '&:hover': {
          backgroundColor: '#00802b',
          borderColor: '#00802b'
         },
        [theme.breakpoints.up('lg', 'md')]: {
              width: '85%',} ,
    },
    addEntryDiv: {
        display: 'none',
        [theme.breakpoints.up( 'sm')]: {
              display: 'block',}
    }
}));

export default function MainNavigation() {

  const [currentPage, setCurrentPage] = useState('home');

  const [open, setOpen] = useState(false)

  const [pintEntryMade, setPintEntryMade] = useState(false)

  function closeAddPint() {
      setOpen(false)
  }

  const classes = useStyles();

  return (
            <div className={classes.root}>
                <Box m={3}>
                       <Grid container>
                           <Grid item  lg={2} md={2} sm={2}
                                 className={classes.navMenuItem}
                                 style={window.location.pathname === '/' ? {backgroundColor: '#f2f2f2'} : null}>
                               <Link onClick={() => setCurrentPage('home')}
                                     className={classes.navMenuItemsText} to='/'>Home</Link>
                           </Grid>
                           <Grid item lg={2} md={2} sm={2}
                                 className={classes.navMenuItem}
                                 style={window.location.pathname === '/top-pints' ? {backgroundColor: '#f2f2f2'} : null}>
                                <Link onClick={() => setCurrentPage('topPints')}
                                      className={classes.navMenuItemsText} to='/top-pints'>Top Pints</Link>
                           </Grid>
                            <Grid item lg={2} md={2} sm={2}
                                  className={classes.navMenuItem}
                                  style={window.location.pathname === '/venues' ? {backgroundColor: '#f2f2f2'} : null}>
                                 <Link onClick={() => setCurrentPage('venues')}
                                     className={classes.navMenuItemsText} to='/venues'>Locations</Link>

                           </Grid>
                            <Grid item lg={2} md={2} sm={2}
                                  className={classes.navMenuItem}
                                  style={window.location.pathname === '/about' ? {backgroundColor: '#f2f2f2'} : null}>
                                  <Link onClick={() => setCurrentPage('about')}
                                     className={classes.navMenuItemsText} to='/about'>About</Link>
                           </Grid>
                            <Grid item lg={4} md={4} sm={4}
                                  className={classes.addEntryDiv}>
                               <Button className={classes.addEntryButton}
                                       onClick={() => setOpen(true)} >Add Pint Entry</Button>
                           </Grid>
                       </Grid>
                </Box>
                {
                    open ?
                        <AddPintEntry open={open} close={closeAddPint} entryMade={setPintEntryMade}/> : null
                }
                {
                    pintEntryMade ?
                        <SuccessMessage/> : null
                }

            </div>
      );
}