import '../App.css'
import React, { useState } from 'react';
import Header from "./NavComponents/Header";
import MainNavigation from "./NavComponents/Navigation";
import Box from '@material-ui/core/Box';
import Home from "./PagesComponents/Home";
import TopPints from "./PagesComponents/TopPints";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {makeStyles} from "@material-ui/core/styles";
import Venues from "./PagesComponents/Venues";
import About from "./PagesComponents/About";
import Footer from "./NavComponents/Footer";
import {useLoadScript} from "@react-google-maps/api";
import Geocode from "react-geocode";

const useStyles = makeStyles((theme) => ({
    body: {
        backgroundColor: '#f1f1f1'
    }
}));

const libraries = ['places']

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

function RateMyPint() {
  const [currentPage, setCurrentPage] = useState('home');
  //const classes = useStyles();


  const {isLoaded} = useLoadScript(
      {
          googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          libraries
      }
  )

  return (
    <Router>
    <div >
        <Header/>
        <Box m={4}>
            <MainNavigation changePage={setCurrentPage} currentPage={currentPage}/>
             <Switch>
                <Route exact path='/' component={Home}>
                    <Home gMapsApiKeyAndLibraryLoaded={isLoaded}/>
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
        <Footer/>
    </div>
    </Router>
  );
}

export default RateMyPint;
