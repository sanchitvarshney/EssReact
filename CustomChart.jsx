import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ComposedChart,
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

// Enhanced color palette with gradients
const colors = [
  { stroke: "#6366f1", fill: "url(#gradient1)" },
  { stroke: "#10b981", fill: "url(#gradient2)" },
  { stroke: "#f59e0b", fill: "url(#gradient3)" },
  { stroke: "#ef4444", fill: "url(#gradient4)" },
  { stroke: "#8b5cf6", fill: "url(#gradient5)" },
  { stroke: "#06b6d4", fill: "url(#gradient6)" },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl p-4 min-w-[200px]">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-600">
                {entry.name}:
              </span>
            </div>
            <span className="text-sm font-bold text-gray-800">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom legend component
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-4 h-1 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-gray-700">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Monthly Performance Overview
        </h3>
        <p className="text-gray-600 text-sm">
          Track your key metrics across different months
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="gradient3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="gradient4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="gradient5" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="gradient6" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#f1f5f9" 
            vertical={false}
          />
          
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            padding={{ left: 20, right: 20 }}
          />
          
          <YAxis 
            domain={[0, 31]} 
            tickCount={7}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {rawData.map((series, index) => (
            <Area
              key={`area-${series.name}`}
              type="monotone"
              dataKey={series.name}
              stroke="transparent"
              fill={colors[index % colors.length].fill}
              fillOpacity={0.1}
            />
          ))}
          
          {rawData.map((series, index) => (
            <Line
              key={series.name}
              type="monotone"
              dataKey={series.name}
              stroke={colors[index % colors.length].stroke}
              strokeWidth={3}
              dot={{ 
                r: 4, 
                fill: colors[index % colors.length].stroke,
                stroke: 'white',
                strokeWidth: 2
              }}
              activeDot={{ 
                r: 6, 
                fill: colors[index % colors.length].stroke,
                stroke: 'white',
                strokeWidth: 3
              }}
            />
          ))}
          
          <Legend content={<CustomLegend />} />
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {rawData.map((series, index) => {
          const total = series.data.reduce((sum, val) => sum + val, 0);
          const avg = total / series.data.length;
          return (
            <div key={series.name} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index % colors.length].stroke }}
                />
                <span className="font-semibold text-gray-800">{series.name}</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>Total: {total}</div>
                <div>Avg: {avg.toFixed(1)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomChart; 