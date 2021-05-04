import '../App.css'
import React, { useState } from 'react';
import Header from "./Header";
import MainNavigation from "./Navigation";
import Box from '@material-ui/core/Box';
import Home from "./Home";
import TopPints from "./TopPints";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    body: {
        backgroundColor: '#f1f1f1'
    }
}));


function RateMyPint() {
  const [currentPage, setCurrentPage] = useState('home');
  const classes = useStyles();


  return (
    <div >
        <Header/>
        <Box m={4}>
            <MainNavigation changePage={setCurrentPage} currentPage={currentPage}/>
        </Box>
    </div>
  );
}

export default RateMyPint;
