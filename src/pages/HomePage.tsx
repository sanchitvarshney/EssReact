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
// import SendIcon from "@mui/icons-material/Send";
import nextgenimg from "../assets/lightlogov2.svg";

// Create dynamic keyframes based on screen size
const getScrollKeyframes = (fromX: string, toX: string) => keyframes`
  0% {
    transform: translateX(${fromX});
  }
  100% {
    transform: translateX(${toX});
  }
`;
const HomePage = () => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediamDevice = useMediaQuery(theme.breakpoints.down("md"));
  const fromX = isSmallDevice ? "20%" : isMediamDevice ? "40%" : "100%";
  const toX = isSmallDevice ? "-20%" : isMediamDevice ? "-40%" : "-100%";
  const scroll = getScrollKeyframes(fromX, toX);

  return (
    <div className="w-full  h-[calc(100vh-90px)] flex justify-center overflow-y-auto will-change-transform">
      <div className="w-full flex justify-start items-start flex-col">
        <div className="w-[98%]  max-w-[380px] sm:max-w-[500px] bg-[#fefeea] md:max-w-[800px] lg:max-w-[1200px] xl:max-w-[1500px] flex  items-center mx-4 my-4 mb-6 border border-[#fec300ff] mx-auto ">
          <div className="w-40 sm:w-30 p-1  bg-[#fec300ff] relative">
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: `-10px`,
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
              width: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-block",
                animation: `${scroll} ${
                  isSmallDevice ? "15s" : isMediamDevice ? "25s" : "35s"
                }  linear infinite`,
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              We’re excited to introduce you to the enhanced version of ESS
              (Employee Self-Service) - redesigned with a fresh look, improved
              performance, and user-friendly features to make your experience
              smoother and more efficient than ever before.
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
        <div className="w-full  flex-wrap bg-[#444445] px-[50px] sm:px-[200px] flex items justify-between gap-[50px] py-[20px] border-t-1 border-gray-300 text-white">
          <div className="flex flex-col gap-[10px] w-[500px] items-start text-left justify-end">
            <img src="./ms.png" alt="" className="w-[250px]" />
            <div>
              <Typography fontSize={13} className=" ">
                MsCorpres Automation Pvt Ltd
              </Typography>
              <Typography fontSize={13} className=" ">
                Office No. 1 and 2, 3rd Floor, Plot number B-88 Sector 83,
                Noida, Gautam Buddha Nagar, 201305
              </Typography>
              <Typography fontSize={13} className=" ">
                Phone 2: +91 88 26 788880{" "}
              </Typography>
              <Typography fontSize={13} className=" ">
                Email: marketing@mscorpres.in
              </Typography>
            </div>
          </div>
          <div className="flex flex-col items-start gap-y-4  ">
            <div>
              <img src={nextgenimg} alt="nextgenlogo" className="w-50 " />
            </div>
            <Typography fontSize={13} className="">
              © 2017 - {new Date().getFullYear()} | All rights reserved
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
