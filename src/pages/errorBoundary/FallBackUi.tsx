import { Box, Typography, Container, Button } from "@mui/material";
import warningImg from "../../assets/img/error.webp";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FallBackUi = () => {
  const navigate = useNavigate();
  const handleReload = () => {
    navigate("/");
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "calc(100vh - 0px)",
      }}
    >
      <Box
        component="img"
        src={warningImg}
        alt="Error"
        sx={{
          width: { xs: 100, sm: 200, md: 300 },
          height: { xs: 100, sm: 180, md: 250 },
          opacity: 0.8,
          mb: 1,
        }}
      />

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1.5,
          color: "text.primary",
        }}
      >
        Oops! Something didn’t go as planned
      </Typography>

      <Typography
        variant="body1"
        sx={{
          maxWidth: 520,

          color: "text.secondary",
          lineHeight: 1.6,
          animation: "fadeIn 0.4s ease-in",
        }}
      >
        We ran into an unexpected issue while loading this page. Don’t worry —
        your data is safe. You can try refreshing the page or return to the home
        screen to continue.
      </Typography>
      <Typography variant="caption" sx={{ my: 2, color: "text.disabled" }}>
        If the issue persists, please contact support.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={handleReset}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: "#2eacb3",
          }}
        >
          Try Again
        </Button>
        <Button
          variant="outlined"
          onClick={handleReload}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
            color: "#2eacb3",
            borderColor: "#2eacb3",
          }}
          endIcon={<ArrowForward />}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default FallBackUi;
