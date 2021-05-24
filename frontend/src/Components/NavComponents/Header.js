import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import SearchIcon from '@material-ui/icons/Search';
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuList";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from "react-router-dom";
import Box from '@material-ui/core/Box';
import AddPintEntry from "../PagesComponents/AddPintEntry";
import SuccessMessage from "../MiscComponents/SuccessMessagePopUp";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    fontWeight: 650,
    fontSize: 30
  },
  appBar: {
    backgroundColor: '#e68a00',
  },
  search: {
    position: 'relative',
    display: 'none',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.2),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.3),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
      display: 'block',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(5)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '18ch',
      '&:focus': {
        width: '25ch',
      },
    },
  },
  nav: {
    fontSize: 30,
  },
  navItem: {
    '&:hover': {
          backgroundColor: '#f2f2f2',
          borderColor: '#f2f2f2',
         },
  },
  navItemText: {
    width: 190,
    fontWeight: 650,
    fontSize: 18,
    color: 'black',
    display: 'flex',
    textDecoration: 'none',
    alignItems: 'center',
    justifyContent: 'center',
     '&:hover': {
          backgroundColor: '#f2f2f2',
          borderColor: '#f2f2f2',
         },
  },
  navButton: {
        display: 'flex',
        justifyContent: 'center',
  },
  addEntryButton: {
        color: 'white',
        textTransform: 'none',
        width: '90%',
        fontWeight: 650,
        backgroundColor: '#009933',
        borderColor: '#009933',

        '&:hover': {
          backgroundColor: '#00802b',
          borderColor: '#00802b'
         },
        [theme.breakpoints.up('lg', 'md')]: {
              width: '85%',}
    },
}));

export default function Header() {
  const classes = useStyles();

  const [open, setOpen] = useState(false)
  const [pintEntryMade, setPintEntryMade] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    console.log(event.currentTarget)
    setAnchorEl(event.currentTarget)
    console.log(Boolean(anchorEl))

  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  function closeAddPint() {
      setOpen(false)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <LocalDrinkIcon/>
          <Typography className={classes.title} variant="h6" noWrap>
            Rate My Pint
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              onChange={(e) => console.log(e.target.value)}
              placeholder="Search Ratings..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
          <Box display={{ xs: 'block', sm: 'none' }}>
                <IconButton color="inherit" onClick={handleClick}>
                    <MenuIcon style={{fontSize: 30}} className={classes.nav}
                              display="none"/>
                </IconButton>
          </Box>
              <Menu
                    anchorEl={anchorEl}
                    className={classes.menu}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                      <MenuItem onClick={handleClose}
                                className={classes.navItem}
                                style={window.location.pathname === '/' ? {backgroundColor: '#f2f2f2'} : null}>
                                <Link className={classes.navItemText} to='/'>Home</Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}
                                className={classes.navItem}
                                style={window.location.pathname === '/top-pints' ? {backgroundColor: '#f2f2f2'} : null}>
                                <Link className={classes.navItemText} to='/top-pints'>Top Pints</Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}
                                className={classes.navItem}
                                style={window.location.pathname === '/venues' ? {backgroundColor: '#f2f2f2'} : null}>
                                <Link className={classes.navItemText} to='/venues'>Locations</Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}
                                className={classes.navItem}
                                style={window.location.pathname === '/about' ? {backgroundColor: '#f2f2f2'} : null}>
                                <Link className={classes.navItemText} to='/about'>About</Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}
                                className={classes.navItem}>
                        <Typography className={classes.navItemText}>Search</Typography>
                      </MenuItem>
                      <MenuItem onClick={handleClose}
                                className={classes.navButton}>
                                <Button className={classes.addEntryButton}
                                        onClick={() => setOpen(true)}
                                        >Add Pint Entry</Button>
                      </MenuItem>

              </Menu>
        </Toolbar>
      </AppBar>
        {
                open ?
                    <AddPintEntry open={open} close={closeAddPint} entryMade={setPintEntryMade}/> : null
        }
        {
                    pintEntryMade ?
                        <SuccessMessage message={"Pint Entry Added Successfully"}/> : null
        }
    </div>
  );
}