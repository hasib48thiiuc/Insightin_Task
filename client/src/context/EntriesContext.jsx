import { createContext, useEffect, useState } from "react";
export const EntriesContext = createContext();

export function EntriesProvider({ children }) {
  const [entries, setEntries] = useState([]);
  var value;
  //const value = localStorage.getItem("entries");
  // console.log(JSON.parse(value))
  // fetch("http://localhost:3000/entries")
  // .then (res => res.json())
  // .then( data => console.log(data))
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/entries");
        const data = await response.json();
        if (!data) {
          setEntries([]);
        } else {
          setEntries(data);
        }
        // value = data.map( one => one);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  const totalIncome = entries
    .filter((entry) => entry.type === "income")
    .reduce((prev, entry) => prev + entry.value, 0);

  const totalExpense = entries
    .filter((entry) => entry.type === "expense")
    .reduce((prev, entry) => prev + entry.value, 0);

  return (
    <EntriesContext.Provider
      value={{ entries, setEntries, totalIncome, totalExpense }}
    >
      {children}
    </EntriesContext.Provider>
  );
}
