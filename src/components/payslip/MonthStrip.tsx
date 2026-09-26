import moment from "moment";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type Props = {
  selected: moment.Moment | null;
  year: number;
  onYearChange: (year: number) => void;
  onSelect: (month: moment.Moment) => void;
  disabled?: boolean;
};

const MonthStrip = ({ selected, year, onYearChange, onSelect, disabled }: Props) => {
  const now = moment();

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400">Pay period</p>
          <p className="text-sm font-semibold text-gray-800">Choose a month to open its payslip</p>
        </div>
        <div className="flex items-center gap-1 bg-[#f0fbfb] rounded-2xl p-1">
          <button
            aria-label="Previous year"
            onClick={() => onYearChange(year - 1)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#007f86] hover:bg-white cursor-pointer"
          >
            <ChevronLeftIcon sx={{ fontSize: 20 }} />
          </button>
          <span className="w-14 text-center text-sm font-bold text-[#007f86]">{year}</span>
          <button
            aria-label="Next year"
            onClick={() => onYearChange(year + 1)}
            disabled={year >= now.year()}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#007f86] hover:bg-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon sx={{ fontSize: 20 }} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
        {Array.from({ length: 12 }, (_, i) => {
          const m = moment({ year, month: i, day: 1 });
          const future = m.isAfter(now, "month");
          const active = !!selected && selected.isSame(m, "month");
          return (
            <button
              key={i}
              disabled={disabled || future}
              onClick={() => onSelect(m)}
              className={`py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer disabled:cursor-not-allowed ${
                active
                  ? "text-white shadow-md bg-gradient-to-br from-[#00a0a0] to-[#007f86]"
                  : future
                    ? "text-gray-300 bg-gray-50"
                    : "text-gray-600 bg-gray-50 hover:bg-[#e0f6f6] hover:text-[#007f86]"
              }`}
            >
              {m.format("MMM")}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MonthStrip;
