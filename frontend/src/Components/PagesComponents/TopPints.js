import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchBar from "material-ui-search-bar";
import {TableBody, TableCell, TableRow, TableHead, Table, CircularProgress, TableContainer,
        Box, Grid, Paper} from "@material-ui/core/";

import styles from '../../styles.module.css'
import {Divider, List, ListItem, ListItemSecondaryAction, ListItemText, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    tableHeadText: {
        fontWeight: 650
    },
    progressLoader: {
       color: '#e68a00',
       position: 'relative',
       marginTop: '20px',
       marginLeft: '45%'
  },
   table: {
       height: 550,
       overflow: 'scroll',
       border: '1px',
       borderStyle: 'solid',
       borderColor: 'grey',
       display: 'none',
        [theme.breakpoints.up('md')]: {
              display: 'block',}
   },
   topPintsTable: {
       height: 600,
       overflow: 'scroll',
       border: '1px',
       borderStyle: 'solid',
       borderColor: 'grey',
    },
    listItem: {
        "& .MuiListItemText-primary": {
            fontSize: 12
        },
         "& .MuiListItemText-secondary": {
            fontSize: 12
        },
    },
    title: {
        fontSize: 20,
        fontWeight: 650,
        display: 'flex',
        color: 'grey',
        justifyContent: 'center',
        paddingBottom: 15
    },


}));

export default function TopPints() {

  const [topPintsList, setTopPintsList] = useState()
  const [backUpTopPintsList, setBackUpTopPintsList] = useState([])
  const classes = useStyles();

  useEffect(() => {
       fetch("http://127.0.0.1:8000/api/top-pints")
             .then((response) => response.json())
             .then((data) => {
                 setTopPintsList(data)
                 setBackUpTopPintsList(data)})
  }, [])

  function SearchLocation(searchTerm) {

      let newArray = []

      for (const i in backUpTopPintsList){
          const obj = backUpTopPintsList[i]
          if (obj.location.toUpperCase().includes(searchTerm.toUpperCase())){
                      newArray.push(obj)
          }
      }
      setTopPintsList(newArray)
  }

  return (
    <div className={classes.root}>
        <Box>
            <Divider/>
            {topPintsList ?
                <Grid container>
                    {//<Grid item xs={12} md={12} lg={12}>
                       // <SearchBar placeholder='Search Location'
                                   //onChange={(searchTerm) => SearchLocation(searchTerm)}/>
                    //</Grid>
                    }
                    <Grid style={{paddingTop: 20}} item xs={12} md={12} lg={12}>
                        <Grid>
                            <Typography className={classes.title}>Top Pints in the UK, as Rated By You</Typography>
                        </Grid>
                        <Paper>
                            <TableContainer component={Paper} className={classes.table}>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.tableHeadText}>Rank</TableCell>
                                            <TableCell className={classes.tableHeadText}>Beer</TableCell>
                                            <TableCell className={classes.tableHeadText}>Size</TableCell>
                                            <TableCell className={classes.tableHeadText}>Price</TableCell>
                                            <TableCell className={classes.tableHeadText}>Location</TableCell>
                                            <TableCell className={classes.tableHeadText}>Venue</TableCell>
                                            <TableCell className={classes.tableHeadText}>Ratings</TableCell>
                                            <TableCell className={classes.tableHeadText}>Venue</TableCell>
                                            <TableCell className={classes.tableHeadText}>Atmosphere</TableCell>
                                            <TableCell className={classes.tableHeadText}>Taste</TableCell>
                                            <TableCell className={classes.tableHeadText} align="right">
                                                            Overall</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                                topPintsList.map((pintEntry, index) => {
                                                    return (
                                                        <TableRow hover={true} key={index}>

                                                            <TableCell>{pintEntry.rank}</TableCell>
                                                            <TableCell>{pintEntry.beer} ({pintEntry.brewery})</TableCell>
                                                            <TableCell>Pint</TableCell>
                                                            <TableCell>£{pintEntry.price}</TableCell>
                                                            <TableCell>{pintEntry.location}</TableCell>
                                                            <TableCell>{pintEntry.venue.name}</TableCell>
                                                            <TableCell>{pintEntry.ratings}</TableCell>
                                                            <TableCell>{pintEntry.atmosphere_rating}/10</TableCell>
                                                            <TableCell>{pintEntry.atmosphere_rating}/10</TableCell>
                                                            <TableCell>{pintEntry.taste_rating}/10</TableCell>
                                                            <TableCell align="right" style={{fontWeight: 650}}>
                                                                       {pintEntry.overall_rating}/10</TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box display={{md: 'none' }}>
                                  <List dense={true} className={classes.topPintsTable}>
                                {
                                        topPintsList.map((entry, index) => {
                                            const rankAndBeer = `${entry.rank}. ${entry.beer} (${entry.brewery})`
                                            const venueAndLocation = `${entry.venue.name}(${entry.location}), Price: £${entry.price}, (${entry.ratings} Rating/s)`
                                            return (
                                                <ListItem key={index} style={{height: 55}} dense={true}>
                                                    <ListItemText className={classes.listItem} primary={rankAndBeer} secondary={venueAndLocation}/>
                                                    <ListItemSecondaryAction
                                                        style={{fontWeight: 650, fontSize: 12}}>{entry.overall_rating}/10</ListItemSecondaryAction>
                                                </ListItem>
                                            )
                                        })
                                }
                                </List>
                            </Box>

                        </Paper>
                    </Grid>
                    <br/>
                    <br/>
                    <Divider/>
                </Grid> : <CircularProgress className={classes.progressLoader} />
            }
            <br/>
            <Divider/>
        </Box>
    </div>
  );
}