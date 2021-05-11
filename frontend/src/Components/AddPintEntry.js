import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import usePlaceAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
    ComboboxPopover
} from "@reach/combobox";

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 100,
    },
    textField: {
        width: 400,
        marginTop: 15
    },
    dropDownVenues: {
        zIndex: 9999,
        position: 'absolute',
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderColor: 'grey',
        width: '98%',
    },
    searchVenue: {
        marginTop: 15,
        width: '98%',
        height: 50,
        fontSize: 17,
        fontColor: 'grey',
        borderColor: 'grey',
        borderStyle: 'solid',
    }
}));

const libraries = ['places']

export default function AddPintEntry(props) {
  const classes = useStyles()

  const [beerNames, setBeerNames] = useState([])
  const [beerNameChosen, setBeerNameChosen] = useState()
  const [breweryChosen, setBreweryChosen] = useState()
  const [venueChosen, setVenueChosen] = useState()
  const [priceChosen, setPriceChosen] = useState()

  const [priceValidationError, setPriceValidationError] = useState(false)

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
            body: JSON.stringify({beer_name: beerNameChosen, brewery_name: breweryChosen, price: priceChosen})
      }
      fetch("http://127.0.0.1:8000/api/submit-rating", requestOptions)
         .then((response) => response.json())
         .then((data) => {
             console.log(data)
         })
  }

  function checkPriceIsValid(price) {
         if (price > 0 && price <= 10){
            console.log("herer")
            setPriceChosen(price)
            setPriceValidationError(false)
        }else{
            console.log("cock")
            setPriceValidationError(true)
        }
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
                             getOptionLabel={(option) => `${option.name} (${option.brewery})`}
                             onChange={(event, value) => setBeerNameChosen(value.name)}
                             renderInput={(parmas) => <
                                 TextField {...parmas} variant='outlined'
                                           label='Beer Name'
                                           onChange={(event) => {
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
           <Search/>
           <TextField
               error={priceValidationError}
               helperText={priceValidationError ? "Must be between 1-10" : null}
               className={classes.textField} label="Price (£)" variant="outlined"
                        onChange={(e) =>
                            checkPriceIsValid(e.target.value)}/>
           <TextField className={classes.textField} label="Value For Money (/10)" variant="outlined"/>
           <TextField className={classes.textField} label="Atomosphere (/10)" variant="outlined"/>
           <TextField className={classes.textField} label="Taste (/10)" variant="outlined"/>
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

function Search(props){

    const  classes = useStyles()

    const {ready, value, suggestions: {status, data}, setValue, clearSuggestions} = usePlaceAutocomplete({
        requestOptions: {location: {lat: () => 53.480759, lng: () => -2.242631}, // auto complete based on users location
                        radius: 400}
    })

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions()
        try {
            const results = await getGeocode({address})
            await props.setCurrentLocation(results[0].address_components[0].long_name)
            const {lat, lng} = await getLatLng(results[0])
            props.panTo({lat: lat, lng: lng, panLvl: 14})
            props.getTopRatedPints(results[0].address_components[0].long_name)
        }catch (error){
            console.log("Error:", error)
        }
    }

    return <div>
            <Combobox onSelect={handleSelect}>
                    <ComboboxInput value={value} onChange={(e) => {
                        setValue(e.target.value)}}
                        disabled={!ready}
                        className={classes.searchVenue}
                        placeholder=" Search Venue Name (Bar, Restruant, Pub"/>
                    <ComboboxPopover>
                        <ComboboxList
                                    className={classes.dropDownVenues}>
                            {   status === "OK" && data.map(({description}, index) => (
                                <ComboboxOption key={index} value={" " + description}><ComboboxOptionText/></ComboboxOption>))
                            }
                        </ComboboxList>
                    </ComboboxPopover>
                </Combobox>
           </div>
}