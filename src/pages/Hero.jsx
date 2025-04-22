import pokemonBg from "../assets/pokebg.jpg";
import pokeLogo from "../assets/pokelogo.png";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url(${pokemonBg})`,
      }}
    >
      {/* <div className="hero-overlay"></div> */}
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          {/* <h1 className="mb-5 text-5xl sm:text-6xl md:text-8xl font-bold font-pokemon text-primary text-outline-secondary">Pokémon</h1> */}
          <img src={pokeLogo} alt="pokemon logo" />
          <p className="mb-5 text-base md:text-lg leading-relaxed font-medium text-white/90">
            <span className="">Embark on Your Pokémon Adventure!</span> Search and explore detailed stats,
            types, and abilities of every Pokémon. Build your ultimate team,
            simulate epic battles, and keep track of your journey.
          </p>
          {/* <button className="btn btn-primary text-secondary font-bold hover:bg-yellow-300">
            Start Your Journey
          </button> */}
          <button className="relative cursor-pointer hover:translate-y-0.5">
            <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-secondary"></span>
            <Link to="/pokedex" className="fold-bold font-pokemon relative inline-block h-full w-full rounded border-2 border-secondary bg-primary px-3 py-1 text-base font-bold text-white transition duration-100 hover:bg-yellow-400 hover:text-secondary">
              Start Your Journey
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};
