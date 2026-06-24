import React, { useEffect, useRef, useState, type FC } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import EastIcon from "@mui/icons-material/East";
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
  shouldNavigateOnSelect?: boolean;
};

const SearchBarComponentContent: FC<SearchBarComponentContentType> = ({
  inputText,
  onSelect,
  selectedIndex,
  setSelectedIndex,
  shouldNavigateOnSelect = true,
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
        .then((res) => {
          //@ts-ignore
          if (res?.data?.status === "error") {
            showToast(res?.data?.message, "error");
          }
        })
        .catch((err) => {
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
    //@ts-ignore
    const errData = error.data as { message?: string };
    showToast(
      errData?.message ||
        "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
      "error"
    );
  }, [error]);

  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

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
      window.removeEventListener("selectSearchResult", handleSelectSearchResult);
  }, [filteredData, selectedIndex, onSelect, dispatch, shouldNavigateOnSelect]);

  /* ─── Loading state ─── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#e0f7fa] flex items-center justify-center">
          <SearchIcon sx={{ fontSize: 22, color: "#2eacb3" }} />
        </div>
        <p className="text-sm font-medium text-gray-500">
          {inputText.length < 3 ? "Enter at least 3 characters" : "Searching…"}
        </p>
        {inputText.length >= 3 && <DotLoading />}
      </div>
    );
  }

  /* ─── Empty state ─── */
  if (filteredData.length === 0 && inputText.length >= 3) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <img src={noResultsImg} alt="No results" className="w-20 opacity-60" />
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600">
            No employees found
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Try a different name or employee code
          </p>
        </div>
      </div>
    );
  }

  /* ─── Results ─── */
  return (
    <div className="w-full">
      {/* Header */}
      {filteredData.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <PersonSearchIcon sx={{ fontSize: 14, color: "#2eacb3" }} />
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {filteredData.length} employee
            {filteredData.length !== 1 ? "s" : ""} found
          </span>
        </div>
      )}

      {/* List */}
      <div
        tabIndex={0}
        onMouseEnter={(e) => e.currentTarget.focus()}
        className="max-h-64 overflow-y-auto custom-scrollbar-for-menu will-change-transform focus:outline-none"
      >
        {filteredData.map((result: any, idx: number) => {
          const isSelected = selectedIndex === idx;
          const initials = result?.text
            ?.split(" ")
            .slice(0, 2)
            .map((w: string) => w[0])
            .join("")
            .toUpperCase();

          return (
            <div
              key={result.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 border-b border-gray-50 last:border-0 ${
                isSelected ? "bg-[#e0f7fa]" : "hover:bg-[#f0fdfe]"
              }`}
              onClick={() => {
                if (shouldNavigateOnSelect) {
                  dispatch(setEmplyeeCode({ empCode: result?.id }));
                }
                onSelect && onSelect(result);
              }}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              {/* Initials avatar */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white transition-colors duration-150 ${
                  isSelected ? "bg-[#2eacb3]" : "bg-slate-400"
                }`}
              >
                {initials || "?"}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {result?.text}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono flex-shrink-0">
                    {result?.id}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                  {result?.designation && (
                    <span className="text-xs text-gray-500 truncate">
                      {result.designation}
                    </span>
                  )}
                  {result?.designation && result?.department && (
                    <span className="text-gray-300 flex-shrink-0">·</span>
                  )}
                  {result?.department && (
                    <span className="text-xs text-gray-400 truncate">
                      {result.department}
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow on selected */}
              {isSelected && (
                <EastIcon sx={{ fontSize: 16, color: "#2eacb3", flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBarComponentContent;
