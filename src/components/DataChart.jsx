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

const DataChart = ({ data, indicatorName, countryList, countries }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data to display.
      </div>
    );
  }

  // Data is an array of arrays (one per country)
  const chartData = data;

  // Align data by year, filling gaps with null
  const years = [...new Set(chartData.flat().map((item) => item.year))].sort();
  const processedData = years.map((year) => {
    const entry = { year };
    chartData.forEach((countryData, i) => {
      const item = countryData.find((d) => d.year === year);
      entry[`value${i}`] = item ? item.value : null;
    });
    return entry;
  });

  // Check if processedData is empty or all values are null
  const hasData = processedData.some((entry) =>
    Object.values(entry).some((value) => value !== null && value !== entry.year)
  );

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available for this indicator.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={processedData}
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
        {chartData.map((_, i) => (
          <Line
            key={i}
            type="monotone"
            dataKey={`value${i}`}
            name={`${indicatorName} - ${
              countryList?.find((c) => c.id === countries[i]?.value)?.name ||
              `Country ${i + 1}`
            }`}
            stroke={["#48bb78", "#ecc94b", "#81e6d9"][i % 3]} // Cycle colors
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DataChart;
