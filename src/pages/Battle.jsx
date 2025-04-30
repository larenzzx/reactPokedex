import { Navbar } from "../components/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import VS from "../assets/vs.png";
import Pokelogo from "../assets/logo.png";

const typeColors = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  normal: "bg-gray-400",
  fighting: "bg-orange-700",
  flying: "bg-indigo-300",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  rock: "bg-yellow-800",
  bug: "bg-lime-500",
  ghost: "bg-purple-700",
  steel: "bg-gray-500",
  psychic: "bg-pink-500",
  ice: "bg-blue-200",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800",
  fairy: "bg-pink-300",
};

// Type effectiveness chart - simplified for the major types
const typeEffectiveness = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2,
  },
  fairy: { fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export const Battle = () => {
  const [team, setTeam] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [poke1, setPoke1] = useState(null);
  const [poke2, setPoke2] = useState(null);
  const [battleResults, setBattleResults] = useState([]);
  const [overallWinner, setOverallWinner] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Damage battle state
  const [damageLog, setDamageLog] = useState([]);
  const [battleInProgress, setBattleInProgress] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [player1HP, setPlayer1HP] = useState(0);
  const [player2HP, setPlayer2HP] = useState(0);
  const [battleWinner, setBattleWinner] = useState("");
  const [battleMode, setBattleMode] = useState(""); // "auto" or "manual"
  const [battleEnded, setBattleEnded] = useState(false);
  // Define state for active tab
  const [activeTab, setActiveTab] = useState("stats");

  // Load saved tab preference on component mount
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab") || "stats";
    setActiveTab(savedTab);
  }, []);

  // Handler for tab changes
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem("activeTab", tabName);
  };

  // Load data on component mount
  useEffect(() => {
    // Check for saved battle data in localStorage
    const loadSavedState = () => {
      try {
        const savedBattle = localStorage.getItem("pokemonBattle");
        if (savedBattle) {
          const parsedData = JSON.parse(savedBattle);
          if (parsedData.poke1) setPoke1(parsedData.poke1);
          if (parsedData.poke2) setPoke2(parsedData.poke2);
          if (parsedData.battleResults)
            setBattleResults(parsedData.battleResults);
          if (parsedData.overallWinner)
            setOverallWinner(parsedData.overallWinner);

          // Load damage battle state
          if (parsedData.damageLog) setDamageLog(parsedData.damageLog);
          if (parsedData.player1HP !== undefined)
            setPlayer1HP(parsedData.player1HP);
          if (parsedData.player2HP !== undefined)
            setPlayer2HP(parsedData.player2HP);
          if (parsedData.battleWinner) setBattleWinner(parsedData.battleWinner);
          if (parsedData.battleMode) setBattleMode(parsedData.battleMode);
          if (parsedData.battleEnded !== undefined)
            setBattleEnded(parsedData.battleEnded);
        }
      } catch (error) {
        console.error("Error loading saved battle state:", error);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch team data
        const teamResponse = await axios.get("http://localhost:3001/team");
        setTeam(teamResponse.data);

        // Fetch all Pokemon data
        const pokemonResponse = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        const detailedData = await Promise.all(
          pokemonResponse.data.results.map((p) =>
            axios.get(p.url).then((r) => r.data)
          )
        );
        setAllPokemon(detailedData);

        // Load saved state after we have the Pokemon data
        loadSavedState();
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save battle state to localStorage whenever it changes
  useEffect(() => {
    if (poke1 || poke2 || battleResults.length > 0 || damageLog.length > 0) {
      const battleState = {
        poke1,
        poke2,
        battleResults,
        overallWinner,
        damageLog,
        player1HP,
        player2HP,
        battleWinner,
        battleMode,
        battleEnded,
      };
      localStorage.setItem("pokemonBattle", JSON.stringify(battleState));
    }
  }, [
    poke1,
    poke2,
    battleResults,
    overallWinner,
    damageLog,
    player1HP,
    player2HP,
    battleWinner,
    battleMode,
    battleEnded,
  ]);

  const selectPokemonFromDropdown = (name, setter) => {
    const selected = allPokemon.find((p) => p.name === name);
    setter(selected);
  };

  const pickRandomEnemy = () => {
    const randomPoke =
      allPokemon[Math.floor(Math.random() * allPokemon.length)];
    setPoke2(randomPoke);
  };

  const getStat = (pokemon, statName) =>
    pokemon?.stats.find((s) => s.stat.name === statName)?.base_stat || 0;

  const simulateBattle = async () => {
    if (!poke1 || !poke2) return;

    const rounds = ["hp", "attack", "speed"];
    let playerWins = 0;
    let enemyWins = 0;

    const results = rounds.map((stat, index) => {
      const playerStat = getStat(poke1, stat);
      const enemyStat = getStat(poke2, stat);
      let winner = "";

      if (playerStat > enemyStat) {
        winner = poke1.name;
        playerWins++;
      } else if (enemyStat > playerStat) {
        winner = poke2.name;
        enemyWins++;
      } else {
        winner = "Draw";
      }

      return {
        round: index + 1,
        stat: stat.toUpperCase(),
        player: { name: poke1.name, value: playerStat },
        enemy: { name: poke2.name, value: enemyStat },
        winner,
      };
    });

    let finalWinner = "";
    if (playerWins > enemyWins) {
      finalWinner = `${poke1.name}, You Win!`;
    } else if (enemyWins > playerWins) {
      finalWinner = `${poke2.name}, You Lose!`;
    } else {
      finalWinner = "It's a Draw!";
    }

    setBattleResults(results);
    setOverallWinner(finalWinner);

    // Save battle to db.json
    try {
      await axios.post("http://localhost:3001/battles", {
        pokemon1: poke1.name,
        pokemon2: poke2.name,
        result: finalWinner,
        date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving battle:", error);
    }
  };

  // Reset the battle state
  const resetBattle = () => {
    setPoke1(null);
    setPoke2(null);
    setBattleResults([]);
    setOverallWinner("");
    resetDamageBattle();
    localStorage.removeItem("pokemonBattle");
  };

  // Reset just the damage battle
  const resetDamageBattle = () => {
    setDamageLog([]);
    setBattleInProgress(false);
    setCurrentRound(0);
    setPlayer1HP(0);
    setPlayer2HP(0);
    setBattleWinner("");
    setBattleEnded(false);
  };

  const renderCard = (pokemon) => {
    if (!pokemon) return null;
    return (
      <div className="card bg-base-200 shadow-md p-2 w-72 font-pokemon">
        <figure
          className={`rounded-t-lg ${
            typeColors[pokemon.types[0].type.name] || "bg-gray-300"
          }`}
        >
          <img
            src={pokemon.sprites.other["dream_world"].front_default}
            className="w-48 cursor-pointer"
            alt={pokemon.name}
          />
        </figure>
        <div className="card-body bg-base-300 rounded-b-lg">
          <h2 className="card-title capitalize">{pokemon.name}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className={`badge text-text-base-content ${
                  typeColors[t.type.name] || "bg-gray-500"
                }`}
              >
                {t.type.name.toUpperCase()}
              </span>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {pokemon.stats
              .filter(
                (s) =>
                  s.stat.name === "hp" ||
                  s.stat.name === "attack" ||
                  s.stat.name === "speed"
              )
              .map((s) => {
                let badgeColor = "";
                if (s.stat.name === "hp") badgeColor = "badge-success";
                else if (s.stat.name === "attack") badgeColor = "badge-error";
                else if (s.stat.name === "speed") badgeColor = "badge-info";

                return (
                  <p
                    key={s.stat.name}
                    className={`badge badge-sm font-semibold ${badgeColor}`}
                  >
                    {s.stat.name.charAt(0).toUpperCase() + s.stat.name.slice(1)}
                    : <span className="font-medium">{s.base_stat}</span>
                  </p>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  // Calculate type effectiveness
  const calculateTypeEffectiveness = (attackingType, defendingTypes) => {
    let effectiveness = 1;

    // If the defending Pokémon has multiple types, multiply the effectiveness
    defendingTypes.forEach((defType) => {
      if (
        typeEffectiveness[attackingType] &&
        typeEffectiveness[attackingType][defType]
      ) {
        effectiveness *= typeEffectiveness[attackingType][defType];
      }
    });

    return effectiveness;
  };

  // Calculate damage
  const calculateDamage = (attacker, defender) => {
    // Get the attack and defense stats
    const attackStat = getStat(attacker, "attack");
    const defenseStat = getStat(defender, "defense");

    // Get the attacking Pokémon's first type
    const attackingType = attacker.types[0].type.name;

    // Get all defending types
    const defendingTypes = defender.types.map((t) => t.type.name);

    // Calculate type effectiveness
    const typeEffect = calculateTypeEffectiveness(
      attackingType,
      defendingTypes
    );

    // Add randomness (85-100% of full damage)
    const randomFactor = 0.85 + Math.random() * 0.15;

    // Basic damage formula: (Attack / Defense) * 10 * Type Effectiveness * Random Factor
    let damage = Math.floor(
      (attackStat / defenseStat) * 10 * typeEffect * randomFactor
    );

    // Ensure minimum damage of 1
    damage = Math.max(1, damage);

    return {
      damage,
      typeEffect,
    };
  };

  // Start battle with damage calculation
  const startDamageBattle = (mode = "auto") => {
    if (!poke1 || !poke2) return;

    resetDamageBattle();
    setBattleMode(mode);

    // Initialize HP
    const p1HP = getStat(poke1, "hp");
    const p2HP = getStat(poke2, "hp");

    setPlayer1HP(p1HP);
    setPlayer2HP(p2HP);

    setDamageLog([
      {
        round: 0,
        message: `Battle begins! ${poke1.name} (HP: ${p1HP}) vs ${poke2.name} (HP: ${p2HP})`,
        p1HP,
        p2HP,
      },
    ]);

    setBattleInProgress(true);
    setCurrentRound(1);
    setBattleEnded(false);

    // If auto mode, start the battle simulation
    if (mode === "auto") {
      setTimeout(() => {
        simulateDamageBattle(p1HP, p2HP, 1);
      }, 500); // Small delay for UX
    }
  };

  // Execute a single round of battle
  const executeRound = (p1CurrentHP, p2CurrentHP, round) => {
    if (!poke1 || !poke2) return { gameOver: true };

    // Determine who goes first based on speed
    const p1Speed = getStat(poke1, "speed");
    const p2Speed = getStat(poke2, "speed");

    let firstAttacker, secondAttacker, firstHP, secondHP;
    let newLogs = [];
    let updatedP1HP = p1CurrentHP;
    let updatedP2HP = p2CurrentHP;

    if (p1Speed >= p2Speed) {
      // Player 1 attacks first
      firstAttacker = poke1;
      secondAttacker = poke2;

      // Player 1 attack
      const result1 = calculateDamage(poke1, poke2);
      updatedP2HP = Math.max(0, p2CurrentHP - result1.damage);

      let effectivenessText1 = "";
      if (result1.typeEffect > 1) {
        effectivenessText1 = "It's super effective!";
      } else if (result1.typeEffect < 1 && result1.typeEffect > 0) {
        effectivenessText1 = "It's not very effective...";
      } else if (result1.typeEffect === 0) {
        effectivenessText1 = "It has no effect!";
      }

      newLogs.push({
        round,
        message: `${poke1.name} attacks ${poke2.name} for ${result1.damage} damage. ${effectivenessText1}`,
        p1HP: updatedP1HP,
        p2HP: updatedP2HP,
      });

      // Check if battle is over after first attack
      if (updatedP2HP <= 0) {
        // Set HP to exactly 0
        updatedP2HP = 0;
        setDamageLog((prevLogs) => [...prevLogs, ...newLogs]);
        return {
          gameOver: true,
          winner: poke1.name,
          p1HP: updatedP1HP,
          p2HP: 0, // Explicitly set to 0
        };
      }

      // Player 2 attacks
      const result2 = calculateDamage(poke2, poke1);
      updatedP1HP = Math.max(0, p1CurrentHP - result2.damage);

      let effectivenessText2 = "";
      if (result2.typeEffect > 1) {
        effectivenessText2 = "It's super effective!";
      } else if (result2.typeEffect < 1 && result2.typeEffect > 0) {
        effectivenessText2 = "It's not very effective...";
      } else if (result2.typeEffect === 0) {
        effectivenessText2 = "It has no effect!";
      }

      newLogs.push({
        round,
        message: `${poke2.name} attacks ${poke1.name} for ${result2.damage} damage. ${effectivenessText2}`,
        p1HP: updatedP1HP,
        p2HP: updatedP2HP,
      });
    } else {
      // Player 2 attacks first
      firstAttacker = poke2;
      secondAttacker = poke1;

      // Player 2 attack
      const result1 = calculateDamage(poke2, poke1);
      updatedP1HP = Math.max(0, p1CurrentHP - result1.damage);

      let effectivenessText1 = "";
      if (result1.typeEffect > 1) {
        effectivenessText1 = "It's super effective!";
      } else if (result1.typeEffect < 1 && result1.typeEffect > 0) {
        effectivenessText1 = "It's not very effective...";
      } else if (result1.typeEffect === 0) {
        effectivenessText1 = "It has no effect!";
      }

      newLogs.push({
        round,
        message: `${poke2.name} attacks ${poke1.name} for ${result1.damage} damage. ${effectivenessText1}`,
        p1HP: updatedP1HP,
        p2HP: updatedP2HP,
      });

      // Check if battle is over after first attack
      if (updatedP1HP <= 0) {
        // Set HP to exactly 0
        updatedP1HP = 0;
        setDamageLog((prevLogs) => [...prevLogs, ...newLogs]);
        return {
          gameOver: true,
          winner: poke2.name,
          p1HP: 0, // Explicitly set to 0
          p2HP: updatedP2HP,
        };
      }

      // Player 1 attacks
      const result2 = calculateDamage(poke1, poke2);
      updatedP2HP = Math.max(0, p2CurrentHP - result2.damage);

      let effectivenessText2 = "";
      if (result2.typeEffect > 1) {
        effectivenessText2 = "It's super effective!";
      } else if (result2.typeEffect < 1 && result2.typeEffect > 0) {
        effectivenessText2 = "It's not very effective...";
      } else if (result2.typeEffect === 0) {
        effectivenessText2 = "It has no effect!";
      }

      newLogs.push({
        round,
        message: `${poke1.name} attacks ${poke2.name} for ${result2.damage} damage. ${effectivenessText2}`,
        p1HP: updatedP1HP,
        p2HP: updatedP2HP,
      });
    }

    // Update battle log
    setDamageLog((prevLogs) => [...prevLogs, ...newLogs]);

    // Update HP state
    setPlayer1HP(updatedP1HP);
    setPlayer2HP(updatedP2HP);

    // Check if battle is over
    if (updatedP1HP <= 0) {
      return {
        gameOver: true,
        winner: poke2.name,
        p1HP: 0, // Explicitly set to 0
        p2HP: updatedP2HP,
      };
    } else if (updatedP2HP <= 0) {
      return {
        gameOver: true,
        winner: poke1.name,
        p1HP: updatedP1HP,
        p2HP: 0, // Explicitly set to 0
      };
    }

    return {
      gameOver: false,
      p1HP: updatedP1HP,
      p2HP: updatedP2HP,
    };
  };

  // Execute next round manually
  const executeNextRound = () => {
    if (!battleInProgress || battleEnded) return;

    const result = executeRound(player1HP, player2HP, currentRound);

    if (!result.gameOver) {
      setCurrentRound((prevRound) => prevRound + 1);
      // Update HP values from the round result
      setPlayer1HP(result.p1HP);
      setPlayer2HP(result.p2HP);
    } else {
      // Battle finished - ensure loser's HP is 0
      setPlayer1HP(result.p1HP);
      setPlayer2HP(result.p2HP);

      const winner =
        result.winner === poke1?.name
          ? `${poke1.name}, You Win!`
          : `${poke2.name}, You Lose!`;

      setBattleWinner(winner);
      setBattleEnded(true);
      setBattleInProgress(false);

      // Add final message with accurate HP values
      setDamageLog((prevLogs) => [
        ...prevLogs,
        {
          round: currentRound + 1,
          message: `Battle ended! ${winner}`,
          p1HP: result.p1HP,
          p2HP: result.p2HP,
        },
      ]);

      // Save battle to db.json
      try {
        axios
          .post("http://localhost:3001/battles", {
            pokemon1: poke1.name,
            pokemon2: poke2.name,
            result: winner,
            date: new Date().toISOString(),
            battleType: "damage",
          })
          .catch((error) => console.error("Error saving battle:", error));
      } catch (error) {
        console.error("Error saving battle:", error);
      }
    }
  };

  // Simulate complete battle automatically
  const simulateDamageBattle = (p1CurrentHP, p2CurrentHP, round) => {
    if (!poke1 || !poke2) return;

    let currentP1HP = p1CurrentHP;
    let currentP2HP = p2CurrentHP;
    let currentRound = round;
    let gameOver = false;
    let finalWinner = "";
    let allResults = [];

    // Maximum of 20 rounds to prevent infinite loops
    const simulateRounds = () => {
      if (gameOver || currentRound > 20) {
        if (gameOver) {
          // Ensure loser's HP is exactly 0
          if (finalWinner === poke1?.name) {
            currentP2HP = 0;
          } else {
            currentP1HP = 0;
          }

          // Update HP values in state
          setPlayer1HP(currentP1HP);
          setPlayer2HP(currentP2HP);

          const winner =
            finalWinner === poke1?.name
              ? `${poke1.name}, You Win!`
              : `${poke2.name}, You Lose!`;

          // Add final message with correct HP values
          setDamageLog((prevLogs) => [
            ...prevLogs,
            {
              round: currentRound,
              message: `Battle ended! ${winner}`,
              p1HP: currentP1HP,
              p2HP: currentP2HP,
            },
          ]);

          setBattleWinner(winner);
          setBattleEnded(true);
          setBattleInProgress(false);

          // Save battle to db.json
          try {
            axios
              .post("http://localhost:3001/battles", {
                pokemon1: poke1.name,
                pokemon2: poke2.name,
                result: winner,
                date: new Date().toISOString(),
                battleType: "damage",
              })
              .catch((error) => console.error("Error saving battle:", error));
          } catch (error) {
            console.error("Error saving battle:", error);
          }
        }
        return;
      }

      // Execute a round
      const result = executeRound(currentP1HP, currentP2HP, currentRound);

      // Update state
      currentP1HP = result.p1HP;
      currentP2HP = result.p2HP;
      gameOver = result.gameOver;

      if (gameOver) {
        finalWinner = result.winner;
      }

      currentRound++;

      // Continue with next round after a delay
      setTimeout(simulateRounds, 1000);
    };

    // Start the simulation
    simulateRounds();
  };

  // Calculate HP percentage for health bars
  const calculateHPPercentage = (currentHP, pokemon) => {
    if (!pokemon) return 0;
    const maxHP = getStat(pokemon, "hp");
    return Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
  };

  // Get appropriate color for health bar
  const getHealthBarColor = (percentage) => {
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-bounce text-xl font-bold text-primary">
          Loading Battle...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto lg:px-16">
        <h2 className="text-3xl font-bold mt-6 mb-2 text-center">
          Battle Simulation
        </h2>

        {/* name of each tab group should be unique */}
        <div className="tabs tabs-lift">
          <input
            type="radio"
            name="my_tabs_3"
            className="tab"
            aria-label="Stats Based"
            checked={activeTab === "stats"}
            onChange={() => handleTabChange("stats")}
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="grid lg:grid-cols-3 place-items-center gap-2">
              {/* Your Team */}
              <div className="space-y-2 text-center">
                <h1 className="text-bold text-xl">Your Team</h1>
                {!poke1 && (
                  <img src={Pokelogo} className="w-72" alt="Pokemon Logo" />
                )}
                {renderCard(poke1)}
                <select
                  className="select select-bordered border-2 border-primary"
                  onChange={(e) =>
                    selectPokemonFromDropdown(e.target.value, setPoke1)
                  }
                  value={poke1?.name || ""}
                >
                  <option value="">Select Your Pokémon</option>
                  {team.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* VS */}
              <div className="flex flex-col gap-4">
                <img
                  src={VS}
                  alt="vs logo"
                  className="w-52 md:w-64 lg:w-full my-6"
                />
                {/* Action Buttons */}
                <div className="justify-center gap-4 mt-6 hidden lg:flex">
                  <button
                    onClick={simulateBattle}
                    disabled={!poke1 || !poke2}
                    className={`btn btn-lg text-black border-none ${
                      !poke1 || !poke2
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-yellow-400 hover:bg-yellow-500"
                    }`}
                  >
                    Fight
                  </button>

                  {(poke1 || poke2 || battleResults.length > 0) && (
                    <button
                      onClick={resetBattle}
                      className="btn bg-red-500 hover:bg-red-600 text-white btn-lg border-none"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Enemy Team */}
              <div className="space-y-2 text-center">
                <h1 className="text-bold text-xl">Enemy Team</h1>
                {!poke2 && (
                  <img src={Pokelogo} className="w-72" alt="Pokemon Logo" />
                )}
                {renderCard(poke2)}
                <div className="flex items-center gap-2 justify-center">
                  <select
                    className="select select-bordered border-2 border-yellow-200"
                    onChange={(e) =>
                      selectPokemonFromDropdown(e.target.value, setPoke2)
                    }
                    value={poke2?.name || ""}
                  >
                    <option value="">Select Enemy Pokémon</option>
                    {allPokemon.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={pickRandomEnemy}
                    className="btn bg-yellow-400 hover:bg-yellow-500 text-black border-none"
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6 mb-4 lg:hidden">
              <button
                onClick={simulateBattle}
                disabled={!poke1 || !poke2}
                className={`btn btn-lg text-black border-none ${
                  !poke1 || !poke2
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }`}
              >
                Fight
              </button>

              {(poke1 || poke2 || battleResults.length > 0) && (
                <button
                  onClick={resetBattle}
                  className="btn bg-red-500 hover:bg-red-600 text-white btn-lg border-none"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Battle Logs */}
            {battleResults.length > 0 && (
              <div className="overflow-x-auto mt-6 rounded-lg shadow-md mb-4">
                <table className="table table-zebra w-full">
                  <thead className="bg-primary">
                    <tr className="text-black">
                      <th>Round</th>
                      <th>Stat</th>
                      <th>Your Pokémon</th>
                      <th>Enemy Pokémon</th>
                      <th>Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {battleResults.map((round) => (
                      <tr key={round.round}>
                        <th>{round.round}</th>
                        <td>{round.stat}</td>
                        <td className="capitalize">
                          {round.player.name} ({round.player.value})
                        </td>
                        <td className="capitalize">
                          {round.enemy.name} ({round.enemy.value})
                        </td>
                        <td
                          className={`capitalize ${
                            round.winner === poke1?.name
                              ? "text-green-600 font-bold"
                              : round.winner === poke2?.name
                                ? "text-red-600 font-bold"
                                : "text-gray-500"
                          }`}
                        >
                          {round.winner}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-lg p-2 font-medium text-center bg-base-300">
                  Winner:{" "}
                  <span className="capitalize font-bold">{overallWinner}</span>
                </div>
              </div>
            )}
          </div>

          <input
            type="radio"
            name="my_tabs_3"
            className="tab"
            aria-label="Damage Based"
            checked={activeTab === "damage"}
            onChange={() => handleTabChange("damage")}
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="grid lg:grid-cols-3 place-items-center gap-2">
              {/* Your Team */}
              <div className="space-y-2 text-center">
                <h1 className="text-bold text-xl">Your Team</h1>
                {!poke1 && (
                  <img src={Pokelogo} className="w-72" alt="Pokemon Logo" />
                )}
                {renderCard(poke1)}
                <select
                  className="select select-bordered border-2 border-primary"
                  onChange={(e) =>
                    selectPokemonFromDropdown(e.target.value, setPoke1)
                  }
                  value={poke1?.name || ""}
                >
                  <option value="">Select Your Pokémon</option>
                  {team.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {/* HP Bar for Player 1 */}
                {battleInProgress && poke1 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold">
                        HP: {player1HP}/{getStat(poke1, "hp")}
                      </span>
                      <span>
                        {Math.floor(calculateHPPercentage(player1HP, poke1))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-4">
                      <div
                        className={`${getHealthBarColor(calculateHPPercentage(player1HP, poke1))} h-4 rounded-full transition-all duration-500`}
                        style={{
                          width: `${calculateHPPercentage(player1HP, poke1)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* VS */}
              <div className="flex flex-col gap-4">
                <img
                  src={VS}
                  alt="vs logo"
                  className="w-52 md:w-64 lg:w-full my-6"
                />
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 items-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => startDamageBattle("auto")}
                      disabled={!poke1 || !poke2 || battleInProgress}
                      className={`btn btn-sm lg:btn-md text-black border-none ${
                        !poke1 || !poke2 || battleInProgress
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-yellow-400 hover:bg-yellow-500"
                      }`}
                    >
                      Auto Battle
                    </button>
                    <button
                      onClick={() => startDamageBattle("manual")}
                      disabled={!poke1 || !poke2 || battleInProgress}
                      className={`btn btn-sm lg:btn-md text-black border-none ${
                        !poke1 || !poke2 || battleInProgress
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-blue-400 hover:bg-blue-500"
                      }`}
                    >
                      Turn by Turn
                    </button>
                  </div>

                  {battleMode === "manual" && battleInProgress && (
                    <button
                      onClick={executeNextRound}
                      className="btn bg-green-500 hover:bg-green-600 text-white border-none mt-2"
                    >
                      Next Turn
                    </button>
                  )}

                  {(battleInProgress || damageLog.length > 0) && (
                    <button
                      onClick={resetDamageBattle}
                      className="btn btn-sm lg:btn-md bg-red-500 hover:bg-red-600 text-white border-none mt-2"
                    >
                      Reset Battle
                    </button>
                  )}
                </div>
              </div>

              {/* Enemy Team */}
              <div className="space-y-2 text-center">
                <h1 className="text-bold text-xl">Enemy Team</h1>
                {!poke2 && (
                  <img src={Pokelogo} className="w-72" alt="Pokemon Logo" />
                )}
                {renderCard(poke2)}
                <div className="flex items-center gap-2 justify-center">
                  <select
                    className="select select-bordered border-2 border-yellow-200"
                    onChange={(e) =>
                      selectPokemonFromDropdown(e.target.value, setPoke2)
                    }
                    value={poke2?.name || ""}
                  >
                    <option value="">Select Enemy Pokémon</option>
                    {allPokemon.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={pickRandomEnemy}
                    className="btn bg-yellow-400 hover:bg-yellow-500 text-black border-none"
                  >
                    Random
                  </button>
                </div>

                {/* HP Bar for Player 2 */}
                {battleInProgress && poke2 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold">
                        HP: {player2HP}/{getStat(poke2, "hp")}
                      </span>
                      <span>
                        {Math.floor(calculateHPPercentage(player2HP, poke2))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-4">
                      <div
                        className={`${getHealthBarColor(calculateHPPercentage(player2HP, poke2))} h-4 rounded-full transition-all duration-500`}
                        style={{
                          width: `${calculateHPPercentage(player2HP, poke2)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Battle Explanation */}
            {!battleInProgress && damageLog.length === 0 && (
              <div className="mt-8 p-4 bg-base-200 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  How Damage-Based Battles Work
                </h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    The Pokémon with higher{" "}
                    <span className="text-blue-500 font-bold">Speed</span>{" "}
                    attacks first each turn
                  </li>
                  <li>
                    Damage is calculated based on{" "}
                    <span className="text-red-500 font-bold">Attack</span> vs{" "}
                    <span className="text-purple-500 font-bold">Defense</span>
                  </li>
                  <li>
                    Type effectiveness applies (Super Effective, Not Very
                    Effective, etc.)
                  </li>
                  <li>Random variation adds unpredictability to each attack</li>
                  <li>Battle continues until one Pokémon's HP reaches zero</li>
                  <li>
                    Choose Auto Battle for quick results or Turn by Turn for
                    more control
                  </li>
                </ul>
              </div>
            )}

            {/* Battle Log */}
            {damageLog.length > 0 && (
              <div className="mt-6 rounded-lg shadow-md mb-4">
                <div className="bg-primary text-black font-bold p-2 rounded-t-lg flex justify-between items-center">
                  <span>Battle Log</span>
                  {battleWinner && (
                    <span className="capitalize">Winner: {battleWinner}</span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto p-2 bg-base-200">
                  {damageLog.map((log, index) => (
                    <div
                      key={index}
                      className="mb-2 p-2 bg-base-100 rounded shadow"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          {log.round > 0 ? `Turn ${log.round}` : "Battle Start"}
                        </span>
                      </div>
                      <p className="mt-1">{log.message}</p>
                    </div>
                  ))}
                </div>

                {/* Result Summary */}
                {battleWinner && (
                  <div className="p-4 bg-base-300 rounded-b-lg">
                    <div className="text-center text-xl font-bold">
                      Battle Result:{" "}
                      <span className="capitalize">{battleWinner}</span>
                    </div>
                    <div className="flex justify-center gap-8 mt-4">
                      <div>
                        <p className="font-bold capitalize">{poke1?.name}</p>
                        <p>
                          Remaining HP: {player1HP}/{getStat(poke1, "hp")}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold capitalize">{poke2?.name}</p>
                        <p>
                          Remaining HP: {player2HP}/{getStat(poke2, "hp")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
