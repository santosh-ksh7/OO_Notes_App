import { Button, styled, TextField } from "@mui/material"
import { useFormik } from "formik"
import { forwardRef, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { userInfo } from "../App"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import { db } from "../firebase_connection";
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
    alignItems: "center",
    width: "100%"
})

const BtnContainer = styled("div")({
    display: "flex",
    gap: "30px",
})

const MyBtn = styled(LoadingButton)({
    cursor: "pointer"
})


function UserInput({setInvoker, invoker}) {

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

    const{userData} = useContext(userInfo);

    const navigate = useNavigate();

    const mySchema = yup.object({
        title: yup.string().required(),
        description: yup.string().required()
    })

    const formik = useFormik({
        initialValues: {
            title: "",
            description: ""
        },
        validationSchema: mySchema,
        onSubmit: async (values) => {
            // Btn loader logic
            setBtnLoasder(true);
            if(userData){
                try{
                    const createDoc = await addDoc(collection(db, "notes"), {
                        ...values,
                        status: "pending",
                        // uid should be dynamic coming from the userData object which holds the information about the user
                        uid: userData.uid,
                        timestamp: serverTimestamp()
                    });
                    // snackbar logic
                    setMsg("Successfully created your note");
                    setSeverity("success");
                    handleOpenSnackbar();
                    // Btn loader
                    setBtnLoasder(false);
                    // set the invoker to fetch the fresh data
                    setInvoker(!invoker);
                    // reset the input fields
                    formik.values.title = "";
                    formik.values.description = "";
                }catch(err){
                    // snackbar logic
                    setMsg("Unable to create your note");
                    setSeverity("error");
                    handleOpenSnackbar();
                    // Btn loader
                    setBtnLoasder(false);
                }
            }else{
                // snackbar logic
                setMsg("You need to be logged in to create and save a note.");
                setSeverity("error");
                handleOpenSnackbar();
                // Btn loader
                setBtnLoasder(false);
            }
        }
    })

  return (
    <MyFormWrapper onSubmit={formik.handleSubmit}>
        <TextField 
            sx={{width: "100%"}}
            id="standard-basic" 
            label="Title for your notes" 
            onBlur={formik.handleBlur}
            error= {formik.touched.title && formik.errors.title ? true : false}
            value={formik.values.title}
            variant="standard" 
            name="title" 
            onChange={formik.handleChange} 
            helperText={formik.touched.title && formik.errors.title ? formik.errors.title : null}
        />
        <TextField 
            sx={{width: "100%"}}
            id="standard-textarea"
            multiline
            label="Description"
            onBlur={formik.handleBlur}
            error= {formik.touched.description && formik.errors.description ? true : false}
            value={formik.values.description}
            variant="standard" 
            name="description" 
            onChange={formik.handleChange} 
            helperText={formik.touched.description && formik.errors.description ? formik.errors.description : null}
        />
        <BtnContainer>
            <MyBtn loading={btnLoader} size="small" variant="contained" type="submit">Create</MyBtn>
            <MyBtn size="small" variant="contained" onClick={formik.resetForm}>Reset</MyBtn>
        </BtnContainer>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>{msg}</Alert>
        </Snackbar>
    </MyFormWrapper>
  )
}

export default UserInput