import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import Grid from "@material-ui/core/Grid";
import {Divider, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, Typography,
        CircularProgress} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";



const useStyles = makeStyles((theme) => ({
    resultsTable: {
        height: 600,
        overflow: 'scroll'
    },
    title: {
        fontSize: 35,
        fontWeight: 650,
        color: 'grey',
        paddingBottom: 20
    },
    boxesTitle: {
        fontWeight: 650,
        fontSize: 25
    },
    box: {
        border: '1px',
       borderStyle: 'solid',
       borderColor: 'grey',
    },
    infoText: {
        fontSize: 13,
        fontWeight: 650
    },
    listItem: {
        "& .MuiListItemText-primary": {
            fontSize: 12
        },
         "& .MuiListItemText-secondary": {
            fontSize: 12
        },
    },
    progressLoader: {
       color: '#e68a00',
       position: 'relative',
       marginTop: '20px',
       marginLeft: '45%'
    },
}));

export default function Venues() {
    const classes = useStyles()

    const [searchResults, setSearchResults] = useState([])
    const [locationsData, setLocationsData] = useState()

    function search(searchTerm) {
      if(searchTerm ){
          const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'} ,
                body: JSON.stringify({location: searchTerm})
          }

          fetch("http://127.0.0.1:8000/api/search-location", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                 setSearchResults(data)
             })
      }else {
          setSearchResults([])
      }
    }

    useEffect(() => {
       fetch("http://127.0.0.1:8000/api/get-most-popular-locations")
             .then((response) => response.json())
             .then((data) => {
                 console.log(data)
                 setLocationsData(data)
             })
    }, [])

  return (
    <div className={classes.root}>
        {locationsData ?
            <Box>
                <Divider/>
                <br/>
                <Grid container>
                    { /*
                        <Grid item xs={12} md={12} lg={12}>
                            <SearchBar placeholder='Search Location or Venue'
                                       style={{border: '2px', borderStyle: 'solid', borderColor: 'grey'}}
                                       onChange={(searchTerm) => search(searchTerm)}/>
                        </Grid>
                        <Grid style={{paddingTop: 20}} item xs={12} md={12} lg={12}>
                    {searchResults.length ?
                        <Paper style={{border: '2px', borderStyle: 'solid', borderColor: 'grey'}}>
                        </Paper> : null
                    }
                        </Grid> */
                    }
                    <Grid item xs={12}><Typography className={classes.title}>Most Popular Locations</Typography></Grid>
                    <Grid container spacing={2}>
                        {
                            locationsData.map((location, index) => {
                                return (
                                 <Grid key={index} item lg={4} md={4} sm={12}>
                                    <Paper className={classes.box}>
                                        <Box m={2}>
                                            <Typography className={classes.boxesTitle}>{location.location}</Typography>
                                            <Divider/>
                                            <Grid container style={{paddingTop: 10}}>
                                                <Grid item xs={4}>
                                                    <Typography className={classes.infoText}>Total Beer Ratings</Typography>
                                                    <Typography className={classes.infoText}
                                                                style={{color: 'grey'}}>{location.total_ratings}</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography className={classes.infoText}>Most Popular Beer</Typography>
                                                    <Typography className={classes.infoText}
                                                                style={{color: 'grey'}}>{location.most_popular_beer.name}
                                                                ({location.most_popular_beer.brewery})</Typography>

                                                </Grid>
                                                <Grid style={{paddingTop: 10}} xs={12}>
                                                    <Typography style={{fontSize: 20}}>Popular Venues</Typography>
                                                    <List dense={true}>
                                                        {
                                                            location.most_popular_venues.map((venue, index) => {
                                                                return (
                                                                 <ListItem key={index} style={{height: 40}} dense={true}>
                                                                    <ListItemText className={classes.listItem} primary={venue.name}
                                                                                  secondary={venue.street}/>
                                                                    <ListItemSecondaryAction
                                                                        style={{fontWeight: 650, fontSize: 12}}>{venue.ratings} Ratings
                                                                    </ListItemSecondaryAction>
                                                                </ListItem>
                                                                )
                                                            })
                                                        }
                                                    </List>
                                                </Grid>
                                                <Grid style={{paddingTop: 10}} xs={12}>
                                                    <Typography style={{fontSize: 20}}>Top Rated Venues For Pints</Typography>
                                                    <List dense={true}>
                                                        {
                                                            location.top_rated_venues_for_pints.map((venue, index) => {
                                                                return (
                                                                   <ListItem style={{height: 40}} dense={true}>
                                                                        <ListItemText className={classes.listItem} primary={venue.name}
                                                                                      secondary={venue.street}/>
                                                                        <ListItemSecondaryAction
                                                                            style={{fontWeight: 650, fontSize: 12}}>{venue.average_pint_rating} Ratings</ListItemSecondaryAction>
                                                                   </ListItem>
                                                                )
                                                            })
                                                        }
                                                    </List>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Paper>
                                </Grid>
                                )
                            })
                        }
                    </Grid>
                </Grid>
                <br/>
                <Divider/>
            </Box> : <CircularProgress className={classes.progressLoader} />
        }
    </div>
  );
}


