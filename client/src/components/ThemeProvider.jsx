import React from "react";
import { useSelector } from "react-redux";
import { themeSelector } from "../redux/reducers/themeReducer";

function ThemeProvider({ children }) {
  const { theme } = useSelector(themeSelector);

  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:bg-[rgb(16,23,42)] dark:text-gray-200 min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default ThemeProvider;
