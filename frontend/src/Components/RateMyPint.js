import '../App.css'
import React, { useState } from 'react';
import Header from "./Header";
import MainNavigation from "./Navigation";
import Box from '@material-ui/core/Box';
import Home from "./Home";
import TopPints from "./TopPints";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import {makeStyles} from "@material-ui/core/styles";
import Venues from "./Venues";
import About from "./About";

const useStyles = makeStyles((theme) => ({
    body: {
        backgroundColor: '#f1f1f1'
    }
}));


function RateMyPint() {
  const [currentPage, setCurrentPage] = useState('home');
  const classes = useStyles();



  return (
    <Router>
    <div >
        <Header/>
        <Box m={4}>
            <MainNavigation changePage={setCurrentPage} currentPage={currentPage}/>

                 <Switch>
                    <Route exact path='/' component={Home}>
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
        </Box>
    </div>
    </Router>
  );
}

export default RateMyPint;
