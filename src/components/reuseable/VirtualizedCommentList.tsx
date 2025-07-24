import * as React from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { FixedSizeList } from "react-window";
import type { ListChildComponentProps } from "react-window";
import { formatDistanceToNow } from "date-fns";
import EmptyData from "./EmptyData";
import Divider from "@mui/material/Divider";

interface Comment {
  id?: string;
  name: string;
  text?: string;
  timestamp: string;
  photo?: string;
  role?: string;
}

interface VirtualizedCommentListProps {
  data: Comment[];
hight?:number
  itemSize?: number;
}

const getAvatarColor = (name: string) => {
  // Simple hash to generate a color from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 60%, 60%)`;
  return color;
};

const VirtualizedCommentList: React.FC<VirtualizedCommentListProps> = ({
  data,
hight=400,
  itemSize = 65,
}) => {
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    const item = data[index];

    if (!item) return null;

    return (
      <div style={{ ...style, width: "100%" }}>
        <ListItem
          key={item.id || index}
          component="div"
          disablePadding
          sx={{
            backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
            transition: "background-color 0.2s ease",
            '&:focus-within': {
              outline: '2px solid #1976d2',
              zIndex: 1,
            },
          }}
        >
          <ListItemButton
            sx={{
              padding: "12px 16px",
              alignItems: "flex-start",
              minHeight: itemSize,
              borderRadius: 1,
              transition: "box-shadow 0.2s",
              '&:hover, &:focus': {
                backgroundColor: "#e3f2fd",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
              },
            }}
            tabIndex={0}
            aria-label={`Comment by ${item.name}${item.role ? ', ' + item.role : ''}`}
          >
            <Box display="flex" gap={2} width="100%" alignItems="flex-start">
              <Avatar
                src={item.photo}
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: item.photo ? undefined : getAvatarColor(item.name),
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "2px solid #e0e0e0",
                  flexShrink: 0,
                  mt: 0.5,
                }}
              >
                {!item.photo && getInitials(item.name)}
              </Avatar>
              <Box flex={1} minWidth={0}>
                <Box display="flex" gap={1}>
                  <div className="flex  justify-between w-full items-center">
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{
                        color: "#2c3e50",
                        fontSize: "0.9rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mb: 0.5,
                        fontSize: "0.7rem",
                        fontWeight: 500,
                      }}
                    >
                      {formatDate(item.timestamp)}
                    </Typography>
                  </div>
                  {item.role && (
                    <Chip
                      label={item.role}
                      size="small"
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        fontSize: "0.65rem",
                        height: "16px",
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
                {item.text && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#34495e",
                      lineHeight: 1.4,
                      fontSize: "0.8rem",
                      wordBreak: "break-word",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.text}
                  </Typography>
                )}
              </Box>
            </Box>
          </ListItemButton>
        </ListItem>
        {index < data.length - 1 && <Divider variant="fullWidth" component="li" sx={{ marginLeft: 7, borderColor: "#f0f0f0" }} />}
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fafafa",
          minHeight: 200,
          py: 4,
        }}
      >
        <EmptyData width="w-[120px]" height="h-[30vh]" />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No comments yet. Be the first to comment!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",

        backgroundColor: "#ffffff",

        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <FixedSizeList
        height={hight}
        width={"100%"}
        itemSize={itemSize}
        itemCount={data.length}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
  );
};

export default VirtualizedCommentList;
