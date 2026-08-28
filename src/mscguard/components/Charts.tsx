import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PALETTE = ["#1d4ed8", "#16a34a", "#d97706", "#dc2626", "#9333ea", "#0891b2", "#db2777", "#6b7280"];

interface DataPoint {
  label: string;
  value: number;
}

const tooltipStyle = {
  fontFamily: "Lexend, sans-serif",
  fontSize: 12,
  borderRadius: 6,
  border: "1px solid #e5e7eb",
};

/** Vertical bar chart — used for "Requests by Type". */
export function TypeBarChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fontFamily: "Lexend, sans-serif" }} interval={0} angle={-20} textAnchor="end" height={60} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fontFamily: "Lexend, sans-serif" }} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f9fafb" }} />
        <Bar dataKey="value" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Horizontal bar chart — used for "By Department", visually distinct from the vertical Type chart. */
export function DepartmentBarChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fontFamily: "Lexend, sans-serif" }} />
        <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11, fontFamily: "Lexend, sans-serif" }} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f9fafb" }} />
        <Bar dataKey="value" fill="#16a34a" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Donut chart — used for "By Status". */
export function StatusPieChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: "Lexend, sans-serif" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
