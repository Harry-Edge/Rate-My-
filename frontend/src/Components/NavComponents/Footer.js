import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SuccessMessage from "../MiscComponents/SuccessMessagePopUp";
import ReportABug from "../PagesComponents/ReportABug";
import Contact from "../PagesComponents/Contact";


const useStyles = makeStyles((theme) => ({
    footerContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    footerText: {
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 650,
        paddingBottom: 20,
        color: 'grey',
        '&:hover': {
          color: 'black'
         },
    }
}));

export default function Footer() {
  const classes = useStyles();

   const [bugEntryMade, setBugEntryMade] = useState(false)
   const [bugReportOpen, setBugReportOpen] = useState(false)

   const [contactOpen, setContactOpen] = useState(false)
   const [contractMessageMade, setContractMessageMade] = useState(false)

  function closeReportABug() {
      setBugReportOpen(false)
  }
  function closeContactUs() {
       setContactOpen(false)
  }


  return (
      <div>
          <Grid container className={classes.footerContainer}>
              <Grid item xs={2}>
                  <Typography className={classes.footerText}
                              onClick={() => setContactOpen(true)}>Contact</Typography>
              </Grid>
              <Grid item xs={2}>
                  <Typography className={classes.footerText}
                              onClick={() => setBugReportOpen(true)}>Report a Bug</Typography>
              </Grid>
          </Grid>
          {
           bugReportOpen ?
            <ReportABug open={bugReportOpen} close={closeReportABug} entryMade={setBugEntryMade}/> : null
          }
          {
              bugEntryMade ?
                  <SuccessMessage message={"Thank You For Your Submission"}/> : null
          }
          {
              contactOpen ?
                  <Contact open={contactOpen} close={closeContactUs} entryMade={setContractMessageMade}/>: null

          }
          {
              contractMessageMade ?
                  <SuccessMessage message={"Thank You For Contacting Us"}/> : null
          }


      </div>

  );
}