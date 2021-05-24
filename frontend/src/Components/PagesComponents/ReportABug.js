import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from "@material-ui/core/Button";
import {TextField, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 25,
        fontWeight: 650,
        display: 'flex',
        color: 'grey',
        justifyContent: 'center'
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
            color: "grey",
            fontWeight: 650,
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

export default function ReportABug(props) {
  const classes = useStyles()

  const [bugMessage, setBugMessage] = useState()

  function submitBug() {
      const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: bugMessage})
      }
      fetch("http://127.0.0.1:8000/api/report-a-bug", requestOptions)
         .then((response) => response.json())
         .then((data) => {
             console.log(data)
             props.entryMade(true)
         })}

  return (
      <Dialog open={props.open} >
        <DialogTitle><Typography className={classes.title}>Report A Bug</Typography></DialogTitle>
        <DialogContent style={{width: 400 }}>
            <TextField multiline
                       rows={6}
                       //label="Put as much detail as you can about the incident"
                       variant="outlined"
                       className={classes.textBox}
                       onChange={(e) => setBugMessage(e.target.value)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.close()} className={classes.closeButton} variant='contained'>
            Close
          </Button>
           <Button className={classes.submitButton}
                   variant='contained'
                   onClick={() => {
                       submitBug()
                       props.close()
                   }}>Submit
          </Button>
        </DialogActions>
      </Dialog>
  );
}