import { Box, Button, Card, IconButton, Skeleton, styled, Tab, Tabs, TextField, Typography } from "@mui/material";
import { forwardRef, useEffect } from "react";
import { useContext, useState } from "react";
import { userInfo } from "../App";
import { collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { db } from "../firebase_connection";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useFormik } from "formik";
import * as yup from "yup"
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import MySkeleton from "./Skeleton";




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

const MyWrapper = styled("div")({
    margin: "10px 0px",
    padding: "0px 10px",
})

const MyFlexWrapper = styled("div")({
    display: "flex",
    padding: "0px 10px",
    margin: "10px 0px",
    justifyContent: "space-between",
    alignItems: "center",
})




// Build a skeleton component to dispalty instead of loading text

function Records({setInvoker, invoker}) {

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
    
    const{userData} = useContext(userInfo);

    // To control the tabs
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        if(newValue === 0){
            setNotes_to_show(all_notes);
        }else if(newValue === 1){
            const res = all_notes.filter((ele) => ele.doc.data.value.mapValue.fields.status.stringValue === "pending");
            setNotes_to_show(res);
        }else if(newValue === 2){
            const res = all_notes.filter((ele) => ele.doc.data.value.mapValue.fields.status.stringValue === "complete");
            setNotes_to_show(res);
        }
        setValue(newValue);
    };
    // To control the tabs

    const[all_notes, setAll_notes] = useState(null);

    const[notes_to_show, setNotes_to_show] = useState(null);

    async function getAllNotesForUser(){
        // The uid shoul dbe dynamic coming from the userData object
        try{
            const q = query(collection(db, "notes"), where("uid", "==", userData.uid));
            const querySnapshot = await getDocs(q);
            setAll_notes(querySnapshot._snapshot.docChanges);
            setNotes_to_show(querySnapshot._snapshot.docChanges);
            console.log(querySnapshot._snapshot.docChanges);
        }catch(err){
            alert(err)
        }
    }


    useEffect(() => {
        getAllNotesForUser();
    }, [invoker]);

    return (
        <>
            {
                all_notes ? 
                    <Box sx={{width: "100%"}}>
                        <Tabs value={value} onChange={handleChange} centered>
                            <Tab label="All" />
                            <Tab label="Pending" />
                            <Tab label="Complete" />
                        </Tabs>
                        <div style={{display: "flex", gap: "15px", flexDirection: "column"}}>
                            {notes_to_show[0] ? 
                                notes_to_show.map((ele, index) => <NotesCards obj={ele} key={index} setInvoker={setInvoker} invoker={invoker} setSeverity={setSeverity} setMsg={setMsg} handleOpenSnackbar={handleOpenSnackbar} />) 
                                : 
                                <p style={{textAlign: "center", color: "red"}}>No notes to display.</p>
                            }
                        </div>
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>{msg}</Alert>
                        </Snackbar>
                    </Box>
                :
                <MySkeleton />
                // Build a Skeleton to show in the shape of your card
            }
        </>
    )
}

export default Records;





