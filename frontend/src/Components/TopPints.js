import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid';
import SearchBar from "material-ui-search-bar";
import Box from '@material-ui/core/Box'
import TableContainer from "@material-ui/core/TableContainer";
import CircularProgress from '@material-ui/core/CircularProgress'
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import styles from '../styles.module.css'
import {Divider} from "@material-ui/core";

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
       height: 600,
       overflow: 'scroll',
       border: '2px',
       borderStyle: 'solid',
       borderColor: 'grey'
   }

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
                        <Paper>
                            <TableContainer component={Paper} className={classes.table}>
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
                                                })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
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