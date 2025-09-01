import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from "react";
import Select from "react-select";
import DataChart from "./components/DataChart";
import {
  indicators,
  useCountryList,
  useWorldBankData,
} from "./hooks/useWorldBankData";

function App() {
  const [countries, setCountries] = useState([
    { value: "BGD", label: "Bangladesh" },
  ]);
  const [indicator, setIndicator] = useState("NY.GDP.MKTP.CD");
  const [yearRange, setYearRange] = useState([1960, 2024]);

  const { data: countryList, isLoading: countriesLoading } = useCountryList();
  const { data, isLoading, isError, error } = useWorldBankData(
    indicator,
    countries.map((c) => c.value),
    yearRange[0],
    yearRange[1]
  );

  const selectedCountryName =
    countryList?.find((c) => c.id === countries[0]?.value)?.name || "...";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-2 sm:p-4 md:p-6 lg:p-8">
      <main className="max-w-5xl mx-auto">
        <header className="text-center mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            World Bank Data Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-gray-400">
            Visualizing Development Indicators for {selectedCountryName}
          </p>
        </header>

        <section className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label
                htmlFor="country-select"
                className="block mb-1 text-sm font-medium text-gray-300"
              >
                Select Countries:
              </label>
              <Select
                isMulti
                options={countryList?.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                value={countries}
                onChange={setCountries}
                isDisabled={countriesLoading}
                className="basic-multi-select w-full text-gray-700"
                classNamePrefix="select"
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 1000, // Ensure dropdown appears above other elements
                  }),
                  control: (provided) => ({
                    ...provided,
                    minHeight: "38px", // Adjust height for mobile
                    fontSize: "14px", // Smaller text for mobile
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    fontSize: "12px", // Smaller tags for mobile
                  }),
                }}
              />
            </div>

            <div>
              <label
                htmlFor="indicator-select"
                className="block mb-1 text-sm font-medium text-gray-300"
              >
                Select an Indicator:
              </label>
              <select
                id="indicator-select"
                value={indicator}
                onChange={(e) => setIndicator(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2"
              >
                {Object.entries(indicators).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Select Year Range:
              </label>
              <Slider
                range
                min={1960}
                max={2024}
                value={yearRange}
                onChange={setYearRange}
                className="w-full"
                trackStyle={{ backgroundColor: "#48bb78", height: "6px" }}
                handleStyle={{
                  borderColor: "#48bb78",
                  height: "16px",
                  width: "16px",
                  marginTop: "-5px",
                }}
                railStyle={{ backgroundColor: "#4a5568", height: "6px" }}
              />
            </div>
          </div>

          <div className="h-[250px] sm:h-[300px] md:h-[400px]">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <p className="text-xl text-gray-400">Loading Chart...</p>
              </div>
            )}
            {isError && (
              <div className="flex items-center justify-center h-full bg-red-900/20 rounded-lg">
                <p className="text-xl text-red-400">Error: {error.message}</p>
              </div>
            )}
            {!isLoading && !isError && (
              <DataChart
                data={data}
                indicatorName={indicators[indicator]}
                countryList={countryList}
                countries={countries}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
