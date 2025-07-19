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

interface Comment {
  id?: string;
  author: string;
  text: string;
  timestamp: string;
  photo?: string;
  role?: string;
}

interface VirtualizedCommentListProps {
  data: Comment[];

  itemSize?: number;
}

const VirtualizedCommentList: React.FC<VirtualizedCommentListProps> = ({
  data,

  itemSize = 80,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
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
      
      <ListItem
        style={style}
        key={item.id || index}
        component="div"
        disablePadding
        sx={{
      
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
          "&:hover": {
            backgroundColor: "#f0f8ff",
          },
          transition: "background-color 0.2s ease",
          
        }}
      >
        <ListItemButton
          sx={{
            padding: "12px 16px",
            alignItems: "flex-start",
            minHeight: itemSize,
       
          }}
        >
          <Box display="flex" gap={2} width="100%" alignItems="flex-start">
            <Avatar
              src={item.photo}
              sx={{
                width: 36,
                height: 36,
                backgroundColor: "#2eacb3",
                fontSize: "12px",
                fontWeight: 600,
                border: "2px solid #e0e0e0",
                flexShrink: 0,
                mt: 0.5,
              }}
            >
              {!item.photo && getInitials(item.author)}
            </Avatar>

            <Box flex={1} minWidth={0}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{
                    color: "#2c3e50",
                    fontSize: "0.9rem",
                    lineHeight: 1.2,
                  }}
                >
                  {item.author}
                </Typography>
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
            </Box>
          </Box>
        </ListItemButton>
      </ListItem>
    );
  };

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <EmptyData width="w-[180px]" />
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
        height={620}
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
