import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  CartesianGrid,
} from "recharts";

const BARS = [
  { key: "WO",  name: "Week Off",    fill: "#94a3b8" },
  { key: "P",   name: "Present",     fill: "#16a34a" },
  { key: "A",   name: "Absent",      fill: "#ef4444" },
  { key: "SRT", name: "Short",       fill: "#64748b" },
  { key: "MIS", name: "Mispunch",    fill: "#eab308" },
  { key: "HLD", name: "Holiday",     fill: "#65a30d" },
  { key: "WFH", name: "WFH",         fill: "#4f46e5" },
  { key: "SL",  name: "Sick Leave",  fill: "#f97316" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        padding: "10px 14px",
        fontSize: 12,
        minWidth: 140,
      }}
    >
      <p style={{ fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: "#475569", marginBottom: 2 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: entry.fill, display: "inline-block" }} />
            {entry.name}
          </span>
          <span style={{ fontWeight: 600, color: entry.fill }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const ChartofAttendenece = ({ data }: { data: any }) => {
  const chartData = data?.months?.map((month: any, index: any) => {
    const entry: any = { month };
    data?.data?.forEach((category: any) => {
      entry[category.name] = category.data[index];
    });
    return entry;
  });

  if (!chartData?.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400 text-sm">
        No attendance data available
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <p className="text-sm font-semibold text-gray-500 mb-5 uppercase tracking-wide">
        Monthly Attendance Overview
      </p>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={chartData}
          barCategoryGap="38%"
          margin={{ top: 4, right: 8, left: -16, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 4 }} />
          <Legend
            wrapperStyle={{ paddingTop: 20, fontSize: 12 }}
            iconType="circle"
            iconSize={8}
          />
          {BARS.map(({ key, name, fill }, i) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={fill}
              name={name}
              radius={i === BARS.length - 1 ? [4, 4, 0, 0] : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartofAttendenece;
