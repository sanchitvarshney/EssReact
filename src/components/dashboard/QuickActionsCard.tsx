import { useMemo, useState } from "react";
import ImageCard from "../reuseable/ImageCard";
import { homeData } from "../../staticData/homepagedata";
import DashCard from "./DashCard";
import { DASH_PRIMARY } from "./DashboardRail";

const GROUPS: { label: string; ids: string[] | null }[] = [
  { label: "All", ids: null },
  { label: "Work", ids: ["taskbox", "performance", "org", "peripheral"] },
  { label: "Self Service", ids: ["attendance", "leave", "payroll", "document"] },
  { label: "Company", ids: ["vibe", "holiday", "help"] },
];

// Soft pastel backgrounds for the app tiles (cycled in order).
const TILE_TINTS = ["#e8efff", "#f3e8ff", "#e3f7ee", "#fff4d6", "#e6f4ff", "#ffe8ef"];

type Props = {
  kraBadge?: { label: string; color: string } | null;
};

const QuickActionsCard = ({ kraBadge }: Props) => {
  const [group, setGroup] = useState("All");

  const items = useMemo(() => {
    const ids = GROUPS.find((g) => g.label === group)?.ids;
    return ids ? homeData.filter((h) => ids.includes(h.id)) : homeData;
  }, [group]);

  return (
    <DashCard title="Quick Actions" className="h-full flex flex-col">
      <div className="flex flex-wrap gap-2 mb-4">
        {GROUPS.map(({ label }) => {
          const on = group === label;
          return (
            <button
              key={label}
              onClick={() => setGroup(label)}
              className="text-[11px] font-medium px-3 py-1 rounded-full cursor-pointer transition-colors"
              style={{
                backgroundColor: on ? DASH_PRIMARY : "#e0f6f6",
                color: on ? "#fff" : "#007f86",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-5 pb-1">
        {items.map((item, index) => (
          <ImageCard
            key={item.id}
            variant="tile"
            tint={TILE_TINTS[index % TILE_TINTS.length]}
            title={item.title}
            image={item.icon}
            path={item.path}
            badge={item.id === "performance" ? kraBadge ?? undefined : undefined}
          />
        ))}
      </div>
    </DashCard>
  );
};

export default QuickActionsCard;
