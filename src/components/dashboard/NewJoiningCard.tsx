import { useRef } from "react";
import { Avatar } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useGetHireListQuery } from "../../services/events";
import DashCard from "./DashCard";

const NewJoiningCard = () => {
  const { data } = useGetHireListQuery();
  const scroller = useRef<HTMLDivElement>(null);
  const list: any[] = Array.isArray(data) ? data : [];

  const scrollBy = (dir: 1 | -1) =>
    scroller.current?.scrollBy({ left: dir * 220, behavior: "smooth" });

  const arrow = (dir: 1 | -1) => (
    <button
      aria-label={dir === 1 ? "Next" : "Previous"}
      onClick={() => scrollBy(dir)}
      className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
    >
      {dir === 1 ? <ChevronRightIcon sx={{ fontSize: 16 }} /> : <ChevronLeftIcon sx={{ fontSize: 16 }} />}
    </button>
  );

  return (
    <DashCard
      title="New Joining's"
      className="h-full"
      action={
        <div className="flex gap-1.5">
          {arrow(-1)}
          {arrow(1)}
        </div>
      }
    >
      {list.length === 0 ? (
        <p className="text-xs text-gray-400 py-8 text-center">No new joinees right now.</p>
      ) : (
        <div ref={scroller} className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar-for-menu">
          {list.map((p, i) => (
            <div
              key={p.time || i}
              className="flex-shrink-0 w-[150px] rounded-xl border border-gray-100 bg-[#fafbff] px-3 py-4 text-center"
            >
              <Avatar
                src={p.photo && !String(p.photo).includes("undefined") ? p.photo : undefined}
                sx={{ width: 52, height: 52, mx: "auto", bgcolor: "#00a0a0" }}
              >
                {p.name?.charAt(0)}
              </Avatar>
              <p className="mt-2 text-xs font-semibold text-gray-800 truncate">{p.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{p.department}</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: "#00a0a0" }}>
                {p.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashCard>
  );
};

export default NewJoiningCard;
