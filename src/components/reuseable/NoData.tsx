import { Box, Typography, Container } from "@mui/material";
import nodata from "../../assets/no-results.png";

const NoData = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box
        component="img"
        src={nodata}
        alt="No data"
        sx={{
          width: 150,
          height: 150,
          opacity: 0.6,
          mb: 2,
        }}
      />

      <Typography variant="h5" gutterBottom>
        No data available.
      </Typography>
    </Container>
  );
};

export default NoData;
