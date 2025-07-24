import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

const ChatofAttendenece = ({ data }: { data: any }) => {
  const chartData = data?.months?.map((month: any, index: any) => {
    const entry: any = { month };
    data?.data.forEach((category: any) => {
      entry[category.name] = category.data[index];
    });
    return entry;
  });
  return (
    <div className="w-full h-[65vh] flex justify-center items-center p-8">
      <ResponsiveContainer width={"100%"} height={350} >
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="WO" stackId="a" fill="#8884d8" />
          <Bar dataKey="P" stackId="a" fill="#16a34a" />
          <Bar dataKey="A" stackId="a" fill="#b91c1c" />
          <Bar dataKey="SRT" stackId="a" fill="#6b7280" />
          <Bar dataKey="MIS" stackId="a" fill="#ca8a04" />
          <Bar dataKey="HLD" stackId="a" fill="#577d15ff" />
          <Bar dataKey="WFH" stackId="a" fill="#4f46e5" />
          <Bar dataKey="SL" stackId="a" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ChatofAttendenece;
