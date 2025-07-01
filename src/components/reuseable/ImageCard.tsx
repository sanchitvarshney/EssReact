import { Card, CardContent, Typography } from "@mui/material";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type ImageCardProps = {
  title: string;
  image: string;
  path: string;
};

const ImageCard: FC<ImageCardProps> = ({ title, image, path }) => {
  const navigation = useNavigate();
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
          transform: "scale(1.05)",
        },
      }}
    >
      <CardContent sx={{ p: 0, justifySelf: "center" }}>
        <div onClick={() => navigation(path)} className="cursor-pointer ">
          <div className="flex h-30 w-40 p-10 sm:p-3 sm:w-30 sm:h-30 md:w-35 md:h-35 lg:w-40 lg:h-40 xl:w-45 xl:h-45 items-center justify-center rounded-2xl bg-gray-500/10">
            <img
              src={image}
              alt={title}
              className="h-[120px] w-full object-contain "
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
