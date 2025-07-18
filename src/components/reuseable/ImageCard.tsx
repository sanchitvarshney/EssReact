import { Card, CardContent, Typography } from "@mui/material";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import CustomTag from "./CustomTag";
import { useDrawerContext } from "../../contextapi/DrawerContextApi";
import blockicon from "../../assets/blockimage/policiesb&w.png";
import imgPerfor from "../../assets/blockimage/bg-performance.png";
import imghelp from "../../assets/blockimage/helpbw.png";
import imgtaskbox from "../../assets/blockimage/bw-taskbox.png";
import imgrecruitment from "../../assets/blockimage/recurt.png";

type ImageCardProps = {
  title: string;
  image: string;
  path: string;
};

const ImageCard: FC<ImageCardProps> = ({ title, image, path }) => {
  const navigation = useNavigate();
  const { setIsExpended } = useDrawerContext();

  const handleNavigate = (path: string, title: string) => {
    if (
      title.toLowerCase() === "hr policies" ||
      title.toLowerCase() === "performance" ||
      title.toLowerCase() === "helpdesk" ||
      title.toLowerCase() === "task box" ||
      title.toLowerCase() === "recruitment"
    ) {
      return;
    }
    setIsExpended(false);
    navigation(path);
  };
  return (
    <Card
      sx={{
        borderRadius: 0,
        boxShadow: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform:
            title.toLowerCase() === "hr policies" ||
            title.toLowerCase() === "performance" ||
            title.toLowerCase() === "helpdesk" ||
            title.toLowerCase() === "task box" ||
            title.toLowerCase() === "recruitment"
              ? "none"
              : "scale(1.05)",
        },
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 0, justifySelf: "center", overflow: "visible" }}>
        <div
          onClick={() => handleNavigate(path, title)}
          className="cursor-pointer relative  overflow-visible"
        >
          {/* Blurred background */}

          <div
            className={`flex  h-30 w-40 p-10 sm:p-3 sm:w-30 sm:h-30 md:w-35 md:h-35 lg:w-40 lg:h-40 xl:w-45 xl:h-45 items-center justify-center rounded-2xl ${
              title.toLowerCase() === "hr policies" ||
              title.toLowerCase() === "performance" ||
              title.toLowerCase() === "helpdesk" ||
              title.toLowerCase() === "task box" ||
              title.toLowerCase() === "recruitment"
                ? "bg-gray-500/20"
                : "bg-gray-500/10"
            }  `}
          >
            <img
              src={
                title.toLowerCase() === "hr policies"
                  ? blockicon
                  : title.toLowerCase() === "performance"
                  ? imgPerfor
                  : title.toLowerCase() === "helpdesk"
                  ? imghelp
                  : title.toLowerCase() === "task box"
                  ? imgtaskbox
                  : title.toLowerCase() === "recruitment"
                  ? imgrecruitment
                  : image
              }
              alt={title}
              className="h-[120px]  w-full object-contain "
            />
          </div>

          {/* transition-transform duration-500 hover:rotate-360 */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mt: 1,
              textAlign: "center",
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            {title}
          </Typography>
          {(title.toLowerCase() === "hr policies" ||
            title.toLowerCase() === "performance" ||
            title.toLowerCase() === "helpdesk" ||
            title.toLowerCase() === "task box" ||
            title.toLowerCase() === "recruitment") && (
            <div className=" absolute top-[-18px]  right-0 z-999 overflow-visible">
              <CustomTag label="Coming Soon" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
