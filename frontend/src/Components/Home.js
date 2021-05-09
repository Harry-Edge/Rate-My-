import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper, Divider, TextField} from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import {GoogleMap, useJsApiLoader, useLoadScript,} from "@react-google-maps/api";
import {CircularProgress} from "@material-ui/core";
import mapStyles from "./mapStyles";
import {ListItemSecondaryAction, ListItemText, ListItem, List} from "@material-ui/core";
import ExploreIcon from '@material-ui/icons/Explore';
import usePlaceAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {Combobox, ComboboxInput, ComboboxPopover,
        ComboboxList, ComboboxOption, ComboboxOptionText} from "@reach/combobox";
import "@reach/combobox/styles.css";
import Geocode from 'react-geocode';

const useStyles = makeStyles((theme) => ({
    topPintsAreaText: {
        fontWeight: 650,
        color: 'grey',
        fontSize: 20,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 7
    },
    listItemText: {
        fontSize: 10
    },
    progressLoader: {
       color: '#e68a00',
       position: 'relative',
       marginTop: '20px',
       marginLeft: '45%'
    },
    search: {
          position: 'absolute',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '400px',
          zIndex: '10'
    },
    locate: {
        position: 'absolute',
        marginTop: 10,
        marginLeft: 10,
        background: 'none',
        border: 'none',
        fontSize: 35,
        zIndex: 10,
          '&:hover': {
          color: '#595959',

         },
    }

}));

const libraries = ['places']

export default function Home() {

  const classes = useStyles();

  const [topRatedPintsInArea, setTopRatedPintsInArea] = useState()
  const [currentLocation, setCurrentLocation] = useState()

  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {
      console.log(map)
      mapRef.current = map
  }, [])

  const panTo = React.useCallback(({lat, lng}) => {
      mapRef.current.panTo({lat, lng})
      mapRef.current.setZoom(14)
    }, [])


  useEffect(() => {
      navigator.geolocation.getCurrentPosition(async function (position){
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setTimeout(() => {
            panTo({lat, lng})}, 500)
      })
      const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'} ,
            body: JSON.stringify({location: currentLocation})
      }

      fetch("http://127.0.0.1:8000/api/get-top-rated-pints-in-area", requestOptions)
         .then((response) => response.json())
         .then((data) => {
             console.log(data)
             setTopRatedPintsInArea(data)
         })
  }, [])

  function getTopRatedPints(location) {
      setTimeout(() => {
          //setCurrentLocation(location)
          const requestOptions = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({location: location})
          }
          fetch("http://127.0.0.1:8000/api/get-top-rated-pints-in-area", requestOptions)
              .then((response) => response.json())
              .then((data) => {
                  setTopRatedPintsInArea(data)
              })
      }, 1)
    }

  const {isLoaded} = useLoadScript(
      {
          googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          libraries
      }
  )
  const mapContainerStyle = {
      width: '100%',
      height: '60vh'
  }
  const center = {
      lat: 53.480759,
      lng: -2.242631
  }
  const options = {
      styles: mapStyles,
      disableDefaultUI: true,
      zoomControl: true
  }
  return (
    <div className={classes.root}>
        {topRatedPintsInArea ?
            <Box m={3}>
                <Divider/>
                <br/>
                <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12}>
                        <Search panTo={panTo} getTopRatedPints={getTopRatedPints}
                                              currentLocation={currentLocation}
                                              setCurrentLocation={setCurrentLocation}/>
                    </Grid>
                    <Grid item lg={8} md={12} sm={12}>
                        <Locate panTo={panTo} getTopRatedPints={getTopRatedPints}
                                              currentLocation={currentLocation}
                                              setCurrentLocation={setCurrentLocation}/>
                        <Paper elevation={3}>
                            <div style={{width: '40w', height: '60vh'}}>
                                {
                                    isLoaded ?
                                        <GoogleMap mapContainerStyle={mapContainerStyle}
                                                   zoom={14}
                                                   options={options}
                                                   onLoad={onMapLoad}>
                                        </GoogleMap> : null
                                }
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <Paper style={{height: '60vh'}}>
                            <Typography
                                className={classes.topPintsAreaText}>{`Top Rated Pints In ${currentLocation}`}</Typography>
                            <List dense={true}>
                                {
                                    topRatedPintsInArea.length ?
                                        topRatedPintsInArea.map((entry, index) => {
                                            const rankAndBeer = `${entry.rank}. ${entry.brewery} ${entry.beer}`
                                            const venueAndLocation = `${entry.venue}, Price: £${entry.price}`
                                            return (
                                                <ListItem key={index} style={{height: 55}} button dense={true}>
                                                    <ListItemText primary={rankAndBeer} secondary={venueAndLocation}/>
                                                    <ListItemSecondaryAction
                                                        style={{fontWeight: 650}}>{entry.rating}/10</ListItemSecondaryAction>
                                                </ListItem>
                                            )
                                        }) : <Typography style={{display: 'flex', justifyContent: 'center'}}
                                                         >No user submissions yet... </Typography>
                                }
                            </List>
                        </Paper>
                    </Grid>
                    <br/>
                </Grid>

                <br/>
                <Divider/>
            </Box> :  <CircularProgress className={classes.progressLoader}/>
        }
    </div>
  );
}

function Locate(props) {
    const classes = useStyles()

    return <ExploreIcon className={classes.locate} onClick={() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            console.log(position)
            Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

            await Geocode.fromLatLng(position.coords.latitude, position.coords.longitude)
                .then((response) => {
                    props.setCurrentLocation(response.results[0].address_components[2].long_name)
                    props.panTo({lat: position.coords.latitude, lng: position.coords.longitude})
                    props.getTopRatedPints(response.results[0].address_components[2].long_name)
                }, error => {console.error(error)})


        }, () => null,)}
    }/>
}

function Search(props){

    const {ready, value, suggestions: {status, data}, setValue, clearSuggestions} = usePlaceAutocomplete({
        requestOptions: {location: {lat: () => 53.480759, lng: () => -2.242631},
                        radius: 400}
    })

    return <div>
            <Combobox onSelect={ async (address) => {
                        setValue(address, false);
                        clearSuggestions()
                        try {
                            const results = await getGeocode({address})
                            console.log('address', address)
                            console.log('results', results)

                            await props.setCurrentLocation(results[0].address_components[0].long_name)

                            const {lat, lng} = await getLatLng(results[0])
                            props.panTo({lat, lng})
                            props.getTopRatedPints(results[0].address_components[0].long_name)

                        }catch (error){
                            console.log("Error:", error)
                        }}}>
                    <ComboboxInput value={value} onChange={(e) => {
                        setValue(e.target.value)}}
                        disabled={!ready}
                        style={{width: '99.5%', height: 30, fontSize: 20}}
                        placeholder=" Search City"/>
                    <ComboboxPopover>
                        <ComboboxList>
                            {   status === "OK" && data.map(({description}, index) => (
                                <ComboboxOption key={index} value={" " + description}><ComboboxOptionText/></ComboboxOption>))
                            }
                        </ComboboxList>
                    </ComboboxPopover>
                </Combobox>
           </div>
}