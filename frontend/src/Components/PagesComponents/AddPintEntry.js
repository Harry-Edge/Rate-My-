import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from "@material-ui/core/Button";
import {Snackbar, TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import GoogleMapsSearch from "../MiscComponents/GMapsLocationSearch";

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 25,
        fontWeight: 650,
        display: 'flex',
        color: 'grey',
        justifyContent: 'center'
    },
    textField: {
        width: 400,
        marginTop: 15
    },
    textBox: {
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "grey",
            },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "grey"
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "grey"
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
              color: "grey",
                fontWeight: 650,
            },
            "& .MuiInputLabel-outlined": {
              color: "grey",
                fontWeight: 650,
            },
            "&:hover .MuiInputLabel-outlined": {
              color: "grey",
                fontWeight: 650,
            },
            "& .MuiInputLabel-outlined.Mui-focused": {
              color: "grey",
                fontWeight: 650,
            },
            width: 400,
            marginTop: 15,
            color: "grey",
            fontWeight: 650,
    },
    dropDownVenues: {
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderColor: 'grey',
        width: '98%',
    },
    searchVenue: {
        marginTop: 15,
        width: '99%',
        height: 53,
        fontSize: 17,
        fontColor: 'grey',
        fontWeight: 650,
        border: "1px",
        borderRadius: "4px",
        borderColor: 'grey',
        borderStyle: 'solid',
    },
    closeButton: {
        backgroundColor: 'red',
        color: 'white',
        fontWeight: 650
    },
    submitButton: {
        backgroundColor: 'green',
        color: 'white',
        fontWeight: 650
    }
}));

const beerServingSizes = [
    'Stein',
    'Pint',
    'Schooner',
    'Half-Pint',
    '1/3 Pint'
]

