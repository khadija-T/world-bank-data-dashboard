import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DataChart = ({ data, indicatorName }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="year" />
        <YAxis
          tickFormatter={(value) =>
            new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
        />
        <Tooltip
          formatter={(value) => new Intl.NumberFormat("en-US").format(value)}
          contentStyle={{
            backgroundColor: "#2d3748",
            border: "none",
            borderRadius: "0.5rem",
          }}
          labelStyle={{ color: "#cbd5e0" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          name={indicatorName}
          stroke="#48bb78"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DataChart;
