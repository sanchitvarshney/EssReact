import React, { useEffect, useRef, useState, type FC } from "react";
import Typography from "@mui/material/Typography";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemText from "@mui/material/ListItemText";
import { useFetchEmployeeMutation } from "../services/Leave";
import DotLoading from "./reuseable/DotLoading";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../contextapi/AuthContext";
import { useDispatch } from "react-redux";
import { setEmplyeeCode } from "../slices/authSlices";
import noResultsImg from "../assets/no-results.png";

type SearchBarComponentContentType = {
  inputText: string;
  onSelect?: (user: any) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  shouldNavigateOnSelect?: boolean; // new prop
};
const SearchBarComponentContent: FC<SearchBarComponentContentType> = ({
  inputText,
  onSelect,
  selectedIndex,
  setSelectedIndex,
  shouldNavigateOnSelect = true, // default true
}) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { setSearchValueLength } = useAuth();
  const [fetchEmployee, { data, isLoading, error }] =
    useFetchEmployeeMutation();
  const [filteredData, setFilteredData] = useState([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (inputText.length > 2) {
      fetchEmployee({ emp_code: inputText, emp_name: inputText })
        .then((res) => {//@ts-ignore
          if (res?.data?.status === "error") {
            showToast(res?.data?.message, "error");

            return;
          }

         
        })
        .catch((err) => {
          console.log(err);
          showToast(err?.data?.message, "error");
        });
    }
  }, [inputText]);

  useEffect(() => {
    if (data?.data.length > 0) {
      setFilteredData(data?.data);
    } else {
      setFilteredData([]);
    }
  }, [data?.data]);

  useEffect(() => {
    setSearchValueLength(filteredData.length);
  }, [filteredData]);

  useEffect(() => {
    if (!error) return;

    if (error) {
      //@ts-ignore
      const errData = error.data as { message?: string };

      showToast(
        errData?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error"
      );
    } else {
      //@ts-ignore
      showToast(error.message || "An unexpected error occurred", "error");
    }
  }, [error]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  // Handle Enter key selection
  React.useEffect(() => {
    const handleSelectSearchResult = (e: any) => {
      const idx = e.detail.selectedIndex;
      if (filteredData.length > 0) {
        const item = filteredData[idx >= 0 ? idx : 0] as any;
        if (item) {
          if (shouldNavigateOnSelect) {
            dispatch(setEmplyeeCode({ empCode: item?.id }));
          }
          onSelect && onSelect(item);
        }
      }
    };
    window.addEventListener("selectSearchResult", handleSelectSearchResult);
    return () =>
      window.removeEventListener(
        "selectSearchResult",
        handleSelectSearchResult
      );
  }, [filteredData, selectedIndex, onSelect, dispatch, shouldNavigateOnSelect]);

  return (
    <div className="w-full ">
      <div
        tabIndex={0}
        onMouseEnter={(e) => e.currentTarget.focus()}
        className="bg-white  shadow-0 h-60  overflow-y-auto custom-scrollbar-for-menu will-change-transform focus:outline-none focus:ring-0"
      >
        <List sx={{ padding: 0 }} className="p-0">
          {isLoading ? (
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
          ) : filteredData.length === 0 && inputText.length >= 3 ? (
            <div className="flex flex-col justify-center items-center h-50 p-4">
              <img
                src={noResultsImg}
                alt="No data found"
                style={{ width: 100, opacity: 0.7 }}
              />
              <Typography
                variant="subtitle1"
                className="font-medium text-gray-500 mt-2"
              >
                No employees found
              </Typography>
              <Typography variant="body2" className="text-gray-400">
                Try adjusting your search or check for typos.
              </Typography>
            </div>
          ) : (
            <>
              {filteredData?.map((result: any, idx: number) => (
                <div
                  key={result.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                >
                  <ListItem
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedIndex === idx ? "bg-gray-200" : ""
                    }`}
                    onClick={() => {
                      if (shouldNavigateOnSelect) {
                        dispatch(setEmplyeeCode({ empCode: result?.id }));
                      }
                      onSelect && onSelect(result);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          className="font-medium text-gray-800"
                        >
                          {`${result?.text} (${result?.id})`}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" className=" text-gray-800">
                          {`${result?.designation} (${result?.department})`}
                        </Typography>
                      }
                    />
                  </ListItem>
                </div>
              ))}
            </>
          )}
        </List>
      </div>
    </div>
  );
};

export default SearchBarComponentContent;
