import { Box, Typography, Container, Button } from "@mui/material";
import warningImg from "../../assets/warning.png";
import { useNavigate } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";

const FallBackUi = () => {
  const navigate = useNavigate();
  const handleReload = () => {
    navigate("/");
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
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Box
        component="img"
        src={warningImg}
        alt="Error"
        sx={{
          width: { xs: 120, sm: 150, md: 180 },
          height: { xs: 120, sm: 150, md: 180 },
          opacity: 0.8,
          mb: 3,
        }}
      />

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: 2,
          color: "text.primary",
        }}
      >
        Something went wrong
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: "text.secondary",
          maxWidth: "500px",
        }}
      >
        We're sorry, but something unexpected happened. Please try reloading the
        page or contact support if the problem persists.
      </Typography>

      <Button
        variant="contained"
        onClick={handleReload}
        sx={{
          px: 4,
          py: 1.5,
          fontSize: "1rem",
          textTransform: "none",
          borderRadius: 2,
        }}
        endIcon={<ArrowForward />}
      >
        Go to Home
      </Button>
    </Container>
  );
};

export default FallBackUi;
