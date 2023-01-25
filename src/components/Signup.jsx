import * as yup from "yup";
import { useFormik } from "formik";
import { Button, Divider, Paper, styled, Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "./custom_css/Signup.css"
import { forwardRef, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase_connection";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useContext } from "react";
import { userInfo } from "../App";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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


function SignUp() {

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

    const navigate = useNavigate();

    const[showpwd, setShowpwd] = useState(false);

    const mySchema = yup.object({
        name: yup.string().required(),
        email: yup.string().email().required(),
        pwd: yup.string().required().min(8)
    })

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            pwd: ""
        },
        validationSchema: mySchema,
        onSubmit: async (values) => {
            try{
                // Btn loader
                setBtnLoasder(true);
                let user_info = await createUserWithEmailAndPassword(auth, values.email, values.pwd);
                // after crerating the user, modifythe use rfor its display Name & a  profile pic
                let update_created_user =  await updateProfile(user_info.user, {
                    displayName: values.name, 
                    photoURL: "https://example.comhttps://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png/jane-q-user/profile.jpg"
                });
                // snackbar logic
                setMsg("Successfully created account. Redirecting to login page.");
                setSeverity("success");
                handleOpenSnackbar();
                navigate("/login");
            }catch(err){
                // snackbar logic
                setMsg(err.message);
                setSeverity("error");
                handleOpenSnackbar();
                // Btn loader
                setBtnLoasder(false);
            }
        }
    })

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


  return (
    <div className="centered_div">
        <Paper elevation={24} square sx={{width: "360px", padding: "10px"}} >
            <Typography sx={{margin: "10px"}} variant="h5">Welcome to the Notes App</Typography>
            <Typography sx={{margin: "10px"}} variant="h6">Create new Account</Typography>
            <MyFormWrapper onSubmit={formik.handleSubmit}>
                <TextField
                    sx={{width: "300px"}}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="name"
                    error= {formik.touched.name && formik.errors.name ? true : false}
                    id="standard-error-helper-text"
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <AccountBoxIcon />
                        </InputAdornment>
                        ),
                    }}
                    label="User Name"
                    helperText={formik.touched.name && formik.errors.name ? formik.errors.name : null}
                    variant="standard"
                />
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
                <LoadingButton loading={btnLoader} variant="contained" type="submit" size="small" sx={{cursor:"pointer"}}>Sign-up</LoadingButton>
            </MyFormWrapper>
            <Divider sx={{marginTop: "20px"}}>or</Divider>
            <div className="google_btn_cont">
                <GoogleButton onClick={handleGoogleFlow} />
            </div>
            <Link className="quick_link" to="/login">Already a user? sign-in</Link>
        </Paper>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>{msg}</Alert>
      </Snackbar>
    </div>
  )
}

export default SignUp