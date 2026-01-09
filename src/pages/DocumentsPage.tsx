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

import CustomSearch from "../components/reuseable/CustomSearch";
import DocumentsPageSkeleton from "../skeleton/DocumentsPageSkeleton";
import { useToast } from "../hooks/useToast";
import EmptyData from "../components/reuseable/EmptyData";
import pdf from "../assets/pdf.png";
import img from "../assets/img.png";
import otherType from "../assets/othertype.png";

const DocumentsPage = () => {
  // const [searchQuary, setSearchQuary] = useState<string>("");
  const { showToast } = useToast();
  const [getDocuments, { isLoading, data, error }] = useGetDocumentsMutation();
  const [filteredData, setFilteredData] = useState([]);

  const fnOpenNewWindow = (link: string) => {
    var width = 1000;
    var height = 600;

    var left = window.screen.width / 2 - width / 2;
    var top = window.screen.height / 2 - height / 2;

    window.open(
      link,
      "MsCorpres",
      `width=${width},height=${height},top=${top},left=${left},status=1,scrollbars=1,location=0,resizable=yes`
    );
  };

  const downloadPDF = (pdfUrl: string, fileName: string = "document.pdf") => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName;
    link.target = "_blank";
    link.click();
  };

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data);
    }
  }, [data]);

  useEffect(() => {
    getDocuments().unwrap();
  }, []);

  useEffect(() => {
    if (!error) return;

    if (error) {
      //@ts-ignore
      const errData = error.data as { message?: string };

      showToast(
        errData?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error"
      );
    } else {
      //@ts-ignore
      showToast(error.message || "An unexpected error occurred", "error");
    }
  }, [error]);

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
        <DocumentsPageSkeleton />
      ) : (
        <>
          <div className="w-full flex items-center flex-wrap justify-between mb-2">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 w-full lg:grid-cols-3 xl:grid-cols-3 gap-6 px-2  mx-auto h-[calc(100vh-170px)] py-3 overflow-y-auto  will-change-transform">
            {data?.data?.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={200}
              >
                <EmptyData />
              </Box>
            ) : (
              (filteredData ?? []).map((row: any) => (
                <div key={row?.key || row?.id} className="min-w-[350px]">
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
                    <CardContent sx={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
                      <div>
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
                              maxWidth: 250,

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
                              maxWidth: 250,
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
                      </div>
                      <div>
                        <img src={row?.file_type === "pdf" ? pdf : row?.file_type === "img" ? img : otherType} alt="pdf icon" className="w-14 h-14 opacity-65" />
                      </div>
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
                          <b>Size:</b> {row.file_size ?? "N/A"}
                        </Typography>
                        {/* <Typography
                          variant="body2"
                          sx={{ color: "#374151", ml: 1 }}
                        >
                          <b>Type:</b> {row.file_type}
                        </Typography> */}
                      </div>
                      <ButtonGroup
                        variant="outlined"
                        aria-label="document actions"
                      >
                        {!(row?.file_type === "other") && (
                          <CustomToolTip title={"View"} placement={"bottom"}>
                            <IconButton
                              onClick={() => fnOpenNewWindow(row.path)}
                            >
                              <VisibilityIcon
                                sx={{ fontSize: 24, color: "#2eacb3" }}
                              />
                            </IconButton>
                          </CustomToolTip>
                        )}
                        {row?.file_type === "other" && (
                          <CustomToolTip
                            title={"Download"}
                            placement={"bottom"}
                          >
                            <IconButton
                              onClick={() => downloadPDF(row.path, row.name)}
                            >
                              <CloudDownloadIcon
                                sx={{ fontSize: 24, color: "#2eacb3" }}
                              />
                            </IconButton>
                          </CustomToolTip>
                        )}
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
