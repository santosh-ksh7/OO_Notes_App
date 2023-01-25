import * as yup from "yup";
import { useFormik } from "formik";
import { Button, Paper, styled, Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "./custom_css/Login.css"
import { forwardRef, useState } from "react";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup  } from "firebase/auth";
import { auth } from "../firebase_connection";
import { useContext } from "react";
import { userInfo } from "../App";
import Divider from '@mui/material/Divider';
import GoogleButton from 'react-google-button'
import { Link, useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';






const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const MyFormWrapper = styled("form")({
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center"
})

function Login() {

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

    // Loading btn logic
    const[btnLoader, setBtnLoasder] = useState(false);
    // Loading btn logic 

    const{userData, setUserData} = useContext(userInfo);

    const[showpwd, setShowpwd] = useState(false);

    const navigate = useNavigate();

    const handleGoogleFlow = async () => {
        try{
            const provider = new GoogleAuthProvider();
            const temp = await signInWithPopup(auth, provider);
            console.log(temp);
            // store the newly created user info
            alert("New user is successfully created")
            setUserData(temp.user);
            // Navigate to home
            navigate("/");
        }catch(err){
            console.log(err.message);
            alert(err.message);
        }
    }

    const mySchema = yup.object({
        email: yup.string().email().required(),
        pwd: yup.string().required().min(8)
    })

    const formik = useFormik({
        initialValues: {
            email: "",
            pwd: ""
        },
        validationSchema: mySchema,
        onSubmit: (values) => {
            // Btn loader
            setBtnLoasder(true);
            signInWithEmailAndPassword(auth, values.email, values.pwd)
                .then((userCredential) => { 
                    // store the user credentials
                    const user = userCredential.user;
                    console.log("Logged_in_returned_info", user);
                    // snackbar logic
                    setMsg("Successfully Logged-in");
                    setSeverity("success");
                    handleOpenSnackbar();
                    // store the user info
                    setUserData(user);
                    navigate("/");
                })
                .catch((error) => {
                    setUserData(null);
                    // snackbar logic
                    setMsg(error.message);
                    setSeverity("error");
                    handleOpenSnackbar();
                    // Btn loader
                    setBtnLoasder(false);
                });
        }
    })

  return (
    <div className="centered_div">
        <Paper elevation={24} square sx={{width: "360px", padding: "10px"}} >
            <Typography sx={{margin: "10px"}} variant="h5">Welcome to the Notes App</Typography>
            <Typography sx={{margin: "10px"}} variant="h6">Sign-in to continue</Typography>
            <MyFormWrapper onSubmit={formik.handleSubmit}>
                <TextField
                    sx={{width: "300px"}}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="email"
                    error= {formik.touched.email && formik.errors.email ? true : false}
                    id="standard-error-helper-text"
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <MailOutlineIcon />
                        </InputAdornment>
                        ),
                    }}
                    label="Email ID"
                    helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                    variant="standard"
                />
                <TextField
                    sx={{width: "300px"}}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="pwd"
                    error= {formik.touched.pwd && formik.errors.pwd ? true : false}
                    id="standard-password-input"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <KeyIcon />
                            </InputAdornment>
                            ),
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton onClick={()=> setShowpwd(!showpwd)}>
                                {showpwd ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    label="Password"
                    helperText={formik.touched.pwd && formik.errors.pwd ? formik.errors.pwd : null}
                    type={showpwd ? "text" : "password"}
                    variant="standard"
                />
                <LoadingButton loading={btnLoader} variant="contained" type="submit" size="small" sx={{cursor:"pointer"}}>Sign-in</LoadingButton>
            </MyFormWrapper>
            <Divider sx={{marginTop: "20px"}}>or</Divider>
            <div className="google_btn_cont">
                <GoogleButton onClick={handleGoogleFlow} />
            </div>
            <Link className="quick_link" to="/sign_up">New to app? Create New Account</Link>
        </Paper>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>{msg}</Alert>
        </Snackbar>
    </div>
  )
}

export default Login