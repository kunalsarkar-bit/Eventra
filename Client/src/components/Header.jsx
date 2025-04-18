import { Music, Sun, Moon } from "lucide-react";
import { useThemeProvider } from "../contexts/ThemeProvider";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const { currentTheme, changeCurrentTheme } = useThemeProvider();

  // Toggle theme between light and dark
  const toggleTheme = () => {
    changeCurrentTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 w-full p-4 shadow-md backdrop-blur-md bg-black/20 text-white z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 gap-2">
          <Music size={34} className="text-white" />
          <Link to="/home">
            <h1
              className="text-4xl text-white cursor-pointer"
              style={{
                fontFamily:
                  "'Dancing Script', 'Great Vibes', 'Pacifico', cursive",
                letterSpacing: "1px",
              }}
            >
              Eventra
            </h1>
          </Link>
          <img
            src={logo}
            alt="Logo"
            className="w-20 ml-6 mt-2 object-contain"
          />
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-opacity-20 hover:bg-white transition-colors text-white"
        >
          {currentTheme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
}
