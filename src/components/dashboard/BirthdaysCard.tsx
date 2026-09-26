import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useGetDOBListMutation, useGetWAListMutation } from "../../services/events";
import DashCard from "./DashCard";
import { DASH_PRIMARY } from "./DashboardRail";

const BirthdaysCard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"birthday" | "anniversary">("birthday");
  const [index, setIndex] = useState(0);
  const [getDOB, { data: dob }] = useGetDOBListMutation();
  const [getWA, { data: wa }] = useGetWAListMutation();

  useEffect(() => {
    getDOB({ type: "DOB" });
    getWA({ type: "WA" });
  }, []);

  useEffect(() => setIndex(0), [tab]);

  const raw: any = tab === "birthday" ? dob : wa;
  const list: any[] = Array.isArray(raw) ? raw : [];
  const person = list[index];
  const isBirthday = tab === "birthday";

  const tabBtn = (key: typeof tab, label: string) => {
    const on = tab === key;
    return (
      <button
        onClick={() => setTab(key)}
        className="text-[11px] font-medium px-3 py-1 rounded-full cursor-pointer transition-colors"
        style={{
          backgroundColor: on ? DASH_PRIMARY : "#e0f6f6",
          color: on ? "#fff" : "#007f86",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <DashCard title="Birthdays & Anniversaries">
      <div className="flex gap-2 mb-3">
        {tabBtn("birthday", "Birthday")}
        {tabBtn("anniversary", "Anniversaries")}
      </div>

      {!person ? (
        <p className="text-xs text-gray-400 py-10 text-center">
          No {isBirthday ? "birthdays" : "anniversaries"} to show right now.
        </p>
      ) : (
        <>
          <div
            className="relative rounded-xl px-4 py-5 text-center text-white overflow-hidden"
            style={{
              background: isBirthday
                ? "linear-gradient(135deg, #3fa9f5 0%, #00a0a0 100%)"
                : "linear-gradient(135deg, #f59e0b 0%, #ef6c4d 100%)",
            }}
          >
            <span className="absolute top-2 left-3 text-xl">{isBirthday ? "🎉" : "🏆"}</span>
            <span className="absolute top-2 right-3 text-xl">{isBirthday ? "🎈" : "✨"}</span>
            <Avatar
              src={person.photo && !String(person.photo).includes("undefined") ? person.photo : undefined}
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                border: "3px solid #fff",
                bgcolor: "#9aa0a6",
                fontSize: 24,
              }}
            >
              {person.name?.charAt(0)}
            </Avatar>
            <p className="mt-2 text-sm font-bold">
              {isBirthday ? "Happy Birthday" : "Happy Work Anniversary"}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wide opacity-90 truncate">
              {person.name}
            </p>
            <p className="text-[10px] opacity-80 mt-0.5">
              {[person.department, person.date].filter(Boolean).join(" • ")}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => navigate("/vibe")}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-md border cursor-pointer hover:bg-[#f0fbfb]"
              style={{ borderColor: DASH_PRIMARY, color: DASH_PRIMARY }}
            >
              Send Wishes
            </button>
            {list.length > 1 && (
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <button
                  aria-label="Previous"
                  onClick={() => setIndex((i) => (i - 1 + list.length) % list.length)}
                  className="cursor-pointer hover:text-gray-600"
                >
                  <ChevronLeftIcon sx={{ fontSize: 18 }} />
                </button>
                {index + 1}/{list.length}
                <button
                  aria-label="Next"
                  onClick={() => setIndex((i) => (i + 1) % list.length)}
                  className="cursor-pointer hover:text-gray-600"
                >
                  <ChevronRightIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </DashCard>
  );
};

export default BirthdaysCard;
