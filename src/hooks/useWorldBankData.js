import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Add new Health and Education indicators to your list
export const indicators = {
  "NY.GDP.MKTP.CD": "GDP (current US$)",
  "SP.POP.TOTL": "Population, total",
  "SP.DYN.LE00.IN": "Life expectancy at birth (years)",
  // --- HEALTH ---
  "SH.MED.BEDS.ZS": "Hospital beds (per 1,000 people)",
  "SH.IMM.MEAS": "Immunization, measles (% of children)",
  // --- EDUCATION ---
  "SE.XPD.TOTL.GD.ZS": "Govt. expenditure on education (% of GDP)",
  "SE.PRM.ENRR": "School enrollment, primary (% gross)",
};

// This is the hook for fetching specific data (no changes needed here)
export const useWorldBankData = (indicatorCode, countryCode) => {
  return useQuery({
    queryKey: ["worldBankData", indicatorCode, countryCode],
    queryFn: async () => {
      if (!indicatorCode || !countryCode) return null;
      const { data } = await axios.get(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=100`
      );
      if (!data || !data[1]) {
        throw new Error("No data available for this selection.");
      }
      return data[1]
        .filter((item) => item.value !== null)
        .map((item) => ({
          year: parseInt(item.date, 10),
          value: parseFloat(item.value),
        }))
        .reverse();
    },
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};

// ++ NEW HOOK: To fetch the list of all countries for the selector ++
export const useCountryList = () => {
  return useQuery({
    queryKey: ["countryList"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://api.worldbank.org/v2/country?format=json&per_page=300"
      );
      // We only want countries with a region, which filters out aggregates
      return data[1]
        .filter((country) => country.region.value !== "Aggregates")
        .map((country) => ({
          id: country.id,
          name: country.name,
        }));
    },
    staleTime: Infinity, // This list doesn't change, so cache it forever
  });
};
