import { Box, Card, Skeleton, styled } from "@mui/material"




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

const MyBox = styled("div")({
    dispaly: "flex",
    flexDirection: "column",
    gap: "30px",
})



function MySkeleton() {
  return (
    <MyBox>
        <MyFlexWrapper>
            <Skeleton variant="rectangular" width={100} height={40} />
            <Skeleton variant="rectangular" width={100} height={40} />
            <Skeleton variant="rectangular" width={100} height={40} />
        </MyFlexWrapper>
        <Card variant="outlined" sx={{ maxWidth: "100%" }}>
            <MyWrapper>
                <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
            </MyWrapper>
            <MyWrapper>
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            </MyWrapper>
            <MyFlexWrapper>
                {/* Date & time display */}
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                {/* alter status of notes */}
                <Skeleton variant="circular" width={40} height={40} />
                {/* edite the notes */}
                <Skeleton variant="circular" width={40} height={40} />
                {/* delete the notes */}
                <Skeleton variant="circular" width={40} height={40} />
            </MyFlexWrapper>
        </Card>
        <Card variant="outlined" sx={{ maxWidth: "100%" }}>
            <MyWrapper>
                <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
            </MyWrapper>
            <MyWrapper>
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            </MyWrapper>
            <MyFlexWrapper>
                {/* Date & time display */}
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                {/* alter status of notes */}
                <Skeleton variant="circular" width={40} height={40} />
                {/* edite the notes */}
                <Skeleton variant="circular" width={40} height={40} />
                {/* delete the notes */}
                <Skeleton variant="circular" width={40} height={40} />
            </MyFlexWrapper>
        </Card>
        <Card variant="outlined" sx={{ maxWidth: "100%" }}>
            <MyWrapper>
                <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
            </MyWrapper>
            <MyWrapper>
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            </MyWrapper>
            <MyFlexWrapper>
                {/* Date & time display */}
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                {/* alter status of notes */}
                <Skeleton variant="circular" width={40} height={40} />
                {/* edite the notes */}
                <Skeleton variant="circular" width={40} height={40} />
                {/* delete the notes */}
                <Skeleton variant="circular" width={40} height={40} />
            </MyFlexWrapper>
        </Card>
    </MyBox>
  )
}

export default MySkeleton