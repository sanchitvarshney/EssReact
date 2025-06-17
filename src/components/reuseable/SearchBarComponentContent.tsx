import React, { type FC } from "react";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

type SearchBarComponentContentType = {
  inputText: string;
};
const SearchBarComponentContent: FC<SearchBarComponentContentType> = ({
  inputText,
}) => {
  const searchResults = [
      {
      id: 1,
      name: "John Doe",
      role: "Software Engineer",
      department: "Engineering",
      avatar: "JD",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Product Manager",
      department: "Product",
      avatar: "JS",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Designer",
      department: "Design",
      avatar: "MJ",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      role: "HR Specialist",
      department: "Human Resources",
      avatar: "SW",
    },
      {
      id: 1,
      name: "John Doe",
      role: "Software Engineer",
      department: "Engineering",
      avatar: "JD",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Product Manager",
      department: "Product",
      avatar: "JS",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Designer",
      department: "Design",
      avatar: "MJ",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      role: "HR Specialist",
      department: "Human Resources",
      avatar: "SW",
    },
    {
      id: 1,
      name: "John Doe",
      role: "Software Engineer",
      department: "Engineering",
      avatar: "JD",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Product Manager",
      department: "Product",
      avatar: "JS",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Designer",
      department: "Design",
      avatar: "MJ",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      role: "HR Specialist",
      department: "Human Resources",
      avatar: "SW",
    },
  ];

  return (
    <div className="w-full p-2 ">
      {/* Search Results */}
      {inputText && (
        <div className="bg-white rounded-lg shadow-0 h-90  overflow-y-auto custom-scrollbar-for-menu">
          <List className="p-0">
            {searchResults.map((result, index) => (
              <React.Fragment key={result.id}>
                <ListItem className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <ListItemAvatar>
                    <Avatar className=" text-white font-semibold">
                      {result.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        className="font-medium text-gray-800"
                      >
                        {result.name}
                      </Typography>
                    }
                    secondary={
                      <div>
                        <Typography variant="body2" className="text-gray-600">
                          {result.role}
                        </Typography>
                      </div>
                    }
                  />
                  {/* <Button
                    variant="outlined"
                    size="small"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    View Profile
                  </Button> */}
                </ListItem>
                {index < searchResults.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default SearchBarComponentContent;
