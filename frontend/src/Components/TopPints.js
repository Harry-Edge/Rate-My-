import React from 'react';
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

}));

export default function TopPints() {

  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Box m={3}>
            <Grid container>
                <Grid item xs={12} md={12} lg={12}>
                    <SearchBar placeholder='Search Location'/>
                </Grid>
                <Grid style={{paddingTop: 20}} item xs={12} md={12} lg={12}>
                    <Paper>
                        <Typography>Test</Typography>
                        <TableContainer component={Paper}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Rank</TableCell>
                                    </TableRow>
                                </TableHead>

                            </Table>

                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    </div>
  );
}