import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import SearchBar from "material-ui-search-bar";
import Box from '@material-ui/core/Box'
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

const useStyles = makeStyles((theme) => ({
    tableHeadText: {
        fontWeight: 650
    }

}));

export default function TopPints() {

  const [topPintsList, setTopPintsList] = useState([])
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
          const obj = topPintsList[i]

           if (obj.location.toUpperCase().includes(searchTerm.toUpperCase())){
                      console.log("here")
                      newArray.push(obj)
           }
      }
      setTopPintsList(newArray)

  }

  return (
    <div className={classes.root}>
        <Box m={3}>
            <Grid container>
                <Grid item xs={12} md={12} lg={12}>
                    <SearchBar placeholder='Search Location'
                               onChange={(searchTerm) => SearchLocation(searchTerm)} />
                </Grid>
                {topPintsList ? console.log(topPintsList) : null}
                <Grid style={{paddingTop: 20}} item xs={12} md={12} lg={12}>
                    <Paper>
                        <TableContainer component={Paper}>
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
                                        <TableCell className={classes.tableHeadText} align="right">Overall User Rating</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        topPintsList ?
                                            topPintsList.map((pintEntry, index) => {
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
                                            }): null
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    </div>
  );
}