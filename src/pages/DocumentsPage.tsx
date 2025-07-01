import {
  Box,
  Typography,
  ButtonGroup,
  IconButton,
  Card,
  CardContent,
  CardActions,

} from "@mui/material";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { leaveLogData } from "../dummydata/LeaveSentData";
import CustomToolTip from "../components/reuseable/CustomToolTip";

const DocumentsPage = () => {
  return (
    <div className="w-full p-2 h-[calc(100vh-100px)]">
      <Typography sx={{ fontWeight: 600, fontSize: 18, py: 2 }}>
        Documents
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 w-full lg:grid-cols-3 xl:grid-cols-3 gap-8 px-2  mx-auto ">
        {leaveLogData?.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={200}
          >
            <Typography variant="body2">No Documents Found.</Typography>
          </Box>
        ) : (
          leaveLogData?.map((row: any, idx: number) => (
            <div key={row.applicationId + idx} className="min-w-[350px]">
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,

                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {row.applicationId}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#1f2937", mb: 1 }}
                  >
                    {row.appliedFor}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#374151", mb: 0.5 }}
                  >
                    <b>Date:</b> {row.fromDate} to {row.toDate}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", pb: 2, pr: 2 }}>
                  <ButtonGroup variant="outlined" aria-label="document actions">
                    <CustomToolTip title={"View"} placement={"bottom"}>
                      <IconButton >
                        <VisibilityIcon
                          sx={{ fontSize: 24, color: "#2eacb3" }}
                        />
                      </IconButton>
                    </CustomToolTip>
                    <CustomToolTip title={"Download"} placement={"bottom"}>
                      <IconButton>
                        <CloudDownloadIcon
                          sx={{ fontSize: 24, color: "#2eacb3" }}
                        />
                      </IconButton>
                    </CustomToolTip>
                  </ButtonGroup>
                </CardActions>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