export default function AddPintEntry(props) {
  const classes = useStyles()

  const [beerNames, setBeerNames] = useState([])
  const [beerNameChosen, setBeerNameChosen] = useState()
  const [breweryChosen, setBreweryChosen] = useState()
  const [venueChosen, setVenueChosen] = useState()
  const [priceChosen, setPriceChosen] = useState()
  const [venueRating, setVenueRating] = useState()
  const [servingSize, setServingSize] = useState()
  const [atmosphereRating, setAtmosphereRating] = useState()
  const [tasteRating, setTasteRating] = useState()
  const [submittedBy, setSubmittedBy] = useState()


  const [priceValidationError, setPriceValidationError] = useState(false)
  const [venueRatingValidationError, setVenueRatingValidationError] = useState(false)
  const [atmosphereRatingError, setAtmosphereRatingError] = useState(false)
  const [tasteRatingError, setTasteRatingError] = useState(false)


  useEffect (() => {
        fetch("http://127.0.0.1:8000/api/get-beer-names")
             .then((response) => response.json())
             .then((data) => {
               setBeerNames(data)
             })

    },[])

  function submitRating () {
      const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({beer: {name: beerNameChosen, brewery: breweryChosen},
                                        venue: venueChosen,
                                        serving_size: servingSize,
                                        price: priceChosen,
                                        venue_rating: venueRating,
                                        atmosphere_rating: atmosphereRating,
                                        taste_rating: tasteRating,
                                        submitted_by: submittedBy ? submittedBy : "Anonymous User"})
      }
      fetch("http://127.0.0.1:8000/api/submit-rating", requestOptions)
         .then((response) => response.json())
         .then((data) => {
             if (data === "Pint Entry Added Successfully"){
                 console.log(data)
                 props.entryMade(true)
             }
         })
  }

  function checkPriceIsValid(price) {
         if (price > 1 && price <= 10){
            setPriceChosen(price)
            setPriceValidationError(false)
        }else{
            setPriceValidationError(true)
        }
  }
  function checkRatingIsValid(rating) {
      if (rating >= 0 && rating <=10 ){
          return true
      }else {
          return false
      }
  }
  function checkVenueRatingIsValid(rating) {
      if (checkRatingIsValid(rating)) {
          setVenueRating(rating)
          setVenueRatingValidationError(false)
      }else{
          setVenueRatingValidationError(true)
      }
  }
  function checkAtmosphereRatingIsValid(rating){
      if (checkRatingIsValid(rating)) {
          setAtmosphereRating(rating)
          setAtmosphereRatingError(false)
      }else{
          setAtmosphereRatingError(true)
      }
  }
  function checkTasteRatingIsValid(rating){
      if(checkRatingIsValid(rating)){
          setTasteRating(rating)
          setTasteRatingError(false)
      }else {
          setTasteRatingError(true)
      }
  }

  return (
      <Dialog open={props.open} >
        <DialogTitle><Typography className={classes.title}>Add Pint Entry</Typography></DialogTitle>
        <DialogContent style={{width: 400 }}>
            {
                beerNames ?
                         <div>
                         <Autocomplete
                             options={beerNames}
                             freeSolo
                             getOptionLabel={(option) => `${option.name} (${option.brewery})`}
                             onChange={(event, value) =>
                                        {
                                         if(value.name){
                                             setBeerNameChosen(value.name)
                                         }
                                         if (value.brewery) {
                                             setBreweryChosen(value.brewery)
                                         }}}
                             renderInput={(parmas) => <
                                 TextField {...parmas} variant='outlined'
                                           label='Beer Name'
                                           size="small"
                                           className={classes.textBox}
                                           //inputlabelprops={{classes: {root: classes.textBox}}}
                                           onChange={(event) => {
                                               setBeerNameChosen(event.target.value)
                                           }}/>}
                         />
                          <Autocomplete
                             options={beerNames}
                             inputValue={breweryChosen ? breweryChosen : ''}
                             freeSolo
                             getOptionLabel={(option) => option.brewery}
                             onChange={(event, value) => setBreweryChosen(value.brewery)}
                             renderInput={(parmas) => <
                                 TextField {...parmas} variant='outlined'
                                           label='Brewery (Leave Blank if Unknown)'
                                           size="small"
                                           className={classes.textBox}
                                           onChange={(event) => {
                                               setBreweryChosen(event.target.value)}}/>}
                         />
                         </div>
                         : null
            }
           <GoogleMapsSearch venueChosen={setVenueChosen}/>
           <Autocomplete
                             options={beerServingSizes}
                             freeSolo
                             getOptionLabel={(option) => option}
                             onChange={(event, value) => setServingSize(value)}
                             renderInput={(parmas) => <
                                 TextField {...parmas} variant='outlined'
                                           label='Beer Serving Size'
                                           size="small"
                                           className={classes.textBox}
                                           //inputLabelProps={{classes: {root: classes.textBox}}}
                                           onChange={(event) => {
                                               setServingSize(event.target.value)
                                           }}/>}
                         />
           <TextField
               error={priceValidationError}
               helperText={priceValidationError ? "Must be between 1-10" : null}
               className={classes.textBox} label="Price (£)" variant="outlined" size="small"
                        onChange={(e) =>
                            checkPriceIsValid(e.target.value)}/>
           <TextField className={classes.textBox} label="Venue (/10)" variant="outlined" size="small"
                      error={venueRatingValidationError}
                      helperText={venueRatingValidationError ? "Must be between 0-10" : null}
                      onChange={(e) =>
                                    checkVenueRatingIsValid(e.target.value)}/>
           <TextField className={classes.textBox} label="Atmosphere (/10)" variant="outlined" size="small"
                      error={atmosphereRatingError}
                      helperText={atmosphereRatingError ? "Must be between 0-10" : null}
                      onChange={(e) =>
                                     checkAtmosphereRatingIsValid(e.target.value)}  />
           <TextField className={classes.textBox} label="Taste (/10)" variant="outlined" size="small"
                      error={tasteRatingError}
                      helperText={tasteRatingError ? "Must be between 0-10" : null}
                      onChange={(e) =>
                                     checkTasteRatingIsValid(e.target.value)} />
           <TextField className={classes.textBox} label="Submitted By... (Optional)" variant="outlined" size="small"
                      onChange={(e) =>
                                     setSubmittedBy(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.close()} className={classes.closeButton} variant='contained'>
            Close
          </Button>
           <Button className={classes.submitButton}
                   variant='contained'
                   onClick={() => {
                       submitRating()
                       props.close()
                   }}>Submit
          </Button>
        </DialogActions>
      </Dialog>
  );
}
