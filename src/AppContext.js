import { createContext } from "react";

const initialValue = {
  monthNumber: 0,
  setMonthNumber: (number) => {
    console.log(number);
  },
  yearNumber: 0,
  setYearNumber: (number) => {
    console.log(number);
  },
};

const AppContext = createContext(initialValue);
export default AppContext;
