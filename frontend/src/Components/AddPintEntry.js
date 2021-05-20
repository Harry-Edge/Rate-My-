import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from "@material-ui/core/Button";
import {TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import usePlaceAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
    ComboboxPopover
} from "@reach/combobox";

import GoogleMapsSearch from "./test";

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

const libraries = ['places']

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
  const [valueRating, setValueRating] = useState()
  const [servingSize, setServingSize] = useState()
  const [atmosphereRating, setAtmosphereRating] = useState()
  const [tasteRating, setTasteRating] = useState()
  const [submittedBy, setSubmittedBy] = useState()


  const [priceValidationError, setPriceValidationError] = useState(false)
  const [valueRatingValidationError, setValueRatingValidationError] = useState(false)
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
                                        value_for_money_rating: valueRating,
                                        atmosphere_rating: atmosphereRating,
                                        taste_rating: tasteRating, })
      }
      fetch("http://127.0.0.1:8000/api/submit-rating", requestOptions)
         .then((response) => response.json())
         .then((data) => {
             console.log(data)
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
  function checkValueForMoneyIsValid(rating) {
      if (checkRatingIsValid(rating)) {
          setValueRating(rating)
          setValueRatingValidationError(false)
      }else{
          setValueRatingValidationError(true)
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
                                        {setBeerNameChosen(value.name)
                                         if (value.brewery) {
                                             setBreweryChosen(value.brewery)
                                             console.log("here")
                                         }}}
                             renderInput={(parmas) => <
                                 TextField {...parmas} variant='outlined'
                                           label='Beer Name'
                                           size="small"
                                           className={classes.textBox}
                                           inputLabelProps={{classes: {root: classes.textBox}}}
                                           onChange={(event) => {
                                               setBeerNameChosen(event.target.value)
                                           }}/>}
                         />
                          <Autocomplete
                             options={beerNames}
                             inputValue={breweryChosen ? breweryChosen : ''}
                             freeSolo
                             defaultValue={breweryChosen ? breweryChosen : null}
                             getOptionLabel={(option) => option.brewery}
                             onChange={(event, value) => setBreweryChosen(value.brewery)}
                             renderInput={(parmas) => <
                                 TextField {...parmas} variant='outlined'
                                           label='Brewery'
                                           size="small"
                                           defaultValue="ueyeyey"
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
                                           inputLabelProps={{classes: {root: classes.textBox}}}
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
           <TextField className={classes.textBox} label="Value For Money (/10)" variant="outlined" size="small"
                      error={valueRatingValidationError}
                      helperText={valueRatingValidationError ? "Must be between 0-10" : null}
                      onChange={(e) =>
                                    checkValueForMoneyIsValid(e.target.value)}/>
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
                       console.log("beername", beerNameChosen)
                       console.log("breweryname", breweryChosen)
                       console.log('serving', servingSize)
                       console.log("price", priceChosen)
                       console.log("venue", venueChosen)
                       console.log("value", valueRating)
                       console.log('atmospg', atmosphereRating)
                       console.log('taste:', tasteRating)
                       console.log('sub by', submittedBy)
                       submitRating()
                   }}>Submit
          </Button>
        </DialogActions>
      </Dialog>
  );
}

function Search(props){

    const  classes = useStyles()

    const {ready, value, suggestions: {status, data}, setValue, clearSuggestions} = usePlaceAutocomplete({
        requestOptions: {location: {lat: () => 53.480759, lng: () => -2.242631}, // auto complete based on users location
                        radius: 400}
    })

    const handleSelect = (address) => {
        console.log(address)
        console.log("here")
        setValue(address, false);
        clearSuggestions()
    }

    return <div>
            <Combobox onSelect={handleSelect}
            >
                    <ComboboxInput value={value} onChange={(e) => {
                        setValue(e.target.value)}}
                        disabled={!ready}
                        className={classes.searchVenue}
                        placeholder=" Search Venue Name (Bar, Restaurant, Pub)"/>
                    <ComboboxPopover>
                        <ComboboxList style={{zIndex: 2000, position: 'absolute'}}
                                    className={classes.dropDownVenues}>
                            {   status === "OK" && data.map(({description}, index) => (
                                <ComboboxOption key={index}
                                                value={" " + description}><ComboboxOptionText/></ComboboxOption>))
                            }
                        </ComboboxList>
                    </ComboboxPopover>
                </Combobox>
           </div>
}