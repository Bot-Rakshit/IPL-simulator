import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import PointsTable from "./components/PointsTable";
import FixturesList from "./components/FixturesList";
import ConfirmDialog from "./components/ConfirmDialog";
import SimulateRemainingDialog from "./components/SimulateRemainingDialog";
import { randomizeAllFixtures } from "./utils/randomizer";
import { initialTeams, initialFixtures } from "./data/initialData";
import {
  FiZap,
  FiChevronDown,
  FiRefreshCw,
  FiAward,
  FiList,
  FiTable,
} from "react-icons/fi";

// Helper function to convert overs (like 19.5) to balls (119)
const oversToBalls = (overs) => {
  if (overs === undefined || overs === null) return 0;
  const fullOvers = Math.floor(overs);
  // Handle potential floating point inaccuracies with rounding
  const remainingBalls = Math.round((overs - fullOvers) * 10);
  return fullOvers * 6 + remainingBalls;
};

// Function to create a deep copy of initial data
const getInitialData = () => ({
  teams: JSON.parse(JSON.stringify(initialTeams)),
  fixtures: JSON.parse(JSON.stringify(initialFixtures)),
});

function App() {
  const navigate = useNavigate();
  // Initialize state from a fresh copy of initial data
  const [teams, setTeams] = useState(getInitialData().teams);
  const [fixtures, setFixtures] = useState(getInitialData().fixtures);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogDismissed, setConfirmDialogDismissed] = useState(false);
  const [showSimulateOptions, setShowSimulateOptions] = useState(false);
  const [showSimulateRemainingDialog, setShowSimulateRemainingDialog] =
    useState(false);
  const [activeTab, setActiveTab] = useState("fixtures"); // 'fixtures' or 'table'
  const simulateOptionsRef = useRef(null);

  // Close the simulate options dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        simulateOptionsRef.current &&
        !simulateOptionsRef.current.contains(event.target)
      ) {
        setShowSimulateOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if all matches are completed AFTER state updates from simulation/edit
  // This replaces the previous useEffect for showing the dialog
  const checkCompletionAndPrompt = (updatedFixtures) => {
    const allCompleted = updatedFixtures.every((fixture) => fixture.completed);
    if (allCompleted && updatedFixtures.length > 0 && !confirmDialogDismissed) {
      setShowConfirmDialog(true); // Show the dialog asking to view results
    }
    // Reset dismissed state if matches are no longer all completed
    if (!allCompleted) {
      setConfirmDialogDismissed(false);
    }
  };

  const updateMatchResult = (match, result) => {
    let updatedFixtures = fixtures;
    let updatedTeams = teams;

    // Find the match and update its result
    updatedFixtures = fixtures.map((fixture) => {
      if (fixture.id === match.id) {
        return {
          ...fixture,
          completed: true,
          result: result,
        };
      }
      return fixture;
    });

    // --- Calculate Team Stats Update ---
    // Use a temporary copy to calculate changes based on *this* result
    let tempUpdatedTeams = JSON.parse(JSON.stringify(teams)); // Deep copy

    const team1Index = tempUpdatedTeams.findIndex(
      (team) => team.id === match.team1.id
    );
    const team2Index = tempUpdatedTeams.findIndex(
      (team) => team.id === match.team2.id
    );

    if (team1Index === -1 || team2Index === -1) {
      console.error("Could not find one or both teams for the match:", match);
      return;
    }

    const team1 = tempUpdatedTeams[team1Index];
    const team2 = tempUpdatedTeams[team2Index];

    // Check if stats for this match were already counted (e.g., editing an already completed match)
    const originalFixture = fixtures.find((f) => f.id === match.id);
    let needsStatUpdate = true;
    if (originalFixture && originalFixture.completed) {
      console.log(
        "Match already completed, recalculating stats based on new result..."
      );
      // If editing, we need to revert the *previous* result's impact first.
      // This is complex. A simpler approach for now is to fully recalculate stats
      // based on *all* completed fixtures whenever a result is updated.
      // Let's recalculate based on all fixtures for simplicity and accuracy.
      needsStatUpdate = false; // We will trigger a full recalc below
    }

    if (needsStatUpdate) {
      team1.matches += 1;
      team2.matches += 1;

      if (result.type === "noResult") {
        team1.points += 1;
        team2.points += 1;
        team1.nr += 1;
        team2.nr += 1;
      } else {
        const winningTeamIndex =
          result.winner === match.team1.id ? team1Index : team2Index;
        const losingTeamIndex =
          result.winner === match.team1.id ? team2Index : team1Index;

        tempUpdatedTeams[winningTeamIndex].won += 1;
        tempUpdatedTeams[winningTeamIndex].points += 2;
        tempUpdatedTeams[losingTeamIndex].lost += 1;

        const {
          firstInningsScore,
          firstInningsOvers,
          secondInningsScore,
          secondInningsOvers,
        } = result;
        const firstInningsBalls = oversToBalls(firstInningsOvers);
        const secondInningsBalls = oversToBalls(secondInningsOvers);
        let team1Scored, team1Balls, team2Scored, team2Balls;

        if (result.type === "runs") {
          if (result.winner === match.team1.id) {
            team1Scored = firstInningsScore;
            team1Balls = firstInningsBalls;
            team2Scored = secondInningsScore;
            team2Balls = secondInningsBalls;
          } else {
            team2Scored = firstInningsScore;
            team2Balls = firstInningsBalls;
            team1Scored = secondInningsScore;
            team1Balls = secondInningsBalls;
          }
        } else {
          // wickets
          if (result.winner === match.team1.id) {
            team2Scored = firstInningsScore;
            team2Balls = firstInningsBalls;
            team1Scored = secondInningsScore;
            team1Balls = secondInningsBalls;
          } else {
            team1Scored = firstInningsScore;
            team1Balls = firstInningsBalls;
            team2Scored = secondInningsScore;
            team2Balls = secondInningsBalls;
          }
        }
        team1.totalRunsScored += team1Scored;
        team1.totalBallsFaced += team1Balls;
        team1.totalRunsConceded += team2Scored;
        team1.totalBallsBowled += team2Balls;
        team2.totalRunsScored += team2Scored;
        team2.totalBallsFaced += team2Balls;
        team2.totalRunsConceded += team1Scored;
        team2.totalBallsBowled += team1Balls;
      }
      updatedTeams = tempUpdatedTeams; // Use the calculated single-match update
    } else {
      // If editing a completed match, recalculate all stats from scratch
      updatedTeams = recalculateAllTeamStats(updatedFixtures);
    }

    setTeams(updatedTeams);
    setFixtures(updatedFixtures);
    setSelectedMatch(null); // Close simulator
    setConfirmDialogDismissed(false); // Allow confirmation dialog to show if needed

    // Check completion status after state updates
    checkCompletionAndPrompt(updatedFixtures);
  };

  // --- Helper Function to Recalculate All Stats ---
  const recalculateAllTeamStats = (currentFixtures) => {
    let freshTeams = getInitialData().teams; // Start fresh

    currentFixtures.forEach((fixture) => {
      if (fixture.completed && fixture.result) {
        const result = fixture.result;
        const match = fixture;
        const team1Index = freshTeams.findIndex(
          (team) => team.id === match.team1.id
        );
        const team2Index = freshTeams.findIndex(
          (team) => team.id === match.team2.id
        );

        if (team1Index === -1 || team2Index === -1) return; // Skip if team missing

        const team1 = freshTeams[team1Index];
        const team2 = freshTeams[team2Index];

        team1.matches += 1;
        team2.matches += 1;

        if (result.type === "noResult") {
          team1.points += 1;
          team2.points += 1;
          team1.nr += 1;
          team2.nr += 1;
        } else {
          const winningTeamIndex =
            result.winner === match.team1.id ? team1Index : team2Index;
          const losingTeamIndex =
            result.winner === match.team1.id ? team2Index : team1Index;
          freshTeams[winningTeamIndex].won += 1;
          freshTeams[winningTeamIndex].points += 2;
          freshTeams[losingTeamIndex].lost += 1;

          const {
            firstInningsScore,
            firstInningsOvers,
            secondInningsScore,
            secondInningsOvers,
          } = result;
          const firstInningsBalls = oversToBalls(firstInningsOvers);
          const secondInningsBalls = oversToBalls(secondInningsOvers);
          let team1Scored, team1Balls, team2Scored, team2Balls;

          if (result.type === "runs") {
            if (result.winner === match.team1.id) {
              team1Scored = firstInningsScore;
              team1Balls = firstInningsBalls;
              team2Scored = secondInningsScore;
              team2Balls = secondInningsBalls;
            } else {
              team2Scored = firstInningsScore;
              team2Balls = firstInningsBalls;
              team1Scored = secondInningsScore;
              team1Balls = secondInningsBalls;
            }
          } else {
            // wickets
            if (result.winner === match.team1.id) {
              team2Scored = firstInningsScore;
              team2Balls = firstInningsBalls;
              team1Scored = secondInningsScore;
              team1Balls = secondInningsBalls;
            } else {
              team1Scored = firstInningsScore;
              team1Balls = firstInningsBalls;
              team2Scored = secondInningsScore;
              team2Balls = secondInningsBalls;
            }
          }
          team1.totalRunsScored += team1Scored;
          team1.totalBallsFaced += team1Balls;
          team1.totalRunsConceded += team2Scored;
          team1.totalBallsBowled += team2Balls;
          team2.totalRunsScored += team2Scored;
          team2.totalBallsFaced += team2Balls;
          team2.totalRunsConceded += team1Scored;
          team2.totalBallsBowled += team1Balls;
        }
      }
    });
    return freshTeams;
  };

  const resetSimulation = () => {
    console.log("Resetting simulation...");
    const initialData = getInitialData();
    setTeams(initialData.teams);
    setFixtures(initialData.fixtures);
    setSelectedMatch(null);
    setShowConfirmDialog(false);
    setConfirmDialogDismissed(false);
    setShowSimulateOptions(false);
    setShowSimulateRemainingDialog(false);
    setActiveTab("fixtures");
    localStorage.removeItem("rankedTeams");
  };

  const randomizeResults = (resetCompleted = false) => {
    let fixturesForRandomization = resetCompleted
      ? getInitialData().fixtures
      : fixtures;

    const randomizedFixtures = randomizeAllFixtures(
      fixturesForRandomization,
      teams
    );

    // Recalculate all stats from scratch after randomizing
    const updatedTeams = recalculateAllTeamStats(randomizedFixtures);

    // Update state first
    setTeams(updatedTeams);
    setFixtures(randomizedFixtures);
    setConfirmDialogDismissed(false);
    setShowSimulateOptions(false);
    setShowSimulateRemainingDialog(false);

    // Check completion status after state updates
    checkCompletionAndPrompt(randomizedFixtures);
  };

  const handleViewFinalResults = () => {
    const allCompleted = fixtures.every((fixture) => fixture.completed);
    if (allCompleted) {
      goToFinalResults();
    } else {
      // If not all completed, show the simulate remaining dialog
      setShowSimulateRemainingDialog(true);
    }
  };

  const handleSimulateRemainingAndViewResults = () => {
    setShowSimulateRemainingDialog(false); // Close dialog first
    randomizeResults(false); // Simulate remaining, will navigate if complete
  };

  const handleContinueEditing = () => {
    setShowSimulateRemainingDialog(false);
  };

  const handleConfirmResults = () => {
    setShowConfirmDialog(false);
    goToFinalResults();
  };

  const goToFinalResults = (currentTeams = teams) => {
    console.log("Calculating final rankings and navigating...");
    // Calculate final NRR and ranks based on the most current teams data
    const finalTeamsWithNRR = currentTeams.map((team) => {
      const scoredRate =
        team.totalBallsFaced > 0
          ? (team.totalRunsScored / team.totalBallsFaced) * 6
          : 0;
      const concededRate =
        team.totalBallsBowled > 0
          ? (team.totalRunsConceded / team.totalBallsBowled) * 6
          : 0;
      const calculatedNrr = parseFloat((scoredRate - concededRate).toFixed(3));
      return { ...team, nrr: isNaN(calculatedNrr) ? 0 : calculatedNrr }; // Ensure NRR is a number
    });
    const finalSortedTeams = [...finalTeamsWithNRR].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.nrr - a.nrr;
    });
    const finalRankedTeams = finalSortedTeams.map((team, index) => ({
      ...team,
      position: index + 1,
    }));

    localStorage.setItem("rankedTeams", JSON.stringify(finalRankedTeams));
    navigate("/final-results");
  };

  const handleCancelConfirmDialog = () => {
    setShowConfirmDialog(false);
    setConfirmDialogDismissed(true);
  };

  const selectMatch = (matchId) => {
    setSelectedMatch(matchId);
  };

  const closeMatchSimulator = () => {
    setSelectedMatch(null);
  };

  // Calculate NRR for display purposes
  const teamsWithCalculatedNRR = teams.map((team) => {
    const scoredRate =
      team.totalBallsFaced > 0
        ? (team.totalRunsScored / team.totalBallsFaced) * 6
        : 0;
    const concededRate =
      team.totalBallsBowled > 0
        ? (team.totalRunsConceded / team.totalBallsBowled) * 6
        : 0;
    const calculatedNrr = parseFloat((scoredRate - concededRate).toFixed(3));
    return { ...team, nrr: isNaN(calculatedNrr) ? 0 : calculatedNrr }; // Ensure NRR is a number
  });

  const sortedTeams = [...teamsWithCalculatedNRR].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // Use calculated NRR for tie-breaking
    return b.nrr - a.nrr;
  });

  const rankedTeams = sortedTeams.map((team, index) => ({
    ...team,
    position: index + 1,
  }));

  // Count remaining matches
  const remainingMatchesCount = fixtures.filter(
    (fixture) => !fixture.completed
  ).length;
  // No longer need allMatchesCompleted here as button is always visible

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        allCompleted={fixtures.every((fixture) => fixture.completed)} // Pass current status
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl min-h-[calc(100vh-80px)]">
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3">
          {/* View Final Results button - ALWAYS visible */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleViewFinalResults}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-[#0a3a7d] text-white font-medium rounded-lg shadow-md hover:shadow-lg order-1 sm:order-2"
          >
            <FiAward className="text-white" />
            <span>View Final Results</span>
          </motion.button>

          {/* Auto-Simulate buttons - Only show if NOT all matches are completed */}
          {remainingMatchesCount > 0 &&
            (fixtures.some((fixture) => fixture.completed) ? (
              // Split button if some are completed
              <div
                className="relative order-2 sm:order-1"
                ref={simulateOptionsRef}
              >
                <div className="flex">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => randomizeResults(false)}
                    className="flex items-center justify-center flex-1 sm:flex-initial gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-l-lg shadow-md hover:shadow-lg"
                  >
                    <FiZap className="text-white" />
                    <span>Simulate Remaining ({remainingMatchesCount})</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowSimulateOptions(!showSimulateOptions)}
                    className="px-2 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-lg border-l border-orange-400"
                  >
                    <FiChevronDown />
                  </motion.button>
                </div>

                {showSimulateOptions && (
                  <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-xl z-10 overflow-hidden w-52">
                    <button
                      onClick={() => randomizeResults(true)}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiRefreshCw className="text-orange-500" />
                      <span>Reset & Simulate All ({fixtures.length})</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Single button if no matches are completed yet
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => randomizeResults(false)} // Simulate all in this case
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg order-2 sm:order-1"
              >
                <FiZap className="text-white" />
                <span>Auto-Simulate All ({fixtures.length}) Matches</span>
              </motion.button>
            ))}
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden mb-4 flex border bg-white rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveTab("fixtures")}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${
              activeTab === "fixtures"
                ? "bg-primary text-white"
                : "text-gray-600"
            }`}
          >
            <FiList />
            <span>Fixtures</span>
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${
              activeTab === "table" ? "bg-primary text-white" : "text-gray-600"
            }`}
          >
            <FiTable />
            <span>Points Table</span>
          </button>
        </div>

        {/* Mobile View - Show based on active tab */}
        <div className="md:hidden">
          {activeTab === "fixtures" && (
            <FixturesList
              fixtures={fixtures}
              teams={teams}
              onSelectMatch={selectMatch}
              selectedMatch={selectedMatch}
              updateMatchResult={updateMatchResult}
              closeMatchSimulator={closeMatchSimulator}
            />
          )}

          {activeTab === "table" && (
            <PointsTable teams={rankedTeams} fixtures={fixtures} />
          )}
        </div>

        {/* Desktop View - Always show grid layout */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-8 order-2 md:order-1">
            <FixturesList
              fixtures={fixtures}
              teams={teams}
              onSelectMatch={selectMatch}
              selectedMatch={selectedMatch}
              updateMatchResult={updateMatchResult}
              closeMatchSimulator={closeMatchSimulator}
            />
          </div>
          <div className="md:col-span-4 order-1 md:order-2 relative">
            <div className="sticky top-[84px]">
              <PointsTable teams={rankedTeams} fixtures={fixtures} />
            </div>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <ConfirmDialog
          onConfirm={handleConfirmResults}
          onCancel={handleCancelConfirmDialog}
        />
      )}

      {showSimulateRemainingDialog && (
        <SimulateRemainingDialog
          remainingCount={remainingMatchesCount}
          onConfirm={handleSimulateRemainingAndViewResults}
          onCancel={handleContinueEditing}
        />
      )}
    </div>
  );
}

export default App;
