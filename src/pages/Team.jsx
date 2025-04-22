import { Navbar } from "../components/Navbar";
import React, { useState, useEffect } from "react";
import axios from "axios";

const typeColors = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-orange-700",
  poison: "bg-purple-600",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-400",
  bug: "bg-lime-500",
  rock: "bg-yellow-800",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

const typeLightColors = {
  normal: "bg-gray-200",
  fire: "bg-red-200",
  water: "bg-blue-200",
  electric: "bg-yellow-200",
  grass: "bg-green-200",
  ice: "bg-cyan-100",
  fighting: "bg-orange-200",
  poison: "bg-purple-200",
  ground: "bg-yellow-100",
  flying: "bg-indigo-200",
  psychic: "bg-pink-200",
  bug: "bg-lime-200",
  rock: "bg-yellow-300",
  ghost: "bg-violet-200",
  dragon: "bg-indigo-300",
  dark: "bg-gray-300",
  steel: "bg-gray-200",
  fairy: "bg-pink-100",
};

// Element logos as simple SVG components
const ElementLogo = ({ type }) => {
  switch (type) {
    case "fire":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-500 fill-current">
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM13,12c0,3 -2,4 -2,4s-2,-1 -2,-4s2,-6 2,-6S13,9 13,12z" />
        </svg>
      );
    case "water":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500 fill-current">
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12,19c-3.31,0 -6,-2.69 -6,-6c0,-3.09 4,-9 6,-9c2,0 6,5.91 6,9C18,16.31 15.31,19 12,19z" />
        </svg>
      );
    case "grass":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-green-500 fill-current"
        >
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM8,17.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5s2.5,1.12 2.5,2.5S9.38,17.5 8,17.5zM12,12c-1.38,0 -2.5,-1.12 -2.5,-2.5S10.62,7 12,7s2.5,1.12 2.5,2.5S13.38,12 12,12zM16,17.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5s2.5,1.12 2.5,2.5S17.38,17.5 16,17.5z" />
        </svg>
      );
    case "electric":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-yellow-400 fill-current"
        >
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM13,17h-2v-7h2V17zM13,8h-2V6h2V8z" />
        </svg>
      );
    case "normal":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400 fill-current">
          <circle cx="12" cy="12" r="8" />
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12,20c-4.41,0 -8,-3.59 -8,-8c0,-4.41 3.59,-8 8,-8s8,3.59 8,8C20,16.41 16.41,20 12,20z" />
        </svg>
      );
    case "fighting":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-orange-700 fill-current"
        >
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM15,15.5c-1.66,0 -3,-1.34 -3,-3c0,-0.31 0.05,-0.61 0.14,-0.9L8.5,8.96V12h-2V7h5v2H8.96l3.64,2.64c0.29,-0.09 0.59,-0.14 0.9,-0.14c1.66,0 3,1.34 3,3S16.66,15.5 15,15.5z" />
        </svg>
      );
    case "flying":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-indigo-400 fill-current"
        >
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM7,13h10c0,2.76 -2.24,5 -5,5S7,15.76 7,13zM7,9h10c0,0 -2,3 -5,3S7,9 7,9zM12,4c1.66,0 3,1.34 3,3H9C9,5.34 10.34,4 12,4z" />
        </svg>
      );
    case "poison":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-purple-600 fill-current"
        >
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12,6c2.21,0 4,1.79 4,4c0,2.21 -1.79,4 -4,4s-4,-1.79 -4,-4C8,7.79 9.79,6 12,6zM6,12c0,-3.31 2.69,-6 6,-6s6,2.69 6,6c0,3.31 -2.69,6 -6,6S6,15.31 6,12z" />
        </svg>
      );
    case "ground":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-yellow-600 fill-current"
        >
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12,20c-4.41,0 -8,-3.59 -8,-8c0,-4.41 3.59,-8 8,-8s8,3.59 8,8C20,16.41 16.41,20 12,20zM7,14h10v2H7V14zM7,11h10v2H7V11zM7,8h10v2H7V8z" />
        </svg>
      );
    case "rock":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-yellow-800 fill-current"
        >
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM16,13l-4,4l-4,-4l-3,-6h14L16,13z" />
        </svg>
      );
    case "bug":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-lime-500 fill-current">
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12,17c-2.76,0 -5,-2.24 -5,-5h10C17,14.76 14.76,17 12,17zM15,10h-2V7h-2v3H9V7H7v3c0,2.76 2.24,5 5,5s5,-2.24 5,-5v-3h-2V10z" />
        </svg>
      );
    case "ghost":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-violet-700 fill-current"
        >
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12,18c-3.31,0 -6,-2.69 -6,-6c0,-1 0.25,-1.94 0.68,-2.77c0.44,1.16 1.56,2 2.88,2C11.31,11.22 13,9.53 13,7.5c0,-0.17 -0.02,-0.34 -0.05,-0.5h3.08C15.19,8.58 14,10.18 14,12c0,3.31 2.69,6 6,6c-0.92,0 -1.79,-0.21 -2.56,-0.58C16.5,17.12 16,15 14,15c-1.17,0 -2,0.83 -2,2V18z" />
        </svg>
      );
    case "steel":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 fill-current">
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12,18l-5,-2.18v-5.64L12,8l5,2.18v5.64L12,18z" />
        </svg>
      );
    case "ice":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyan-300 fill-current">
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12.71,16.71L9.88,13.88L12,9.29l3.12,4.59L12.71,16.71zM7.88,10.12l2.83,-2.83L15.12,12l-2.83,2.83L7.88,10.12z" />
        </svg>
      );
    case "dragon":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-indigo-700 fill-current"
        >
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12.71,15.29L11,13.59V10c0,-0.55 0.45,-1 1,-1s1,0.45 1,1v2.59l1.71,1.71c0.39,0.39 0.39,1.02 0,1.41C13.73,15.68 13.09,15.68 12.71,15.29zM16,9c0,0.55 -0.45,1 -1,1s-1,-0.45 -1,-1s0.45,-1 1,-1S16,8.45 16,9z" />
        </svg>
      );
    case "dark":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-800 fill-current">
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12,17c-2.76,0 -5,-2.24 -5,-5s2.24,-5 5,-5s5,2.24 5,5S14.76,17 12,17z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "fairy":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-pink-300 fill-current">
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12,18l-2,-5l-5,-2l5,-2l2,-5l2,5l5,2l-5,2L12,18z" />
        </svg>
      );
    case "psychic":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-pink-400 fill-current">
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12,16c-2.21,0 -4,-1.79 -4,-4s1.79,-4 4,-4s4,1.79 4,4S14.21,16 12,16zM12,12c-0.55,0 -1,-0.45 -1,-1s0.45,-1 1,-1s1,0.45 1,1S12.55,12 12,12z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400 fill-current">
          <path d="M12,2C6.48,2 2,6.48 2,12c0,5.52 4.48,10 10,10s10,-4.48 10,-10C22,6.48 17.52,2 12,2zM12,20c-4.41,0 -8,-3.59 -8,-8c0,-4.41 3.59,-8 8,-8s8,3.59 8,8C20,16.41 16.41,20 12,20z" />
        </svg>
      );
  }
};

