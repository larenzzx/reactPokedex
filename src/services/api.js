// API service for Pokemon multiplayer battles

// Base URL for the json-server
const API_BASE_URL = "http://192.168.1.183";

// Pokemon API
const POKEMON_API_URL = "https://pokeapi.co/api/v2";

// Get all battles from history
export const getBattleHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/battles`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching battle history:", error);
    return [];
  }
};

// Get a specific multiplayer battle by ID
export const getMultiplayerBattle = async (battleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/multiBattle/${battleId}`);
    if (!response.ok) {
      throw new Error("Battle not found");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching battle:", error);
    throw error;
  }
};

// Create a new multiplayer battle
export const createMultiplayerBattle = async (battleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/multiBattle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(battleData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating battle:", error);
    throw error;
  }
};

// Update a multiplayer battle
export const updateMultiplayerBattle = async (battleId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/multiBattle/${battleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating battle:", error);
    throw error;
  }
};

// Save battle to history
export const saveBattleToHistory = async (battleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/battles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(battleData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error saving battle to history:", error);
    throw error;
  }
};

// Fetch Pokemon data from PokeAPI
export const fetchPokemonList = async (limit = 151) => {
  try {
    const response = await fetch(`${POKEMON_API_URL}/pokemon?limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching pokemon list:", error);
    throw error;
  }
};

// Fetch detailed Pokemon data
export const fetchPokemonDetails = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching pokemon details:", error);
    throw error;
  }
};
