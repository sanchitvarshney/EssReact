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


import CustomToolTip from "../components/reuseable/CustomToolTip";
import { useGetDocumentsMutation } from "../services/doc";
import { useEffect } from "react";
import LoadingComponent from "../components/reuseable/LoadingComponent";

const DocumentsPage = () => {
  const [getDocuments, { isLoading, data }] = useGetDocumentsMutation();

  const fetchDocuments = async () => {
    try {
      await getDocuments().unwrap();
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="w-full p-4 h-[calc(100vh-100px)]">
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          {" "}
          <Typography sx={{ fontWeight: 600, fontSize: 22, pb: 1 }}>
            Documents
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 w-full lg:grid-cols-3 xl:grid-cols-3 gap-6 px-2  mx-auto h-[calc(100vh-160px)] py-3 overflow-y-auto ">
            {data?.data?.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={200}
              >
                <Typography variant="body2">No Documents Found.</Typography>
              </Box>
            ) : (
              data?.data?.map((row: any) => (
                <div key={row?.key} className="min-w-[350px]">
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 3,

                      minHeight: 200,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardContent>
                       <CustomToolTip
                        title={row.name}
                        placement={"bottom"}
                      >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#1f2937",
                          mb: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 300,
                          // display: "inline-block",
                          userSelect: "none",
                        }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {row.name}
                      </Typography>
                      </CustomToolTip>
                      <CustomToolTip
                        title={row.description}
                        placement={"bottom"}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 300,
                            display: "inline-block",
                            userSelect: "none",
                          }}
                        >
                          {row.description === "" ? "N/A" : row.description}
                        </Typography>
                      </CustomToolTip>
                      <Typography
                        variant="body2"
                        sx={{ color: "#374151", mb: 0.5 }}
                      >
                        <b>Date:</b> {row.datetime}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        pb: 2,
                        pr: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#374151", ml: 1 }}
                      >
                        <b>Size:</b> {row.file_size}
                      </Typography>
                      <ButtonGroup
                        variant="outlined"
                        aria-label="document actions"
                      >
                        <CustomToolTip title={"View"} placement={"bottom"}>
                          <IconButton>
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
        </>
      )}
    </div>
  );
};

export default DocumentsPage;
