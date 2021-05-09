import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";


const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 100,
    },
    textField: {
        width: 400,
        marginTop: 15
    }
}));

export default function AddPintEntry(props) {
  const classes = useStyles()

  const [beerNames, setBeerNames] = useState([])
  const [beerNameChosen, setBeerNameChosen] = useState()
  const [breweryChosen, setBreweryChosen] = useState()
  const [priceChosen, setPriceChosen] = useState()

  useEffect (() => {
        fetch("http://127.0.0.1:8000/api/get-beer-names")
             .then((response) => response.json())
             .then((data) => {
                console.log(data)
               setBeerNames(data)
             })

    },[])

  function submitRating () {

      console.log(beerNameChosen)
      const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({beer_name: beerNameChosen, brewery_name: breweryChosen, price: priceChosen})
      }
      fetch("http://127.0.0.1:8000/api/submit-rating", requestOptions)
         .then((response) => response.json())
         .then((data) => {
             console.log(data)
         })
  }

  return (
      <Dialog open={props.open} >
        <DialogTitle className={classes.title}>Add Pint Entry</DialogTitle>
        <DialogContent style={{width: 400 }}>
            {
                beerNames ?
                         <div>
                         <Autocomplete
                             options={beerNames}
                             freeSolo
                             getOptionLabel={(option) => option.name}
                             onChange={(event, value) => setBeerNameChosen(value.name)}
                             renderInput={(parmas) => <
                                 TextField {...parmas} variant='outlined'
                                           label='Beer Name'
                                           onChange={(event) => {
                                               console.log(event.target.value)
                                               setBeerNameChosen(event.target.value)
                                           }}/>}
                         />
                          <Autocomplete
                             className={classes.textField}
                             options={beerNames}
                             freeSolo
                             getOptionLabel={(option) => option.brewery}
                              onChange={(event, value) => setBreweryChosen(value.brewery)}
                             renderInput={(parmas) => <
                                 TextField {...parmas} variant='outlined'
                                           label='Brewery'
                                            onChange={(event) => {
                                               setBreweryChosen(event.target.value)}}/>}
                         />
                         </div>
                         : null
            }
           <TextField className={classes.textField} label="Price (£)" variant="outlined"
                        onChange={(e) => setPriceChosen(e.target.value)}/>
           <TextField className={classes.textField} label="Location" variant="outlined"/>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.close()} style={{backgroundColor: 'red', color: 'white', fontWeight: 650}} variant='contained'>
            Close
          </Button>
           <Button style={{backgroundColor: 'green', color: 'white', fontWeight: 650}}
                   variant='contained'
                   onClick={() => submitRating()}>Submit
          </Button>
        </DialogActions>
      </Dialog>
  );
}