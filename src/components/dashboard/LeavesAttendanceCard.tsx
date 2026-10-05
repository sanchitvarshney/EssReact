import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useGetShiftDetailsMutation, useGetShiftsMutation } from "../../services/shift";
import {
  useGetEarnLeaveMutation,
  useGetSickLeaveMutation,
  useGetWorkFromHomeMutation,
} from "../../services/Leave";
import { useAuth } from "../../contextapi/AuthContext";
import DashCard from "./DashCard";
import { DASH_PRIMARY } from "./DashboardRail";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const PRESENT = "#22a06b";
const ABSENT = "#e5484d";
const LEAVE = "#f59e0b";
const MISPUNCH = "#ca8a04";

const statusColor = (code?: string) => {
  switch (code?.toLowerCase()) {
    case "p":
      return PRESENT;
    case "a":
      return ABSENT;
    case "mis":
      return MISPUNCH;
    case "sl":
    case "el":
    case "hd":
    case "cl":
      return LEAVE;
    default:
      return undefined;
  }
};

const fmtTime = (v?: string) => {
  if (!v) return null;
  const m = moment(v, ["HH:mm:ss", "HH:mm", "YYYY-MM-DD HH:mm:ss"], true);
  return m.isValid() ? m.format("hh:mm A") : String(v);
};

const num = (v: any) => (v === undefined || v === null || v === "" ? "--" : v);

const LeavesAttendanceCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const empId = (user as any)?.id;

  const [getShiftDetails, { data: shift }] = useGetShiftDetailsMutation();
  const [getShifts, { data: month }] = useGetShiftsMutation();
  const [getEL, { data: elData }] = useGetEarnLeaveMutation();
  const [getSL, { data: slData }] = useGetSickLeaveMutation();
  const [getWFH, { data: wfhData }] = useGetWorkFromHomeMutation();

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");
    getShiftDetails({ start: today, end: today });
    getShifts({
      start: moment().startOf("month").format("YYYY-MM-DD"),
      end: moment().endOf("month").format("YYYY-MM-DD"),
    });
  }, []);

  useEffect(() => {
    if (!empId) return;
    const currentDate = moment().format("YYYY-MM-DD");
    getEL({ type: "EL", currentDate, empcode: empId });
    getSL({ type: "SL", currentDate, empcode: empId });
    getWFH({ type: "WFH", currentDate, empcode: empId });
  }, [empId]);

  const statusByDate = useMemo(() => {
    const map: Record<string, string> = {};
    ((month as any)?.data ?? []).forEach((it: any) => {
      map[moment(it.start).format("YYYY-MM-DD")] = it.title;
    });
    return map;
  }, [month]);

  const cells = useMemo(() => {
    const first = moment().startOf("month");
    const offset = (first.isoWeekday() + 6) % 7;
    const total = moment().daysInMonth();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: total }, (_, i) => first.clone().add(i, "d")),
    ];
  }, []);

  const inTime = fmtTime((shift as any)?.today_in);
  const el: any = elData;

  const balances = [
    { label: "Earned Leave", value: el?.data?.l_cl_bal, bg: "#e8efff", fg: "#3b5bdb" },
    { label: "Sick Leave", value: (slData as any)?.l_cl_bal, bg: "#fff1de", fg: "#d9730d" },
    { label: "Work From Home", value: (wfhData as any)?.l_cl_bal, bg: "#e3f7ee", fg: "#2e8b62" },
    { label: "Comp Off", value: el?.compBal ?? 0, bg: "#f3e8ff", fg: "#7e3fc4" },
  ];

  return (
    <DashCard title="Leaves & Attendance" className="h-full flex flex-col">
      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
        <span>Attendance</span>
        <span>{moment().format("DD MMM YYYY")}</span>
      </div>
      <button
        onClick={() => navigate("/attendance")}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium cursor-pointer text-left"
        style={{ backgroundColor: "#fff3e6", border: "1px solid #ffd9b0", color: "#c2610c" }}
      >
        <AccessTimeIcon sx={{ fontSize: 16 }} />
        {inTime ? `Punched in at ${inTime}` : "No punch-in recorded yet"}
      </button>

      <div className="mt-3 border border-gray-100 rounded-lg overflow-hidden">
        <p
          className="text-center text-xs font-semibold py-1.5"
          style={{ backgroundColor: "#e0f6f6", color: DASH_PRIMARY }}
        >
          {moment().format("MMMM YYYY")}
        </p>
        <div className="grid grid-cols-7 text-center px-2 pt-2">
          {DAYS.map((d, i) => (
            <span key={i} className="text-[10px] font-semibold text-gray-500 pb-1">
              {d}
            </span>
          ))}
          {cells.map((day, i) => {
            if (!day) return <span key={`e${i}`} />;
            const color = statusColor(statusByDate[day.format("YYYY-MM-DD")]);
            const isToday = day.isSame(moment(), "day");
            return (
              <span key={i} className="flex justify-center py-[3px]">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
                  style={{
                    color: color ?? "#4b5563",
                    fontWeight: color || isToday ? 700 : 400,
                    boxShadow: isToday ? `0 0 0 1.5px ${DASH_PRIMARY}` : "none",
                  }}
                >
                  {day.date()}
                </span>
              </span>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 py-2 text-[10px] text-gray-500">
          {[
            ["Present", PRESENT],
            ["Absent", ABSENT],
            ["Leaves", LEAVE],
          ].map(([label, color]) => (
            <span key={label} className="flex items-center gap-1">
              <span className="w-2 h-[3px] rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <span
          className="text-[11px] font-medium px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: DASH_PRIMARY }}
        >
          My Leaves
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        {balances.map(({ label, value, bg, fg }) => (
          <button
            key={label}
            onClick={() => navigate("/self-service/apply-leave")}
            className="rounded-lg px-3 py-2.5 text-left cursor-pointer hover:brightness-95 transition"
            style={{ backgroundColor: bg }}
          >
            <p className="text-[10px] font-medium" style={{ color: fg }}>
              {label}
            </p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">
              {num(value)} <span className="text-[10px] font-medium text-gray-500">days</span>
            </p>
          </button>
        ))}
      </div>
    </DashCard>
  );
};

export default LeavesAttendanceCard;
