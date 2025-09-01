import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const indicators = {
  "NY.GDP.MKTP.CD": "GDP (current US$)",
  "NY.GDP.PCAP.CD": "GDP per capita (current US$)",
  "SP.POP.TOTL": "Population, total",
  "SP.URB.TOTL.IN.ZS": "Urban population (% of total)",
  "SP.DYN.LE00.IN": "Life expectancy at birth (years)",
  "SL.UEM.TOTL.ZS": "Unemployment, total (% of labor force)",
  "SH.MED.BEDS.ZS": "Hospital beds (per 1,000 people)",
  "SH.IMM.MEAS": "Immunization, measles (% of children)",
  "SH.XPD.CHEX.GD.ZS": "Current health expenditure (% of GDP)",
  "SE.XPD.TOTL.GD.ZS": "Govt. expenditure on education (% of GDP)",
  "SE.PRM.ENRR": "School enrollment, primary (% gross)",
  "SE.TER.ENRR": "School enrollment, tertiary (% gross)",
  "EN.ATM.CO2E.PC": "CO2 emissions (metric tons per capita)",
  "AG.LND.FRST.ZS": "Forest area (% of land area)",
  "SI.POV.DDAY": "Poverty headcount ratio at $1.90 a day (% of population)",
  "SI.DST.10TH.10": "Income share held by highest 10%",
};

// Hook for fetching specific data with date range support for multiple countries
export const useWorldBankData = (
  indicatorCode,
  countryCodes = [],
  startYear = 1960,
  endYear = 2024
) => {
  return useQuery({
    queryKey: [
      "worldBankData",
      indicatorCode,
      countryCodes.join(";"),
      startYear,
      endYear,
    ],
    queryFn: async () => {
      if (!indicatorCode || !countryCodes.length) return [];
      const countryDataPromises = countryCodes.map((code) =>
        axios.get(
          `https://api.worldbank.org/v2/country/${code}/indicator/${indicatorCode}?format=json&per_page=100&date=${startYear}:${endYear}`
        )
      );
      const responses = await Promise.all(countryDataPromises);
      const allData = responses.map((response) => {
        if (!response.data || !response.data[1]) return [];
        return response.data[1]
          .filter((item) => item.value !== null)
          .map((item) => ({
            year: parseInt(item.date, 10),
            value: parseFloat(item.value),
          }))
          .reverse();
      });
      return allData;
    },
    staleTime: 1000 * 60 * 60,
    retry: false,
    enabled: !!indicatorCode && !!countryCodes.length,
  });
};

export const useCountryList = () => {
  return useQuery({
    queryKey: ["countryList"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://api.worldbank.org/v2/country?format=json&per_page=300"
      );
      return data[1]
        .filter((country) => country.region.value !== "Aggregates")
        .map((country) => ({
          id: country.id,
          name: country.name,
        }));
    },
    staleTime: Infinity,
  });
};
