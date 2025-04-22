import { Link } from "react-router-dom";

export const Navbar = () => {
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
          className="text-2xl p-0 flex items-center gap-1 lg:text-3xl text-primary-content rounded-sm hover:bg-white/10 px-1"
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
      <div className="navbar-end">
        <button className="relative cursor-pointer hover:translate-y-0.5">
          <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-secondary"></span>
          <Link
            to="/battle"
            className="fold-bold font-pokemon relative inline-block h-full w-full rounded border-2 border-secondary bg-primary px-3 py-1 text-base font-bold text-white transition duration-100 hover:bg-primary"
          >
            Battle
          </Link>
        </button>
      </div>
    </div>
  );
};
