import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "pokemon"
  );

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    // Set the theme on document when component mounts
    document.documentElement.setAttribute("data-theme", theme);
    // Update localStorage when theme changes
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "pokemon" ? "dark" : "pokemon");
  };

  return (
    <div className="navbar bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm px-6 sm:px-12 md:px-20 sticky top-0 z-10">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn bg-transparent hover:bg-white/10 border-none sm:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/pokedex">Pokédex</Link>
            </li>
            <li>
              <Link to="/team">Team</Link>
            </li>
            <li>
              <Link to="/history">History</Link>
            </li>
          </ul>
        </div>
        <Link
          to="/"
          className="text-xl p-0 flex items-center gap-1 lg:text-3xl text-primary-content rounded-sm hover:bg-white/10 px-1"
        >
          Pokémon
        </Link>
      </div>
      <div className="navbar-center hidden sm:flex">
        <ul className="menu menu-horizontal px-1 lg:text-lg">
          <li>
            <Link to="/pokedex">Pokédex</Link>
          </li>
          <li>
            <Link to="/team">Team</Link>
          </li>
          <li>
            <Link to="/history">History</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-4">
        <button className="relative cursor-pointer hover:translate-y-0.5">
          <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-blue-700"></span>
          <Link
            to="/battle"
            className="fold-bold font-pokemon relative inline-block h-full w-full rounded border-2 border-blue-700 bg-yellow-400 px-3 py-1 text-base font-bold text-white transition duration-100 hover:bg-yellow-500 hover:text-secondary"
          >
            Battle
          </Link>
        </button>
        <label className="swap swap-rotate">
          {/* using checked state instead of value for controlled component */}
          <input
            type="checkbox"
            className="theme-controller"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />

          {/* sun icon */}
          <svg
            className="swap-off size-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg
            className="swap-on size-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </div>
    </div>
  );
};
