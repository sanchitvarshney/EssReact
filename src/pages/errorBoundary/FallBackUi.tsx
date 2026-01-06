import { Box, Typography, Container, Button } from "@mui/material";
import warningImg from "../../assets/warning.png";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface FallBackUiProps {
  error?: Error | null;
  onReset?: () => void;
}

const FallBackUi = ({ error, onReset }: FallBackUiProps) => {
    const navigate = useNavigate();
  const handleReload = () => {
   navigate("/");
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  const isDevelopment = import.meta.env.DEV;

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

      {isDevelopment && error && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "error.light",
            color: "error.contrastText",
            borderRadius: 1,
            maxWidth: "600px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Error Details (Development Only):
          </Typography>
          <Typography
            variant="caption"
            component="pre"
            sx={{
              fontSize: "0.75rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "monospace",
            }}
          >
            {error.toString()}
            {error.stack && `\n\nStack:\n${error.stack}`}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={handleReset}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
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
