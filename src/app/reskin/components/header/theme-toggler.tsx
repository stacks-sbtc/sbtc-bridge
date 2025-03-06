import { themeAtom } from "@/util/atoms";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";

export const ThemeToggler = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      className="hover:bg-lightGray dark:hover:bg-darkGray p-2 rounded-full"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  );
};
