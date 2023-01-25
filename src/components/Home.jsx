import { useContext, useState } from "react";
import { userInfo } from "../App";
import UserInput from "./UserInput";
import "./custom_css/Home.css"
import { Grid, styled, Typography, Box } from "@mui/material";
import Records from "./Records";



const NotLoggedInMsg = styled(Typography)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "red"
})


function Home() {

  // This is to invoke the useEffect everytime a new note is created, edited or deleted
  const[invoker, setInvoker] = useState(false);

  const{userData} = useContext(userInfo);

  return (
    <div className="main_home_cont">
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <UserInput setInvoker={setInvoker} invoker={invoker} />
        </Grid>
        <Grid item xs={12} md={6}>
          {
            userData ? 
              <Records setInvoker={setInvoker} invoker={invoker} />
            :
              <Box sx={{width: "100%"}}>
                <NotLoggedInMsg variant="h6">You are currently not logged in.</NotLoggedInMsg>
                <NotLoggedInMsg variant="h6">Log in to view all your saved notes.</NotLoggedInMsg>
              </Box>
          }
        </Grid>
      </Grid>
    </div>
  )
}

export default Home


