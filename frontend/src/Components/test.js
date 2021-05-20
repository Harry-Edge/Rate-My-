import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

const autocompleteService = { current: null };

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
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

}));

export default function GoogleMapsSearch(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="google-map-demo"
      style={{ width: '99%' }}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        if(newValue){
            console.log(newValue)
            console.log('location name', newValue.terms[0].value)
            console.log('street', newValue.terms[1].value)
            console.log('locality', newValue.terms[2].value)
            console.log('placeid', newValue.place_id)

            const venue = {name: newValue.terms[0].value,
                           street: newValue.terms[1].value,
                           location: newValue.terms[2].value,
                           googleMapsPlaceID: newValue.place_id
            }
            props.venueChosen(venue)

        }

      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Add a location" variant="outlined" size="small" fullWidth className={classes.textBox} />
      )}
      renderOption={(option) => {
        const matches = option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length]),
        );

        return (
          <Grid container alignItems="center">
            <Grid item xs>
              {parts.map((part, index) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}
              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}