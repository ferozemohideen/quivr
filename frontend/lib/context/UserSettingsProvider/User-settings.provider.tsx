import { createContext, useEffect, useState } from "react";

import { parseBoolean } from "@/lib/helpers/parseBoolean";

type UserSettingsContextType = {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserSettingsContext = createContext<
  UserSettingsContextType | undefined
>(undefined);

export const UserSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const localIsDarkMode = localStorage.getItem("isDarkMode");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return parseBoolean(localIsDarkMode);
  });

  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const newState =
      localIsDarkMode !== null
        ? parseBoolean(localIsDarkMode)
        : prefersDarkMode;
    setIsDarkMode(newState);
    newState
      ? document.body.classList.add("dark_mode")
      : document.body.classList.remove("dark_mode");

    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) => {
      const updatedState = event.matches;
      setIsDarkMode(updatedState);
      localStorage.setItem("isDarkMode", JSON.stringify(updatedState));
    };
    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);

  useEffect(() => {
    isDarkMode
      ? document.body.classList.add("dark_mode")
      : document.body.classList.remove("dark_mode");

    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <UserSettingsContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};
