

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const rawData = [
  { name: "WO", data: [2, 5, 4, 5, 4, 4, 5, 4] },
  { name: "P", data: [16, 6, 0, 0, 0, 0, 0, 0] },
  { name: "A", data: [0, 17, 27, 26, 26, 27, 25, 27] },
  { name: "SRT", data: [2, 2, 0, 0, 0, 0, 0, 0] },
  { name: "MIS", data: [0, 0, 0, 0, 0, 0, 0, 0] },
  { name: "HLD", data: [0, 0, 0, 0, 0, 0, 0, 0] },
];

const months = [
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];



const chartData = months.map((month, index) => {
  const monthData = { month };
  rawData.forEach((series) => {
  //@ts-ignore
    monthData[series.name] = series.data[index];
  });
  
  return monthData;
});



const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57"];

const CustomChart = () => {
  return (
    <ResponsiveContainer width={"100%"} height={400} className={" p-2 mt-3"}>
      
      <LineChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis domain={[0, 31]} tickCount={7} />
        <Tooltip />
        <Legend />
        {rawData.map((series, index) => (
          <Line
            key={series.name}
            type="monotone"
            dataKey={series.name}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomChart;