export const Team = () => {
  const [team, setTeam] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedToRemove, setSelectedToRemove] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get("http://localhost:3001/team");
      const fetchedTeam = res.data;
      setTeam(fetchedTeam);

      const details = {};
      await Promise.all(
        fetchedTeam.map(async (p) => {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${p.name}`
          );
          const pokemon = response.data;
          const weaknesses = await getWeaknesses(pokemon.types);

          // Determine evolution status (simplified based on ID like in PokemonCard)
          let status = "Basic";
          if (pokemon.id > 150) {
            status = "Evolved";
          } else if (pokemon.id > 75) {
            status = "Stage 1";
          }

          details[pokemon.name] = {
            ...pokemon,
            weaknesses,
            status,
          };
        })
      );

      setPokemonDetails(details);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const getWeaknesses = async (types) => {
    const damageRelationsList = await Promise.all(
      types.map((type) =>
        axios.get(`https://pokeapi.co/api/v2/type/${type.type.name}`)
      )
    );

    const allDoubleDamageFrom = damageRelationsList.flatMap((res) =>
      res.data.damage_relations.double_damage_from.map((t) => t.name)
    );

    const allHalfDamageFrom = damageRelationsList.flatMap((res) =>
      res.data.damage_relations.half_damage_from.map((t) => t.name)
    );

    const allNoDamageFrom = damageRelationsList.flatMap((res) =>
      res.data.damage_relations.no_damage_from.map((t) => t.name)
    );

    const counts = {};
    for (const type of allDoubleDamageFrom) {
      counts[type] = (counts[type] || 0) + 1;
    }
    for (const type of allHalfDamageFrom) {
      counts[type] = (counts[type] || 0) - 1;
    }
    for (const type of allNoDamageFrom) {
      counts[type] = -10;
    }

    return Object.keys(counts).filter((type) => counts[type] > 0);
  };

  const confirmRemove = (pokemon) => {
    setSelectedToRemove(pokemon);
    document.getElementById("confirm-remove-modal").showModal();
  };

  const removeFromTeam = async () => {
    if (!selectedToRemove) return;
    const { id, name } = selectedToRemove;

    try {
      await axios.delete(`http://localhost:3001/team/${id}`);
      setTeam((prevTeam) => prevTeam.filter((pokemon) => pokemon.id !== id));
      setToastMessage(`${name} has been removed from your team.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error removing Pokémon:", error);
    } finally {
      setSelectedToRemove(null);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h2 className="text-3xl font-bold my-10 text-center">
          My Pokémon Team
        </h2>

        {/* Toast Notification */}
        {showToast && (
          <div className="toast toast-top toast-end z-50">
            <div className="alert alert-error text-white">
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <dialog id="confirm-remove-modal" className="modal">
          <div className="modal-box bg-base-200">
            <h3 className="font-bold text-lg text-red-500">Remove Pokémon</h3>
            <p className="py-4">
              Are you sure you want to remove{" "}
              <strong className="capitalize">{selectedToRemove?.name}</strong>{" "}
              from your team?
            </p>
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                <button className="btn">Cancel</button>
                <button
                  className="btn btn-error text-white"
                  onClick={removeFromTeam}
                >
                  Remove
                </button>
              </form>
            </div>
          </div>
        </dialog>

        {team.length === 0 ? (
          <p className="text-center text-slate-500">Your team is empty.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:px-12 gap-4 place-items-center container mx-auto">
            {team.map((p) => {
              const pokemon = pokemonDetails[p.name];
              if (!pokemon) return null;

              const primaryType = pokemon.types[0].type.name;
              const figureBg = typeColors[primaryType] || "bg-gray-300";

              // Get HP value from stats
              const hp =
                pokemon.stats.find((stat) => stat.stat.name === "hp")
                  ?.base_stat || "??";

              return (
                <div
                  key={pokemon.id}
                  className="card bg-base-200 shadow-md p-2 w-64 font-pokemon"
                  onClick={() =>
                    document.getElementById(`modal-${p.id}`).showModal()
                  }
                >
                  <figure className={`rounded-t-lg ${figureBg}`}>
                    <img
                      src={
                        pokemon.sprites.other["official-artwork"].front_default
                      }
                      className="w-48 cursor-pointer"
                      alt={pokemon.name}
                    />
                  </figure>
                  <div className="card-body bg-base-300 rounded-b-lg">
                    <h2 className="card-title capitalize text-base-content">
                      {pokemon.name}
                    </h2>

                    {/* Status and HP row */}
                    <div className="rounded-md flex justify-between items-center p-1 bg-base-300">
                      <p className="font-semibold text-zinc-500">
                        {pokemon.status}
                      </p>
                      <div className="flex gap-2 items-center">
                        <p className="font-semibold">HP {hp}</p>
                        <ElementLogo type={primaryType} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {pokemon.types.map((t) => (
                        <span
                          key={t.type.name}
                          className={`badge text-white ${
                            typeColors[t.type.name]
                          }`}
                        >
                          {t.type.name.toUpperCase()}
                        </span>
                      ))}
                    </div>

                    {/* Modal */}
                    <dialog id={`modal-${p.id}`} className="modal">
                      <div className="modal-box bg-base-200">
                        <form method="dialog">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <p className="capitalize font-bold text-xl text-center mt-4 rounded-lg text-primary">
                          {pokemon.name}{" "}
                          <span className="text-zinc-500">
                            #{pokemon.id.toString().padStart(4, "0")}
                          </span>
                        </p>

                        {/* Status and HP row in modal */}
                        <div className="rounded-md flex justify-between items-center p-2 bg-base-300 mt-2">
                          <p className="font-semibold text-zinc-500">
                            {pokemon.status}
                          </p>
                          <div className="flex gap-2 items-center">
                            <p className="font-semibold">HP {hp}</p>
                            <ElementLogo type={primaryType} />
                          </div>
                        </div>

                        <div className="mt-2 md:flex md:gap-4 md:justify-center">
                          <figure className={`rounded-lg ${figureBg}`}>
                            <img
                              src={
                                pokemon.sprites.other["official-artwork"]
                                  .front_default
                              }
                              className="w-48"
                              alt={pokemon.name}
                            />
                          </figure>

                          <div>
                            <div className="bg-base-300 rounded-lg mt-2 px-4 py-2">
                              <p className="font-semibold mb-2 text-base">
                                Types
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {pokemon.types.map((t) => (
                                  <span
                                    key={t.type.name}
                                    className={`badge text-base-content ${
                                      typeColors[t.type.name]
                                    }`}
                                  >
                                    {t.type.name.toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="bg-base-300 rounded-lg mt-2 px-4 py-2">
                              <p className="font-semibold mb-2 text-base">
                                Base Stats
                              </p>
                              <div className="space-y-1">
                                {pokemon.stats.map((stat) => (
                                  <div
                                    key={stat.stat.name}
                                    className="flex items-center justify-between gap-2"
                                  >
                                    <p className="w-32 text-sm font-medium capitalize">
                                      {stat.stat.name}
                                    </p>
                                    <progress
                                      className="progress w-full"
                                      value={stat.base_stat}
                                      max="200"
                                    ></progress>
                                    <p className="w-10 text-sm text-right">
                                      {stat.base_stat}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-base-300 rounded-lg mt-2 px-4 py-2">
                              <p className="font-semibold mb-2 text-base">
                                Weaknesses
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {pokemonDetails[p.name].weaknesses.length >
                                0 ? (
                                  pokemonDetails[p.name].weaknesses.map(
                                    (type) => (
                                      <span
                                        key={type}
                                        className={`badge text-base-content ${
                                          typeColors[type] || "bg-gray-400"
                                        }`}
                                      >
                                        {type.toUpperCase()}
                                      </span>
                                    )
                                  )
                                ) : (
                                  <p className="text-sm text-gray-500 italic">
                                    Loading...
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => confirmRemove(p)}
                          className="btn bg-red-400 hover:bg-red-500 text-white border-none btn-sm mt-4 w-full"
                        >
                          Remove from Team
                        </button>
                      </div>
                    </dialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
