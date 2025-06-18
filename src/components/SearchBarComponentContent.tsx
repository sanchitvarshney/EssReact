import React, { type FC } from "react";
import Typography from "@mui/material/Typography";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemText from "@mui/material/ListItemText";

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
      msId: "MS****",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Product Manager",
      department: "Product",
      msId: "MS****",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Designer",
      department: "Design",
      msId: "MS****",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      role: "HR Specialist",
      department: "Human Resources",
      msId: "MS****",
    },
    {
      id: 1,
      name: "John Doe",
      role: "Software Engineer",
      department: "Engineering",
      msId: "MS****",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Product Manager",
      department: "Product",
      msId: "MS****",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Designer",
      department: "Design",
      msId: "MS****",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      role: "HR Specialist",
      department: "Human Resources",
      msId: "MS****",
    },
    {
      id: 1,
      name: "John Doe",
      role: "Software Engineer",
      department: "Engineering",
      msId: "MS****",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Product Manager",
      department: "Product",
      msId: "MS****",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Designer",
      department: "Design",
      msId: "MS****",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      role: "HR Specialist",
      department: "Human Resources",
      msId: "MS****",
    },
  ];

  return (
    <div className="w-full ">
      {/* Search Results */}
      {inputText && (
        <div
          tabIndex={0}
          onMouseEnter={(e) => e.currentTarget.focus()}
          className="bg-white  shadow-0 h-90 mt-2 overflow-y-auto custom-scrollbar-for-menu focus:outline-none focus:ring-0"
        >
          <List sx={{ padding: 0 }} className="p-0">
            {searchResults.map((result) => (
              <React.Fragment key={result.id}>
                <ListItem className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        className="font-medium text-gray-800"
                      >
                        {`${result.name} (${result.msId}) - ${result.department} - ${result.role}`}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default SearchBarComponentContent;
