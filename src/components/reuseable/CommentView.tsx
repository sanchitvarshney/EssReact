import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";

type CommentViewProps = {
  data: any;
};

const CommentView: React.FC<CommentViewProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-y-3 max-w-md justify-center">
      {data?.map((item: any) => (
        <Card elevation={0} sx={{ boxShadow: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Avatar
                src={item.photo}
                sx={{ width: 45, height: 45, backgroundColor: "#2eacb3" }}
              />
              <Box ml={1}>
                <div className="flex gap-x-5">
                  <Typography variant="subtitle1" fontWeight={500}>
                    {item.name}
                  </Typography>
                  
                </div>
                <Typography variant="body1" color="text.secondary">
                  {item.date}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommentView;
