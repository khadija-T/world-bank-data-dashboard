import { useState } from "react";
// Import the new hook and the updated indicators list
import DataChart from "./components/DataChart";
import {
  indicators,
  useCountryList,
  useWorldBankData,
} from "./hooks/useWorldBankData";

function App() {
  // Add state for the selected country, default to Bangladesh (BGD)
  const [country, setCountry] = useState("BGD");
  const [indicator, setIndicator] = useState("NY.GDP.MKTP.CD");

  // Fetch the list of countries
  const { data: countryList, isLoading: countriesLoading } = useCountryList();

  // Fetch the main chart data using both country and indicator state
  const { data, isLoading, isError, error } = useWorldBankData(
    indicator,
    country
  );

  // Find the full name of the currently selected country for the title
  const selectedCountryName =
    countryList?.find((c) => c.id === country)?.name || "...";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-8">
      <main className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            World Bank Data Dashboard
          </h1>
          {/* Make the subtitle dynamic based on the selected country */}
          <p className="text-lg text-gray-400">
            Visualizing Development Indicators for {selectedCountryName}
          </p>
        </header>

        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
          {/* Controls Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* ++ NEW Country Selector ++ */}
            <div>
              <label
                htmlFor="country-select"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Select a Country:
              </label>
              <select
                id="country-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={countriesLoading} // Disable while loading countries
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              >
                {countriesLoading ? (
                  <option>Loading countries...</option>
                ) : (
                  countryList?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Indicator Selector (Now includes Health & Education) */}
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
          </div>

          {/* Chart Area */}
          <div className="h-[400px]">
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
              <DataChart data={data} indicatorName={indicators[indicator]} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
