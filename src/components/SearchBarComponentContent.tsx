import React, { useEffect, useState, type FC } from "react";
import Typography from "@mui/material/Typography";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemText from "@mui/material/ListItemText";
import { useFetchEmployeeMutation } from "../services/Leave";
import DotLoading from "./reuseable/DotLoading";
import { useToast } from "../hooks/useToast";

type SearchBarComponentContentType = {
  inputText: string;
  onSelect?: (user: any) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
};
const SearchBarComponentContent: FC<SearchBarComponentContentType> = ({
  inputText,
  onSelect,
  selectedIndex,
  setSelectedIndex,
}) => {
  const { showToast } = useToast();
  const [fetchEmployee, { data, isLoading, error }] =
    useFetchEmployeeMutation();
  const [filteredData, setFilteredData] = useState([]);
  const itemRefs = React.useRef<any[]>([]);

  useEffect(() => {
    if (inputText.length > 2) {
      fetchEmployee({ emp_code: inputText, emp_name: inputText });
    }
  }, [inputText]);

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {
    if (!error) return;

    if (error) {
      //@ts-ignore
      const errData = error.data as { message?: string };

      showToast(errData?.message || "Something went wrong", "error");
    } else {
      //@ts-ignore
      showToast(error.message || "An unexpected error occurred", "error");
    }
  }, [error]);

  // Scroll selected item into view
  useEffect(() => {
    if (
      selectedIndex >= 0 &&
      itemRefs.current[selectedIndex] &&
      itemRefs.current[selectedIndex].scrollIntoView
    ) {
      itemRefs.current[selectedIndex].scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Handle Enter key selection
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        selectedIndex >= 0 &&
        filteredData[selectedIndex]
      ) {
        onSelect && onSelect(filteredData[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredData, onSelect]);

  return (
    <div className="w-full ">
      <div
        tabIndex={0}
        onMouseEnter={(e) => e.currentTarget.focus()}
        className="bg-white  shadow-0 h-60  overflow-y-auto custom-scrollbar-for-menu focus:outline-none focus:ring-0"
      >
        <List sx={{ padding: 0 }} className="p-0">
          {filteredData.length === 0 || isLoading ? (
            <div className="flex flex-col justify-center items-center h-50">
              <Typography
                variant="subtitle1"
                className={`font-medium ${
                  inputText.length < 3 ? "text-red-500" : "text-gray-800"
                }  text-gray-800`}
              >
                {inputText.length < 3
                  ? "Enter at least 3 characters"
                  : "Please wait"}
              </Typography>
              <DotLoading />
            </div>
          ) : (
            <>
              {filteredData.map((result: any, idx: number) => (
                <React.Fragment key={result.id}>
                  <ListItem
                    // ref={(el) => (itemRefs.current[idx] = el)}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedIndex === idx ? "bg-gray-200" : ""
                    }`}
                    onClick={() => onSelect && onSelect(result)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          className="font-medium text-gray-800"
                        >
                          {result?.text}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" className=" text-gray-800">
                          ({result?.id})
                        </Typography>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </>
          )}
        </List>
      </div>
    </div>
  );
};

export default SearchBarComponentContent;
