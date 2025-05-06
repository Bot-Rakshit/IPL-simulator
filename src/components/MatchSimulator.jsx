import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

const MatchSimulator = ({ match, teams, onSubmitResult }) => {
  // Initialize state based on existing result or defaults
  const initialWinner = match.completed ? match.result?.winner : null;
  const initialMargin = match.completed ? match.result?.margin || 0 : 0;
  const initialBallsRemaining = match.completed
    ? match.result?.ballsRemaining || 0
    : 0;
  // Determine initial batting order (default to team1, adjust if result exists)
  let initialTeam1BattedFirst = true;
  if (match.completed && match.result) {
    if (match.result.type === "runs") {
      // Winner batted first
      initialTeam1BattedFirst = match.result.winner === match.team1.id;
    } else if (match.result.type === "wickets") {
      // Loser batted first
      initialTeam1BattedFirst = match.result.winner !== match.team1.id;
    }
    // Default to team1 if noResult or type mismatch
  }

  const [winner, setWinner] = useState(initialWinner);
  const [team1BattedFirst, setTeam1BattedFirst] = useState(
    initialTeam1BattedFirst
  );
  const [margin, setMargin] = useState(initialMargin);
  const [ballsRemaining, setBallsRemaining] = useState(initialBallsRemaining);
  const [error, setError] = useState("");

  const team1 = teams.find((team) => team.id === match.team1.id);
  const team2 = teams.find((team) => team.id === match.team2.id);

  // Recalculate derived state when dependencies change
  const firstBattingTeam = team1BattedFirst ? team1 : team2;
  const secondBattingTeam = team1BattedFirst ? team2 : team1;
  const winnerBattedFirst =
    winner &&
    ((winner === team1?.id && team1BattedFirst) ||
      (winner === team2?.id && !team1BattedFirst));

  // Reset margin/balls when winner or batting order changes, *unless* it's the initial load
  useEffect(() => {
    // Don't reset if the current state matches the initial state derived from props
    if (
      winner === initialWinner &&
      margin === initialMargin &&
      ballsRemaining === initialBallsRemaining &&
      team1BattedFirst === initialTeam1BattedFirst
    ) {
      return;
    }

    setMargin(0);
    setBallsRemaining(0);
    setError("");

    // Set default margins based on new selection
    if (winner) {
      const didWinnerBatFirstNow =
        (winner === team1?.id && team1BattedFirst) ||
        (winner === team2?.id && !team1BattedFirst);
      if (didWinnerBatFirstNow) {
        setMargin(20); // Default runs margin
      } else {
        setBallsRemaining(12); // Default balls remaining for chase
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, team1BattedFirst]); // Dependencies are winner and team1BattedFirst

  // Convert balls remaining to overs format (e.g., 12 balls -> 18.0 overs)
  const calculateOversFromBallsRemaining = (ballsLeft) => {
    if (ballsLeft >= 120) return 0.0;
    if (ballsLeft < 0) return 20.0;
    const ballsBowled = 120 - ballsLeft;
    const overs = Math.floor(ballsBowled / 6);
    const ballsInOver = ballsBowled % 6;
    return parseFloat(`${overs}.${ballsInOver}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!team1 || !team2) {
      setError("Team data is missing.");
      return;
    }

    let resultType = "noResult";
    let resultWinner = winner;
    let resultMargin = 0;
    let resultBallsRemaining = 0;
    let firstInningsScore = 0,
      firstInningsOvers = 0,
      secondInningsScore = 0,
      secondInningsOvers = 0;

    // Check if winner is defined before proceeding
    if (winner) {
      const winnerDidBatFirst =
        (winner === team1.id && team1BattedFirst) ||
        (winner === team2.id && !team1BattedFirst);

      if (winnerDidBatFirst) {
        // Win by runs
        const parsedMargin = parseInt(margin);
        if (isNaN(parsedMargin) || parsedMargin <= 0) {
          setError("Run margin must be a positive number");
          return;
        }
        resultType = "runs";
        resultMargin = parsedMargin;
        resultBallsRemaining = 0; // Not relevant for runs win
        // Infer scores/overs
        firstInningsScore = 160 + resultMargin; // Winner's score
        secondInningsScore = 160; // Loser's score (simplified)
        firstInningsOvers = 20.0;
        secondInningsOvers = 20.0;
      } else {
        // Win by wickets (chasing)
        const parsedBallsRemaining = parseInt(ballsRemaining);
        if (
          isNaN(parsedBallsRemaining) ||
          parsedBallsRemaining < 0 ||
          parsedBallsRemaining >= 120
        ) {
          setError("Balls remaining must be between 0 and 119");
          return;
        }
        resultType = "wickets";
        resultBallsRemaining = parsedBallsRemaining;
        resultMargin = 0; // Not relevant for wickets win based on NRR logic
        // Infer scores/overs
        firstInningsScore = 160; // Loser's score (simplified)
        secondInningsScore = 161; // Winner's score (simplified)
        firstInningsOvers = 20.0;
        secondInningsOvers =
          calculateOversFromBallsRemaining(resultBallsRemaining);
      }

      // Assign scores based on who batted first
      if (!team1BattedFirst) {
        // Team 2 batted first, swap inferred scores/overs
        [firstInningsScore, secondInningsScore] = [
          secondInningsScore,
          firstInningsScore,
        ];
        [firstInningsOvers, secondInningsOvers] = [
          secondInningsOvers,
          firstInningsOvers,
        ];
      }
    } else {
      // Handle No Result specifically
      resultType = "noResult";
      resultWinner = null;
      resultMargin = 0;
      resultBallsRemaining = 0;
      firstInningsScore = 0;
      firstInningsOvers = 0;
      secondInningsScore = 0;
      secondInningsOvers = 0;
    }

    const result = {
      type: resultType,
      winner: resultWinner,
      margin: resultMargin, // Runs margin (0 for wickets/NR)
      ballsRemaining: resultBallsRemaining, // Balls remaining for wickets win (0 for runs/NR)
      firstInningsScore: firstInningsScore,
      firstInningsOvers: firstInningsOvers,
      secondInningsScore: secondInningsScore,
      secondInningsOvers: secondInningsOvers,
    };

    onSubmitResult(match, result);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-r from-primary to-[#092D5D] px-3 sm:px-4 py-3">
        <h2 className="text-white font-semibold text-lg">Match Simulator</h2>
        <p className="text-white/70 text-xs">
          Match {match.matchNumber}: {team1?.short || "?"} vs{" "}
          {team2?.short || "?"}
        </p>
      </div>

      <div className="p-3 sm:p-4 text-sm sm:text-base">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-center text-sm">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Innings Order Toggle */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batting Order
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                disabled={!team1} // Disable if team data missing
                className={`py-3 sm:py-2 px-3 rounded-md flex items-center justify-center transition-all ${
                  team1BattedFirst
                    ? "bg-white shadow text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-200"
                } ${!team1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => setTeam1BattedFirst(true)}
              >
                {team1 && (
                  <div
                    className="w-3 h-5 sm:w-2 sm:h-4 mr-2 rounded-sm"
                    style={{ backgroundColor: team1.color }}
                  ></div>
                )}
                <span className="text-xs sm:text-sm">
                  {team1?.short || "?"} Batted First
                </span>
              </button>
              <button
                type="button"
                disabled={!team2} // Disable if team data missing
                className={`py-3 sm:py-2 px-3 rounded-md flex items-center justify-center transition-all ${
                  !team1BattedFirst
                    ? "bg-white shadow text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-200"
                } ${!team2 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => setTeam1BattedFirst(false)}
              >
                {team2 && (
                  <div
                    className="w-3 h-5 sm:w-2 sm:h-4 mr-2 rounded-sm"
                    style={{ backgroundColor: team2.color }}
                  ></div>
                )}
                <span className="text-xs sm:text-sm">
                  {team2?.short || "?"} Batted First
                </span>
              </button>
            </div>
          </div>

          {/* Winner Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Result
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Team 1 Win Button */}
              <button
                type="button"
                disabled={!team1}
                className={`py-3 sm:py-2 px-3 rounded-md text-sm flex items-center justify-center ${
                  winner === team1?.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${!team1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => setWinner(team1?.id)}
              >
                {team1 && (
                  <div
                    className="w-3 h-5 sm:w-2 sm:h-4 mr-2 rounded-sm"
                    style={{ backgroundColor: team1.color }}
                  ></div>
                )}
                <span className="text-xs sm:text-sm">
                  {team1?.short || "?"} Win
                </span>
              </button>

              {/* Team 2 Win Button */}
              <button
                type="button"
                disabled={!team2}
                className={`py-3 sm:py-2 px-3 rounded-md text-sm flex items-center justify-center ${
                  winner === team2?.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${!team2 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => setWinner(team2?.id)}
              >
                {team2 && (
                  <div
                    className="w-3 h-5 sm:w-2 sm:h-4 mr-2 rounded-sm"
                    style={{ backgroundColor: team2.color }}
                  ></div>
                )}
                <span className="text-xs sm:text-sm">
                  {team2?.short || "?"} Win
                </span>
              </button>

              {/* No Result Button */}
              <button
                type="button"
                className={`py-3 sm:py-2 px-3 rounded-md text-sm flex items-center justify-center ${
                  winner === null
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setWinner(null)}
              >
                <span className="text-xs sm:text-sm">No Result</span>
              </button>
            </div>
          </div>

          {/* Conditional Inputs for Margin / Balls Remaining */}
          {winner && winnerBattedFirst && (
            <div>
              <label
                htmlFor="margin"
                className="block text-sm font-medium text-gray-700"
              >
                Win Margin (Runs)
              </label>
              <input
                type="number"
                id="margin"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                min="1"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          )}

          {winner && !winnerBattedFirst && (
            <div>
              <label
                htmlFor="ballsRemaining"
                className="block text-sm font-medium text-gray-700"
              >
                Balls Remaining (When Target Reached)
              </label>
              <input
                type="number"
                id="ballsRemaining"
                value={ballsRemaining}
                onChange={(e) => setBallsRemaining(e.target.value)}
                min="0"
                max="119"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#0a3a7d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Submit Result
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default MatchSimulator;
