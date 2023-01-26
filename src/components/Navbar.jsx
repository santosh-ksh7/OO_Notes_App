import { AppBar, Avatar, Button, Container, Grid, IconButton, Paper, styled, Toolbar, Tooltip, Typography } from "@mui/material";
import NotesIcon from '@mui/icons-material/Notes';
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../firebase_connection";
import { forwardRef, useContext, useState } from "react";
import { userInfo } from "../App";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function Navbar() {

    // snackbar logic
    const [open, setOpen] = useState(false);

    const[severity, setSeverity] = useState(null);

    const[msg, setMsg] = useState(null);

    const handleOpenSnackbar = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };
    // snackbar logic

    const{userData, setUserData, setMode, mode} = useContext(userInfo);

    function toggleMode(){
        const update = mode === "light" ? "dark" : "light"
        setMode(update)
    }

    const navigate = useNavigate();

    function signOut_from_device(){
        signOut(auth).then(() => {
            // snackbar logic
            setMsg("Successfully Signed-out");
            setSeverity("success");
            handleOpenSnackbar();
            // Sign-out successful.
            setUserData(null);
        }).catch((error) => {
            // snackbar logic
            setMsg(error.message);
            setSeverity("error");
            handleOpenSnackbar();
        });
    }

  return (
    <AppBar position="sticky" sx={{padding: "3px"}}>
        <Grid container sx={{alignItems: "center"}}>
            <Grid item xs={6} md={10}>
                <Tooltip title="Go to home">
                    <IconButton onClick={() => navigate("/")}>
                        <NotesIcon />
                    </IconButton>
                </Tooltip>
                <Typography variant="body1" component="span">Notes App</Typography>
                <button onClick={toggleMode}>Toggle mode</button>
            </Grid>
            <Grid item xs={3} md={1}>
                {userData ? <Typography sx={{cursor: "pointer"}} variant="body1" onClick={signOut_from_device}>Sign-out</Typography> : <Typography sx={{cursor: "pointer"}} variant="body1" onClick={() => navigate("/login")}>Sign-in</Typography>}
            </Grid>
            <Grid item xs={3} md={1}>
                {userData ? 
                    <Avatar alt="profile pic" src={userData.photoURL} />
                : null}
            </Grid>
        </Grid>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>{msg}</Alert>
        </Snackbar>
      </AppBar>
  )
}

export default Navbar

