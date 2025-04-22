import { Navbar } from "../components/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export const History = () => {
  const [battles, setBattles] = useState([]);
  const [selectedBattle, setSelectedBattle] = useState(null); // For delete modal

  const fetchBattleHistory = async () => {
    try {
      const response = await axios.get("http://localhost:3001/battles");
      const sortedBattles = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setBattles(sortedBattles);
    } catch (error) {
      console.error("Error fetching battle history:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/battles/${id}`);
      setBattles((prev) => prev.filter((b) => b.id !== id));
      setSelectedBattle(null);
      // Show toast
      const toast = document.getElementById("toast-delete");
      if (toast) toast.classList.remove("hidden");
      setTimeout(() => toast?.classList.add("hidden"), 3000);
    } catch (error) {
      console.error("Error deleting battle:", error);
    }
  };

  useEffect(() => {
    fetchBattleHistory();
  }, []);

  const totalWins = battles.filter((b) => b.result.includes("You Win!")).length;
  const totalLosses = battles.filter((b) =>
    b.result.includes("You Lose!")
  ).length;
  const totalMatches = battles.length;

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-3xl font-bold my-10 text-center">Battle History</h2>

        <div className="mb-4 text-center">
          <p className="text-success">Total Matches: {totalMatches}</p>
          <p className="text-primary">Wins: {totalWins}</p>
          <p className="text-error">Losses: {totalLosses}</p>
        </div>

        {battles.length === 0 ? (
          <p>No battles recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {battles.map((battle) => (
              <div
                key={battle.id}
                className="bg-base-200 p-4 rounded-lg shadow border border-base-300 md:flex md:items-center md:justify-between lg:justify-around"
              >
                <div className="text-lg font-semibold w-56">
                  {battle.pokemon1} vs {battle.pokemon2}
                </div>
                <div className="text-sm text-base-content/70 w-48">
                  Result:{" "}
                  <span
                    className={`font-medium ${
                      battle.result.includes("You Win!")
                        ? "text-primary"
                        : "text-error"
                    }`}
                  >
                    {battle.result}
                  </span>
                </div>
                <div className="text-sm text-base-content/60">
                  Date: {dayjs(battle.date).format("MMM D, YYYY h:mm A")}
                </div>

                <div>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => setSelectedBattle(battle)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DaisyUI Modal for confirmation */}
      {selectedBattle && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete the battle between{" "}
              <strong>{selectedBattle.pokemon1}</strong> and{" "}
              <strong>{selectedBattle.pokemon2}</strong>?
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedBattle(null)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleDelete(selectedBattle.id)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* DaisyUI Toast */}
      <div id="toast-delete" className="toast toast-top toast-end hidden z-50">
        <div className="alert alert-error">
          <span>Battle record deleted successfully.</span>
        </div>
      </div>
    </>
  );
};
