import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import Grid from "@material-ui/core/Grid";
import {Divider, Paper} from "@material-ui/core";
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
    }


}));

export default function Venues() {
    const classes = useStyles()

    const [searchResults, setSearchResults] = useState([])

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

  return (
    <div className={classes.root}>
        <Box>
            <Divider/>
            <br/>
            <Grid container>
               <Grid item xs={12} md={12} lg={12}>
                        <SearchBar placeholder='Search Location or Venue'
                                   style={{ border: '2px', borderStyle: 'solid', borderColor: 'grey'}}
                                   onChange={(searchTerm) => search(searchTerm)}/>
                </Grid>
                <Grid style={{paddingTop: 20}} item xs={12} md={12} lg={12}>
                    { searchResults.length ?
                        <Paper style={{   border: '2px', borderStyle: 'solid', borderColor: 'grey'}}>
                            <TableContainer component={Paper} className={classes.resultsTable}>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.tableHeadText}>Rank</TableCell>
                                            <TableCell className={classes.tableHeadText}>Brewery</TableCell>
                                            <TableCell className={classes.tableHeadText}>Beer</TableCell>
                                            <TableCell className={classes.tableHeadText}>Size</TableCell>
                                            <TableCell className={classes.tableHeadText}>Average Price</TableCell>
                                            <TableCell className={classes.tableHeadText}>Location</TableCell>
                                            <TableCell className={classes.tableHeadText}>Venue</TableCell>
                                            <TableCell className={classes.tableHeadText} align="right">Overall User
                                                Rating</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            searchResults.map((pintEntry, index) => {
                                                return (
                                                    <TableRow hover={true} key={index}>
                                                        <TableCell>{pintEntry.rank}</TableCell>
                                                        <TableCell>{pintEntry.brewery}</TableCell>
                                                        <TableCell>{pintEntry.beer}</TableCell>
                                                        <TableCell>Pint</TableCell>
                                                        <TableCell>£{pintEntry.price}</TableCell>
                                                        <TableCell>{pintEntry.location}</TableCell>
                                                        <TableCell>{pintEntry.venue}</TableCell>
                                                        <TableCell align="right">{pintEntry.rating}/10</TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper> : null
                    }
                </Grid>
            </Grid>
            <br/>
            <Divider/>
        </Box>
    </div>
  );
}


