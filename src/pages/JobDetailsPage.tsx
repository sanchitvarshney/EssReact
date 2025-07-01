import {
  Box,
  Typography,
  Chip,
  Divider,
  Container,
  Stack,
  Card,
  CardContent,
  Avatar,
  IconButton,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
// import ShareIcon from "@mui/icons-material/Share";

const jobData = {
  title: "Frontend Developer",
  company: "TechNova Solutions",
  location: "Remote / Bangalore, India",
  postedDate: "June 20, 2025",
  type: "Full-Time",
  experience: "3+ years",
  salary: "₹10L - ₹18L per annum",
  description:
    "We're looking for a skilled frontend developer with strong React and TypeScript experience. You'll be building modern, scalable UIs with a focus on performance and accessibility. Join our dynamic team and contribute to cutting-edge projects that impact millions of users worldwide.",
  responsibilities: [
    "Develop and maintain web applications using React and TypeScript",
    "Work with REST APIs and GraphQL for data integration",
    "Implement responsive and accessible designs following WCAG guidelines",
    "Collaborate with designers and backend engineers in an agile environment",
    "Optimize application performance and user experience",
    "Participate in code reviews and maintain code quality standards",
  ],
  requirements: [
    "3+ years of frontend development experience with modern frameworks",
    "Strong proficiency in React, TypeScript, HTML5, and CSS3",
    "Experience with version control systems (Git) and CI/CD pipelines",
    "Familiarity with Material-UI, Tailwind CSS, or similar design systems",
    "Knowledge of state management libraries (Redux, Zustand, etc.)",
    "Understanding of web accessibility standards and best practices",
  ],
  skills: [
    "React",
    "TypeScript",
    "Material-UI",
    "REST APIs",
    "Git",
    "Redux",
    "Tailwind CSS",
    "GraphQL",
  ],
  benefits: [
    "Health Insurance",
    "Flexible Hours",
    "Remote Work",
    "Learning Budget",
    "Annual Bonus",
  ],
};

function JobDetailsPage({onClose}:{onClose:()=>void}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)",
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
        
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
            onClick={onClose}
          >
            <ArrowBackIcon sx={{ color: "black" }} />
          </IconButton>
   
        </Box>

        <Grid container spacing={3}>
          {/* <Grid item xs={12} lg={8}> */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {/* Job Header */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "#2eacb3",
                    mr: 2,
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: "1.75rem", md: "2.125rem" },
                      background:
                        "linear-gradient(135deg, #2eacb3 0%,rgb(62, 154, 159) 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {jobData.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {jobData.company}
                  </Typography>
                </Box>
              </Box>

              {/* Job Meta Information */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
                flexWrap="wrap"
              >
                <Chip
                  icon={<LocationOnIcon />}
                  label={jobData.location}
                  sx={{
                    bgcolor: "rgba(102, 126, 234, 0.1)",
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                  }}
                />
                <Chip
                  icon={<WorkIcon />}
                  label={jobData.type}
                  sx={{
                    bgcolor: "rgba(118, 75, 162, 0.1)",
                    color: theme.palette.secondary.main,
                    fontWeight: 500,
                  }}
                />
                <Chip
                  icon={<CalendarMonthIcon />}
                  label={`Posted: ${jobData.postedDate}`}
                  sx={{
                    bgcolor: "rgba(76, 175, 80, 0.1)",
                    color: "success.main",
                    fontWeight: 500,
                  }}
                />
              </Stack>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Job Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: theme.palette.text.secondary,
                  fontSize: "1.1rem",
                }}
              >
                {jobData.description}
              </Typography>
            </Box>

            {/* Responsibilities */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Key Responsibilities
              </Typography>
              <Stack spacing={1.5}>
                {jobData.responsibilities.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      p: 2,
                      bgcolor: "rgba(52, 159, 195, 0.07)",
                      borderRadius: 2,
                      border: "1px solid rgba(102, 126, 234, 0.1)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#2eacb3",
                        mt: 1,
                        mr: 2,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.6,
                        color: "#000",
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "#000",
                }}
              >
                Requirements
              </Typography>
              <Stack spacing={1.5}>
                {jobData.requirements.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      p: 2,
                      bgcolor: "rgba(52, 159, 195, 0.07)",
                      borderRadius: 2,
                      border: "1px solid rgba(118, 75, 162, 0.1)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#2eacb3",
                        mt: 1,
                        mr: 2,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.6,
                        color: "#000",
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Required Skills
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                {jobData.skills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    sx={{
                      bgcolor: "rgba(52, 159, 195, 0.07)",
                      color: "#000",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      "&:hover": {
                        bgcolor: "rgba(52, 159, 195, 0.23)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-auto">
            <Card
              sx={{
                borderRadius: 3,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 3 }}
                >
                  Job Summary
                </Typography>

                <Stack spacing={2.5}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AttachMoneyIcon sx={{ color: "success.main", mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Salary Range
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {jobData.salary}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <WorkIcon sx={{ color: "primary.main", mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {jobData.experience}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnIcon sx={{ color: "secondary.main", mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {jobData.location}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: 3,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 3 }}
                >
                  Benefits
                </Typography>

                <Stack spacing={1.5}>
                  {jobData.benefits.map((benefit, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1.5,
                        bgcolor: "rgba(52, 159, 195, 0.07)",
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#2eacb3",
                          mr: 2,
                        }}
                      />
                      <Typography variant="body2" fontWeight={500}>
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Container>
    </Box>
  );
}

export default JobDetailsPage;