function NotesCards({obj, setInvoker, invoker, setSeverity, setMsg, handleOpenSnackbar}) {

    // MUI DIALOG COMPONENT
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteAndHandleClose = () => {
        del_note();
        setOpen(false);
    };
    // MUI DIALOG COMPONENT

    // This is to collapse the card and show the editor
    const[editor, setEditor] = useState(false);

    let dateTime = new Date(obj.doc.data.value.mapValue.fields.timestamp.timestampValue);

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    async function del_note(){
        try{
            await deleteDoc(doc(db, "notes", obj.doc.key.path.segments[6]));
            // snackbar logic
            setMsg("Successfully Deleted the note");
            setSeverity("success");
            handleOpenSnackbar();
            // Also invoke the useEffect to run
            setInvoker(!invoker);
        }catch(err){
            // snackbar logic
            setMsg("Unable to delete the note");
            setSeverity("error");
            handleOpenSnackbar();
        }
    }

    async function changeStatus(arg){
        try{
            console.log("clicked")
            const updateStatus = doc(db, "notes", obj.doc.key.path.segments[6]);
            await updateDoc(updateStatus, {
            status: arg
            });
            // snackbar logic
            setMsg("Successfully updated teh status of your note");
            setSeverity("success");
            handleOpenSnackbar();
            // Alter the invoker again to run useEffect to keep the data in sync between you app & firebase
            setInvoker(!invoker);
        }catch(err){
            // snackbar logic
            setMsg("Unable to update the status of your note");
            setSeverity("error");
            handleOpenSnackbar();
        }
    }

    const colorIndicator = {
        color: obj.doc.data.value.mapValue.fields.status.stringValue === "pending" ? "green" : "orange",
    }

    const textIndicator = {
        textDecoration: obj.doc.data.value.mapValue.fields.status.stringValue === "pending" ? "none" : "line-through"
    }

    return (
      <div>
          {
            !editor ? 
                <Card variant="outlined" sx={{ maxWidth: "100%" }}>
                    <MyWrapper>
                        <Typography sx={textIndicator} variant="h5">{obj.doc.data.value.mapValue.fields.title.stringValue}</Typography>
                    </MyWrapper>
                    <MyWrapper>
                        <Typography sx={textIndicator} variant="body2">{obj.doc.data.value.mapValue.fields.description.stringValue}</Typography>
                    </MyWrapper>
                    <MyFlexWrapper>
                        {/* Date & time display */}
                        <Typography sx={{color: "gray"}} variant="body2">{dateTime.getDate() + "--"  + months[dateTime.getMonth()] + "--" + dateTime.getFullYear() + "-@-" + dateTime.getHours() + ":" + dateTime.getMinutes()}</Typography>
                        {/* alter status of notes */}
                        <Tooltip title="mark as complete or pending">
                            <IconButton sx={colorIndicator} aria-label="complete/pending">
                                {obj.doc.data.value.mapValue.fields.status.stringValue === "pending" ?
                                    <TaskAltIcon onClick={() => changeStatus("complete")} />
                                    :
                                    <UnpublishedIcon onClick={() => changeStatus("pending")} />
                                }
                                {/* <Typography variant="body2">{obj.doc.data.value.mapValue.fields.status.stringValue === "pending" ? "Mark complete" : "Mark pending"}</Typography> */}
                            </IconButton>
                        </Tooltip>
                        {/* edite the notes */}
                        <Tooltip title="edit">
                            <IconButton onClick={() => setEditor(true)} aria-label="edit">
                                <EditIcon sx={{color: "blue"}} />
                            </IconButton>
                        </Tooltip>
                        {/* delete the notes */}
                        <Tooltip title="delete">
                            <IconButton onClick={handleClickOpen} aria-label="delete">
                                <DeleteIcon sx={{color: "red"}} />
                            </IconButton>
                        </Tooltip>
                    </MyFlexWrapper>
                </Card>
                :
                <Editor editor={editor} setEditor={setEditor} obj={obj} setInvoker={setInvoker} invoker={invoker} setSeverity={setSeverity} setMsg={setMsg} handleOpenSnackbar={handleOpenSnackbar} />        
          }
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">Are you sure you want to proceed with deletion?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This is a 1 way process. You can't revert back.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={deleteAndHandleClose} autoFocus>Agree</Button>
            </DialogActions>
        </Dialog>
      </div>
    )
}







function Editor({editor, setEditor, obj, setInvoker, invoker, setSeverity, setMsg, handleOpenSnackbar}){

    // Loading btn logic
    const[btnLoader, setBtnLoasder] = useState(false);
    // Loading btn logic 

    const mySchema = yup.object({
        title: yup.string().required(),
        description: yup.string().required()
    })

    const formik = useFormik({
        initialValues: {
            title: obj.doc.data.value.mapValue.fields.title.stringValue,
            description: obj.doc.data.value.mapValue.fields.description.stringValue
        },
        validationSchema: mySchema,
        onSubmit: async (values) => {
            // Btn loading logic
            setBtnLoasder(true)
            try{
                // Update the notes in firebase
                const updateRef = doc(db, "notes", obj.doc.key.path.segments[6]);
                // Set the "capital" field of the city 'DC'
                await updateDoc(updateRef, {
                    ...values,
                    timestamp: serverTimestamp(),
                    // status & uid remains the same as we are updating only some part of the document
                });
                // snackbar logic
                setMsg("Successfully edited the note");
                setSeverity("success");
                handleOpenSnackbar();
                // To alter between the editor and the card
                setEditor(false);
                // make the component to re-render by runiing the useEfect again to kep the data in symnc between firebase and app
                setInvoker(!invoker);
                // Btn loading logic
                setBtnLoasder(false);
            }catch(err){
                // snackbar logic
                setMsg("Unable to edit the note");
                setSeverity("error");
                handleOpenSnackbar();
                // Btn loading logic
                setBtnLoasder(false);
            }
        }
    })


    return(
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
            <MyBtn loading={btnLoader} size="small" variant="contained" type="submit">Save</MyBtn>
            <MyBtn size="small" variant="contained" onClick={() => setEditor(false)}>Cancel</MyBtn>
        </BtnContainer>
        </MyFormWrapper>
    )
}