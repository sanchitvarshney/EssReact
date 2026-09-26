import type { ReactNode } from "react";
import { formatINR, toNumber } from "./payslipUtils";

type Item = { label: string; value: string };

type Props = {
  title: string;
  icon: ReactNode;
  items: Item[];
  total: number;
  visible: boolean;
  accent: string;
  tint: string;
  barFrom: string;
  barTo: string;
};

const LedgerCard = ({ title, icon, items, total, visible, accent, tint, barFrom, barTo }: Props) => {
  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: tint }}>
        <div className="flex items-center gap-2" style={{ color: accent }}>
          {icon}
          <span className="text-sm font-bold tracking-wide">{title}</span>
        </div>
        <span className="text-xs font-semibold" style={{ color: accent }}>
          {items.length} items
        </span>
      </div>

      <div className="px-5 py-2 flex-1">
        {items.map((item) => {
          const amount = toNumber(item.value);
          const share = total > 0 ? Math.min(100, (amount / total) * 100) : 0;
          return (
            <div key={item.label} className="py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-semibold text-gray-800 tabular-nums">
                  ₹ {visible ? item.value : "••••"}
                </span>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: visible ? `${share}%` : "0%",
                    background: `linear-gradient(90deg, ${barFrom}, ${barTo})`,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100" style={{ backgroundColor: tint }}>
        <span className="text-sm font-bold" style={{ color: accent }}>
          Total {title}
        </span>
        <span className="text-sm font-bold tabular-nums" style={{ color: accent }}>
          ₹ {visible ? formatINR(total) : "••••"}
        </span>
      </div>
    </section>
  );
};

export default LedgerCard;
