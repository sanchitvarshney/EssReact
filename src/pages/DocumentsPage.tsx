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
import { useEffect, useState } from "react";
import LoadingComponent from "../components/reuseable/LoadingComponent";
import CustomSearch from "../components/reuseable/CustomSearch";



const DocumentsPage = () => {
  // const [searchQuary, setSearchQuary] = useState<string>("");
  const [getDocuments, { isLoading, data }] = useGetDocumentsMutation();
  const [filteredData, setFilteredData] = useState([]);

  const fetchDocuments = async () => {
    try {
      await getDocuments().unwrap();
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data);
    }
  }, [data]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filterData = (searchQuary: string) => {
    if (!searchQuary.trim()) {
      setFilteredData(data?.data || []);
      return;
    }

    const filtered = data?.data?.filter(
      (item: any) =>
        item.file_type.toLowerCase().includes(searchQuary.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuary.toLowerCase())
    );

    setFilteredData(filtered || []);
  };

  return (
    <div className="w-full p-4 h-[calc(90vh-80px)]">
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="w-full flex items-center justify-between mb-2">
            <Typography sx={{ fontWeight: 600, fontSize: 22, pb: 1 }}>
              Documents
            </Typography>
            <div className="flex items-center gap-2">
              <CustomSearch
                width={"40ch"}
                placeholder={"Search your documents here..."}
                 bgColor="#8a8a8a"
          textColor="#000"
                onChange={(e: any) => filterData(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 w-full lg:grid-cols-3 xl:grid-cols-3 gap-6 px-2  mx-auto h-[calc(100vh-170px)] py-3 overflow-y-auto ">
            {data?.data?.length === 0 || filteredData?.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={200}
              >
                <Typography variant="body2">No Documents Found.</Typography>
              </Box>
            ) : (
              (filteredData || []).map((row: any) => (
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
                      <CustomToolTip title={row.name} placement={"bottom"}>
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
                      <div>
                        {" "}
                        <Typography
                          variant="body2"
                          sx={{ color: "#374151", ml: 1 }}
                        >
                          <b>Size:</b> {row.file_size}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#374151", ml: 1 }}
                        >
                          <b>Type:</b> {row.file_type}
                        </Typography>
                      </div>
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
