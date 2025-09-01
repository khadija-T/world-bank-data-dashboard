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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 md:p-8">
      <main className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            World Bank Data Dashboard
          </h1>
          <p className="text-lg text-gray-400">
            Visualizing Development Indicators
          </p>
        </header>

        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="country-select"
                className="block mb-2 text-sm font-medium text-gray-300"
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
                className="basic-multi-select text-black"
                classNamePrefix="select"
              />
            </div>

            <div>
              <label
                htmlFor="indicator-select"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Select an Indicator:
              </label>
              <select
                id="indicator-select"
                value={indicator}
                onChange={(e) => setIndicator(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              >
                {Object.entries(indicators).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Select Year Range:
              </label>
              <Slider
                range
                min={1960}
                max={2024}
                value={yearRange}
                onChange={setYearRange}
                className="w-full"
              />
            </div>
          </div>

          <div className="h-[300px] sm:h-[400px]">
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
