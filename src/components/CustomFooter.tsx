import { Box, Typography } from "@mui/material";

const CustomFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 0.5,
        px: 2,
        border: "2px solid #fec300ff",
        borderStyle: "dashed",
        bgcolor: "#fffecdff",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography variant="body2" color="#000" sx={{fontSize: {xs: "0.8rem", sm: "0.9rem"}, fontWeight: 600}}>
        © {new Date().getFullYear()} MsCorpres Automation | All rights reserved.
      </Typography>
    </Box>
  );
};

export default CustomFooter;
