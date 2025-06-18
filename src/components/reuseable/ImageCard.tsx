import { Card, CardContent, Typography } from "@mui/material";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type ImageCardProps = {
  title: string;
  image: string;
  path:string
};

const ImageCard: FC<ImageCardProps> = ({ title, image,path }) => {
  const navigation = useNavigate()
  return (
    <Card
      sx={{
        // width: "100%",
        borderRadius: 0,
        boxShadow: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <CardContent sx={{ p: 0, justifySelf: "center" }}>
        <div onClick={()=>navigation(path)}>
        <div className="flex h-50 w-50 p-3 sm:w-30 sm:h-30 md:w-35 md:h-35 lg:w-40 lg:h-40 xl:w-45 xl:h-45 items-center justify-center rounded-2xl bg-gray-500/10">
          {/* object-contain keeps the image inside its box without distortion */}
          <img
            src={image}
            alt={title}
            className="h-[120px] w-full object-contain"
          />
        </div>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mt: 1,
            textAlign: "center",
            fontSize: { xs: "1.1rem", sm: "1.12rem" },
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
