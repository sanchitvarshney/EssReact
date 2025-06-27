import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";

const CommentView = () => {
  return (
    <Card elevation={0} sx={{ boxShadow: 1 }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Avatar
            src={""}
            sx={{ width: 45, height: 45, backgroundColor: "#2eacb3" }}
          />
          <Box ml={1}>
            <div className="flex gap-x-5">
              <Typography variant="subtitle1" fontWeight={500}>
                name
              </Typography>
              <Typography variant="subtitle1">date</Typography>
            </div>
            <Typography variant="body1" color="text.secondary">
              comment
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CommentView;
