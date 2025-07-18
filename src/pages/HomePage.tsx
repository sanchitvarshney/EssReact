import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ImageCard from "../components/reuseable/ImageCard";
import { homeData } from "../staticData/homepagedata";
import type { homeMenuTypes } from "../types/home-data-types/homepagetypes";
import NoticeboardCard from "../components/NoticeboardCard";
import useMediaQuery from "@mui/material/useMediaQuery";
import { keyframes, useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const HomePage = () => {
  const scroll = keyframes`
  0% {
    transform: translateX(200%);
  }
  100% {
    transform: translateX(-100%);
  }
`;
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediamDevice = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div className="w-full  h-[calc(100vh-90px)] flex justify-center overflow-y-auto will-change-transform">
      <div className=" flex justify-start items-start flex-col">
        <div className="w-[95%]  bg-[#fffecdff] flex  items-center mx-4 my-4 mb-6 border border-[#fec300ff] mx-auto ">
          <div className="w-30 p-1 bg-[#fec300ff] relative">
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: `-12px`,
                width: 0,
                height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderLeft: "12px solid #fec300ff",
                zIndex: 5,
              }}
            />
            <Typography variant="subtitle1" fontWeight="bold" color="white">
              What's New
            </Typography>
          </div>
          <Box
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-block",
                animation: `${scroll} 20s linear infinite`,
                fontSize: "1.2rem",
                fontWeight: 500,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </Box>
          </Box>
        </div>

        <div className="w-full block sm:hidden px-4 mb-4">
          <Accordion
            sx={{
              boxShadow: 2,
              borderRadius: 10,
              backgroundColor: "#ffffff",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {"Notice board "}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <NoticeboardCard />
            </AccordionDetails>
          </Accordion>
        </div>
        <div
          className={`${
            isSmallDevice
              ? "w-full"
              : `grid  ${
                  isMediamDevice
                    ? "md:grid-cols-[2fr_1fr]"
                    : "lg:grid-cols-[3fr_1fr]"
                }  gap-4  overflow-visible px-4  `
          }   `}
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 w-full lg:grid-cols-4 xl:grid-cols-5  gap-x-8 px-4  mx-auto overflow-visible ">
            {homeData.map((item: homeMenuTypes) => (
              <ImageCard
                key={item.id}
                title={item.title}
                image={item.icon}
                path={item.path}
              />
            ))}
          </div>
          <div className="w-full  hidden md:block">
            <NoticeboardCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
