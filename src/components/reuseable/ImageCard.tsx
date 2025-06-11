import { Card, CardContent, Typography } from "@mui/material";
import type { FC } from "react";

type ImageCardProps = {
  title: string;
  image: string;
};

const ImageCard: FC<ImageCardProps> = ({ title, image }) => {
  return (
    <Card
      sx={{
        width: "100%",          
        borderRadius: 0,
        boxShadow: "none",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"transparent"
      }}
    >
      <CardContent sx={{ p: 0, justifySelf:"center" }}>
        <div className="flex h-40 w-40 items-center justify-center rounded-md bg-gray-600/10">
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
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
