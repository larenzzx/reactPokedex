import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";

export const Multiplayer = () => {
  const [battleId, setBattleId] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [battleState, setBattleState] = useState("initial"); // initial, selecting, waiting, battle
  const [availablePokemon, setAvailablePokemon] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [opponentTeam, setOpponentTeam] = useState([]);
  const [battleData, setBattleData] = useState(null);
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [turnState, setTurnState] = useState("waiting"); // waiting, selecting, executing
  
  const location = useLocation();
  
  useEffect(() => {
    // Check if joining from a battle link
    const params = new URLSearchParams(location.search);
    const joinBattleId = params.get("battle");
    
    if (joinBattleId) {
      setBattleId(joinBattleId);
      setIsHost(false);
      joinBattle(joinBattleId);
    }
    
    // Fetch available pokemon
    fetchAvailablePokemon();
  }, [location]);
  
  useEffect(() => {
    if (battleId) {
      const interval = setInterval(() => {
        fetchBattleState();
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [battleId]);
  
  const fetchAvailablePokemon = async () => {
    try {
      // Fetch from PokeAPI (first 151 for simplicity)
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await response.json();
      
      // Fetch details for each pokemon
      const detailedPokemon = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          return detailResponse.json();
        })
      );
      
      setAvailablePokemon(detailedPokemon);
    } catch (error) {
      console.error("Error fetching pokemon:", error);
    }
  };
  
  const createBattle = async () => {
    const newBattleId = uuidv4();
    setBattleId(newBattleId);
    setIsHost(true);
    setBattleState("selecting");
    
    // Create battle in the db
    try {
      await fetch("http://localhost:3001/multiBattle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: newBattleId,
          host: {
            ready: false,
            team: [],
          },
          guest: {
            ready: false,
            team: [],
          },
          status: "waiting",
          currentTurn: "host",
          battleLog: [],
        }),
      });
    } catch (error) {
      console.error("Error creating battle:", error);
    }
  };
  
  const joinBattle = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/multiBattle/${id}`);
      
      if (!response.ok) {
        alert("Battle not found!");
        return;
      }
      
      setBattleState("selecting");
      // Continue with join logic
    } catch (error) {
      console.error("Error joining battle:", error);
    }
  };
  
  const fetchBattleState = async () => {
    if (!battleId) return;
    
    try {
      const response = await fetch(`http://localhost:3001/multiBattle/${battleId}`);
      if (!response.ok) return;
      
      const data = await response.json();
      setBattleData(data);
      
      // Update battle state based on data
      if (data.status === "in_progress") {
        setBattleState("battle");
        setBattleLog(data.battleLog || []);
        
        const playerRole = isHost ? "host" : "guest";
        const opponentRole = isHost ? "guest" : "host";
        
        if (!opponentTeam.length && data[opponentRole].team.length) {
          setOpponentTeam(data[opponentRole].team);
        }
        
        // Set current Pokemon
        if (data[playerRole].currentPokemon) {
          setCurrentPokemon(data[playerRole].currentPokemon);
        }
        
        if (data[opponentRole].currentPokemon) {
          setOpponentPokemon(data[opponentRole].currentPokemon);
        }
        
        // Set turn state
        if (data.currentTurn === playerRole) {
          setTurnState("selecting");
        } else {
          setTurnState("waiting");
        }
      } else if (data.status === "waiting") {
        const playerRole = isHost ? "host" : "guest";
        const opponentRole = isHost ? "guest" : "host";
        
        if (data[playerRole].ready && data[opponentRole].ready) {
          // Both players are ready, start the battle
          startBattle();
        } else if (data[playerRole].ready) {
          setBattleState("waiting");
        } else {
          setBattleState("selecting");
        }
      }
    } catch (error) {
      console.error("Error fetching battle state:", error);
    }
  };
  
  const selectPokemon = (pokemon) => {
    if (selectedTeam.length >= 3) return;
    
    // Add pokemon to team
    setSelectedTeam([...selectedTeam, pokemon]);
  };
  
  const removePokemon = (index) => {
    const newTeam = [...selectedTeam];
    newTeam.splice(index, 1);
    setSelectedTeam(newTeam);
  };
  
  const confirmTeam = async () => {
    if (selectedTeam.length < 1) {
      alert("You need at least 1 Pokemon!");
      return;
    }
    
    try {
      const playerRole = isHost ? "host" : "guest";
      
      // Update the battle with selected team
      await fetch(`http://localhost:3001/multiBattle/${battleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [playerRole]: {
            ready: true,
            team: selectedTeam.map(p => ({
              id: p.id,
              name: p.name,
              sprites: p.sprites,
              types: p.types,
              stats: p.stats,
              hp: p.stats.find(s => s.stat.name === "hp").base_stat,
              maxHp: p.stats.find(s => s.stat.name === "hp").base_stat,
              moves: p.moves.slice(0, 4).map(m => m.move.name)
            }))
          }
        }),
      });
      
      setBattleState("waiting");
    } catch (error) {
      console.error("Error confirming team:", error);
    }
  };
  
  const startBattle = async () => {
    try {
      // Update battle status to in_progress
      await fetch(`http://localhost:3001/multiBattle/${battleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "in_progress",
          host: {
            ...battleData.host,
            currentPokemon: battleData.host.team[0]
          },
          guest: {
            ...battleData.guest,
            currentPokemon: battleData.guest.team[0]
          },
          battleLog: ["Battle started!"]
        }),
      });
      
      setBattleState("battle");
    } catch (error) {
      console.error("Error starting battle:", error);
    }
  };
  
  const executeMove = async (moveName) => {
    if (turnState !== "selecting") return;
    
    try {
      const playerRole = isHost ? "host" : "guest";
      const opponentRole = isHost ? "guest" : "host";
      
      // Calculate damage (simplified)
      const attackStat = currentPokemon.stats.find(s => s.stat.name === "attack").base_stat;
      const damage = Math.floor(attackStat / 10) + Math.floor(Math.random() * 5);
      
      // Apply damage to opponent Pokemon
      const updatedOpponentPokemon = {
        ...battleData[opponentRole].currentPokemon,
        hp: Math.max(0, battleData[opponentRole].currentPokemon.hp - damage)
      };
      
      // Update opponent team with the damaged Pokemon
      const updatedOpponentTeam = battleData[opponentRole].team.map(p =>
        p.id === updatedOpponentPokemon.id ? updatedOpponentPokemon : p
      );
      
      // Check if Pokemon fainted
      const moveLog = `${currentPokemon.name} used ${moveName} for ${damage} damage!`;
      let faintLog = "";
      let nextOpponentPokemon = updatedOpponentPokemon;
      
      if (updatedOpponentPokemon.hp <= 0) {
        faintLog = `${updatedOpponentPokemon.name} fainted!`;
        
        // Find next available Pokemon
        const nextPokemon = updatedOpponentTeam.find(p => p.hp > 0);
        if (nextPokemon) {
          nextOpponentPokemon = nextPokemon;
        }
      }
      
      // Update battle state
      const newLogs = [...battleData.battleLog, moveLog];
      if (faintLog) newLogs.push(faintLog);
      
      await fetch(`http://localhost:3001/multiBattle/${battleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentTurn: opponentRole,
          [opponentRole]: {
            ...battleData[opponentRole],
            team: updatedOpponentTeam,
            currentPokemon: nextOpponentPokemon
          },
          battleLog: newLogs
        }),
      });
      
      setTurnState("waiting");
      
      // Check for battle end
      const allFainted = updatedOpponentTeam.every(p => p.hp <= 0);
      if (allFainted) {
        endBattle(playerRole);
      }
    } catch (error) {
      console.error("Error executing move:", error);
    }
  };
  
  const endBattle = async (winner) => {
    try {
      await fetch(`http://localhost:3001/multiBattle/${battleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
          winner: winner,
          battleLog: [...battleData.battleLog, `${winner === "host" ? "Host" : "Guest"} wins the battle!`]
        }),
      });
      
      // Also save to battle history
      await fetch("http://localhost:3001/battles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uuidv4(),
          date: new Date().toISOString(),
          winner: winner === (isHost ? "host" : "guest") ? "You" : "Opponent",
          playerTeam: selectedTeam.map(p => ({
            name: p.name,
            sprite: p.sprites.front_default
          })),
          opponentTeam: opponentTeam.map(p => ({
            name: p.name,
            sprite: p.sprites.front_default
          }))
        }),
      });
      
      setBattleState("ended");
    } catch (error) {
      console.error("Error ending battle:", error);
    }
  };
  
  const getBattleUrl = () => {
    return `http://192.168.1.183/multiplayer?battle=${battleId}`;
  };
  
  const renderPokemonSelector = () => {
    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Select Your Pokemon Team (Max 3)</h3>
        
        <div className="flex flex-wrap gap-4 mb-6">
          {selectedTeam.map((pokemon, index) => (
            <div key={`team-${pokemon.id}`} className="card card-compact w-64 bg-base-100 shadow-xl">
              <figure>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-32 h-32" />
              </figure>
              <div className="card-body">
                <h2 className="card-title capitalize">{pokemon.name}</h2>
                <div className="flex gap-1 mb-2">
                  {pokemon.types.map((t, i) => (
                    <span key={i} className="badge badge-primary capitalize">
                      {t.type.name}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  {pokemon.stats
                    .filter(s => s.stat.name === "hp" || s.stat.name === "attack" || s.stat.name === "speed")
                    .map((s, i) => {
                      let badgeColor = "";
                      if (s.stat.name === "hp") badgeColor = "badge-success";
                      else if (s.stat.name === "attack") badgeColor = "badge-error";
                      else if (s.stat.name === "speed") badgeColor = "badge-info";
                      
                      return (
                        <span key={i} className={`badge ${badgeColor} capitalize`}>
                          {s.stat.name}: {s.base_stat}
                        </span>
                      );
                    })}
                </div>
                <div className="card-actions justify-end mt-2">
                  <button 
                    className="btn btn-sm btn-error" 
                    onClick={() => removePokemon(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mb-6">
          <button 
            className="btn btn-primary" 
            onClick={confirmTeam}
            disabled={selectedTeam.length < 1}
          >
            Confirm Team
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availablePokemon.slice(0, 30).map(pokemon => (
            <div key={pokemon.id} className="card card-compact bg-base-100 shadow-xl">
              <figure>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-32 h-32" />
              </figure>
              <div className="card-body">
                <h2 className="card-title capitalize">{pokemon.name}</h2>
                <div className="flex gap-1 mb-2">
                  {pokemon.types.map((t, i) => (
                    <span key={i} className="badge badge-primary capitalize">
                      {t.type.name}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  {pokemon.stats
                    .filter(s => s.stat.name === "hp" || s.stat.name === "attack" || s.stat.name === "speed")
                    .map((s, i) => {
                      let badgeColor = "";
                      if (s.stat.name === "hp") badgeColor = "badge-success";
                      else if (s.stat.name === "attack") badgeColor = "badge-error";
                      else if (s.stat.name === "speed") badgeColor = "badge-info";
                      
                      return (
                        <span key={i} className={`badge ${badgeColor} capitalize`}>
                          {s.stat.name}: {s.base_stat}
                        </span>
                      );
                    })}
                </div>
                <div className="card-actions justify-end mt-2">
                  <button 
                    className="btn btn-sm btn-primary" 
                    onClick={() => selectPokemon(pokemon)}
                    disabled={selectedTeam.length >= 3}
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderBattleInvite = () => {
    const battleUrl = getBattleUrl();
    
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <h3 className="text-xl font-bold mb-4">Waiting for opponent...</h3>
        
        <div className="card bg-base-100 shadow-xl p-6">
          <div className="mb-4">
            <QRCode value={battleUrl} size={200} />
          </div>
          
          <p className="mb-4">Share this link to invite an opponent:</p>
          
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              className="input input-bordered w-full" 
              value={battleUrl}
              readOnly
            />
            <button 
              className="btn btn-primary"
              onClick={() => navigator.clipboard.writeText(battleUrl)}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderBattleField = () => {
    if (!currentPokemon || !opponentPokemon) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Battle</h3>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              {/* Your current Pokemon */}
              <div className="card bg-base-200 shadow-md p-4 mb-4 md:mb-0">
                <div className="text-center capitalize font-bold mb-2">{currentPokemon.name}</div>
                <div className="flex justify-center">
                  <img src={currentPokemon.sprites.back_default} alt={currentPokemon.name} className="w-32 h-32" />
                </div>
                <progress 
                  className="progress progress-success w-full" 
                  value={currentPokemon.hp} 
                  max={currentPokemon.maxHp}
                ></progress>
                <div className="text-center">{currentPokemon.hp}/{currentPokemon.maxHp} HP</div>
              </div>
              
              <div className="text-2xl font-bold mb-4 md:mb-0">VS</div>
              
              {/* Opponent's current Pokemon */}
              <div className="card bg-base-200 shadow-md p-4">
                <div className="text-center capitalize font-bold mb-2">{opponentPokemon.name}</div>
                <div className="flex justify-center">
                  <img src={opponentPokemon.sprites.front_default} alt={opponentPokemon.name} className="w-32 h-32" />
                </div>
                <progress 
                  className="progress progress-error w-full" 
                  value={opponentPokemon.hp} 
                  max={opponentPokemon.maxHp}
                ></progress>
                <div className="text-center">{opponentPokemon.hp}/{opponentPokemon.maxHp} HP</div>
              </div>
            </div>
            
            {/* Battle log */}
            <div className="mb-6">
              <h4 className="font-bold mb-2">Battle Log</h4>
              <div className="bg-base-200 p-4 h-40 overflow-y-auto">
                {battleLog.map((log, i) => (
                  <p key={i} className="mb-1">{log}</p>
                ))}
              </div>
            </div>
            
            {/* Move selection */}
            {turnState === "selecting" ? (
              <div>
                <h4 className="font-bold mb-2">Select Move</h4>
                <div className="grid grid-cols-2 gap-2">
                  {currentPokemon.moves.slice(0, 4).map((move, i) => (
                    <button 
                      key={i} 
                      className="btn btn-primary capitalize"
                      onClick={() => executeMove(move)}
                    >
                      {move.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-xl">Waiting for opponent's move...</div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
    if (battleState === "initial") {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="card bg-base-100 shadow-xl w-full max-w-md">
            <div className="card-body">
              <h2 className="card-title text-2xl">Pokemon Multiplayer Battle</h2>
              <p className="mb-4">Challenge a friend to a Pokemon battle!</p>
              <div className="flex flex-col gap-4">
                <button 
                  className="btn btn-primary"
                  onClick={createBattle}
                >
                  Create Battle
                </button>
                <Link to="/battle" className="btn btn-outline">
                  Back to Battle Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (battleState === "selecting") {
      return renderPokemonSelector();
    } else if (battleState === "waiting") {
      return renderBattleInvite();
    } else if (battleState === "battle") {
      return renderBattleField();
    } else if (battleState === "ended") {
      const youWon = battleData?.winner === (isHost ? "host" : "guest");
      
      return (
        <div className="flex justify-center items-center mt-10">
          <div className="card bg-base-100 shadow-xl w-full max-w-md">
            <div className="card-body">
              <h2 className="card-title text-2xl">Battle Ended</h2>
              <p className="text-xl mb-4">
                {youWon ? "You won the battle!" : "You lost the battle!"}
              </p>
              <div className="flex flex-col gap-4">
                <Link to="/history" className="btn btn-primary">
                  View Battle History
                </Link>
                <Link to="/multiplayer" className="btn btn-outline">
                  New Battle
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto lg:px-16 pb-10">
        <h2 className="text-3xl font-bold mt-6 mb-2 text-center">
          Multiplayer Battle
        </h2>
        
        {renderContent()}
      </div>
    </>
  );
};