import { Navbar } from "../components/Navbar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { PokemonCard } from "../components/PokemonCard";

export const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  // New states for filtering and sorting
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("id-asc"); // Default sort by ID ascending
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [detailedPokemonList, setDetailedPokemonList] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Fetch Pokémon types
  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/type")
      .then((res) => {
        // Filter out "unknown" and "shadow" types as they're not standard
        const standardTypes = res.data.results
          .filter(type => !["unknown", "shadow"].includes(type.name))
          .map(type => type.name);
        setPokemonTypes(standardTypes);
      })
      .catch((error) => {
        console.error("Error fetching Pokémon types:", error);
      });
  }, []);

  // Fetch basic Pokémon list
  useEffect(() => {
    setLoading(true);
    setLoadingProgress(0);
    
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=151`) 
      .then((res) => {
        setPokemonList(res.data.results);
        
        
        const processPokemonInBatches = async (pokemonArray) => {
          const batchSize = 10; // Process 10 Pokémon at a time
          const detailedData = [];
          let completedCount = 0;

          for (let i = 0; i < pokemonArray.length; i += batchSize) {
            const batch = pokemonArray.slice(i, i + batchSize);
            const batchPromises = batch.map(pokemon => 
              axios.get(pokemon.url)
                .then(response => ({
                  id: response.data.id,
                  name: response.data.name,
                  url: pokemon.url,
                  types: response.data.types.map(t => t.type.name),
                  sprite: response.data.sprites.front_default
                }))
                .catch(error => {
                  console.error(`Error fetching details for ${pokemon.name}:`, error);
                  return {
                    id: 9999, // High number to sort to end
                    name: pokemon.name,
                    url: pokemon.url,
                    types: [],
                    sprite: null
                  };
                })
            );

            // Wait for current batch to complete
            const batchResults = await Promise.all(batchPromises);
            detailedData.push(...batchResults);
            
            // Update progress
            completedCount += batchResults.length;
            setLoadingProgress(Math.floor((completedCount / pokemonArray.length) * 100));
          }

          return detailedData;
        };

        processPokemonInBatches(res.data.results)
          .then(detailedData => {
            // Sort by ID first to ensure consistent initial display
            const sortedData = detailedData.sort((a, b) => a.id - b.id);
            setDetailedPokemonList(sortedData);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching Pokemon data:", error);
        setLoading(false);
      });
  }, []);

  // Apply filtering and sorting when search, type, sort or page changes
  useEffect(() => {
    if (detailedPokemonList.length === 0) return;

    // Apply search filter
    let filteredPokemons = detailedPokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    // Apply type filter if selected
    if (selectedType) {
      filteredPokemons = filteredPokemons.filter((pokemon) =>
        pokemon.types.includes(selectedType)
      );
    }

    // Apply sorting
    const sortedPokemons = [...filteredPokemons].sort((a, b) => {
      switch (sortBy) {
        case "id-asc":
          return a.id - b.id;
        case "id-desc":
          return b.id - a.id;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return a.id - b.id;
      }
    });

    setTotalPages(Math.ceil(sortedPokemons.length / 12));

    // If current page exceeds new total pages, reset to page 1
    if (page > Math.ceil(sortedPokemons.length / 12) && sortedPokemons.length > 0) {
      setPage(1);
    }

    const startIndex = (page - 1) * 12;
    const newDisplayedPokemons = sortedPokemons.slice(startIndex, startIndex + 12);
    setDisplayedPokemons(newDisplayedPokemons);
  }, [search, selectedType, sortBy, page, detailedPokemonList]);

  const handlePagination = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setSearch("");
    setSelectedType("");
    setSortBy("id-asc");
    setPage(1);
  };

  // Function to load more Pokémon (for expanding beyond 151)
  const handleLoadMore = () => {
    // This would be implemented if needed to load beyond the first generation
  };

  return (
    <>
      <Navbar />
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-6 mb-4 text-center">Pokédex</h1>

        {/* Search and Filters Section */}
        <div className="w-full max-w-4xl mb-6 flex flex-col gap-4">
          {/* Search Bar */}
          <label className="input border-4 border-base-200 w-full bg-base-200">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="text"
              placeholder="Search Pokémon"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </label>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Filter by Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={loading}
              >
                <option value="">All Types</option>
                {pokemonTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Sort By</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                disabled={loading}
              >
                <option value="id-asc">Number (Low to High)</option>
                <option value="id-desc">Number (High to Low)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Reset Filters</span>
              </label>
              <button
                onClick={handleReset}
                className="btn bg-red-500 hover:bg-red-600 block text-white border-none"
                disabled={loading}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Tags */}
        {!loading && (
          <div className="flex flex-wrap gap-2 mb-4 w-full max-w-4xl">
            {search && (
              <div className="badge badge-outline gap-1 p-3">
                Search: {search}
                <button onClick={() => setSearch("")} className="ml-1">
                  ✕
                </button>
              </div>
            )}
            {selectedType && (
              <div className="badge badge-outline gap-1 p-3">
                Type: {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                <button onClick={() => setSelectedType("")} className="ml-1">
                  ✕
                </button>
              </div>
            )}
            {sortBy && (
              <div className="badge badge-outline gap-1 p-3">
                {sortBy === "id-asc" && "Sorted by: Number (Low to High)"}
                {sortBy === "id-desc" && "Sorted by: Number (High to Low)"}
                {sortBy === "name-asc" && "Sorted by: Name (A-Z)"}
                {sortBy === "name-desc" && "Sorted by: Name (Z-A)"}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-xl font-bold text-yellow-500 mb-2">
              Loading Pokémon... {loadingProgress}%
            </div>
            <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="relative w-16 h-16 mt-4">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-yellow-500 border-r-yellow-300 border-b-yellow-400 border-l-yellow-200 animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-300"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
        ) : displayedPokemons.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl font-medium">
              No Pokémon found with the current filters
            </p>
            <button
              onClick={handleReset}
              className="mt-4 btn bg-yellow-400 hover:bg-yellow-500 text-black border-none"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="w-full max-w-4xl mb-4 text-sm">
              Showing {((page - 1) * 12) + 1}-{Math.min(page * 12, (totalPages - 1) * 12 + displayedPokemons.length)} of {totalPages * 12 <= detailedPokemonList.length ? totalPages * 12 : detailedPokemonList.length} Pokémon
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-4 container">
              {displayedPokemons.map((pokemon, index) => (
                <PokemonCard key={`${pokemon.id}-${index}`} url={pokemon.url} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="join mt-6 mb-4">
              <button
                className="join-item btn bg-yellow-400 hover:bg-yellow-500 text-black border-none"
                onClick={() => handlePagination(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              <button className="join-item btn bg-gray-200 text-black pointer-events-none">
                Page {page} of {totalPages}
              </button>

              <button
                className="join-item btn bg-yellow-400 hover:bg-yellow-500 text-black border-none"
                onClick={() => handlePagination(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};