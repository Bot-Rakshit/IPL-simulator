import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import MatchSimulator from "./MatchSimulator";

const FixturesList = ({
  fixtures,
  teams,
  onSelectMatch,
  selectedMatch,
  updateMatchResult,
  closeMatchSimulator,
}) => {
  const [expandedMatch, setExpandedMatch] = useState(null);

  const getTeamById = (id) => {
    return teams.find((team) => team.id === id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleMatchClick = (fixture) => {
    if (expandedMatch === fixture.id) {
      setExpandedMatch(null);
      onSelectMatch(null);
    } else {
      setExpandedMatch(fixture.id);
      onSelectMatch(fixture);
    }
  };

  const formatResult = (result, team1, team2) => {
    if (!result || !result.winner || !team1 || !team2) {
      if (result?.type === "noResult") return "No Result";
      return "Result TBD";
    }

    const winnerTeam = result.winner === team1.id ? team1 : team2;

    if (result.type === "runs") {
      return `${winnerTeam.short} won by ${result.margin} runs`;
    } else if (result.type === "wickets") {
      return `${winnerTeam.short} won with ${result.ballsRemaining} balls remaining`;
    } else {
      return "No Result";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 md:max-h-[calc(100vh-100px)] md:flex md:flex-col">
      <div className="bg-gradient-to-r from-primary to-[#092D5D] px-4 py-3">
        <h2 className="text-white font-semibold text-lg">Remaining Fixtures</h2>
        <p className="text-white/70 text-xs">
          Click on a match to simulate the result
        </p>
      </div>

      <div className="divide-y divide-gray-100 md:overflow-y-auto">
        {fixtures.map((fixture) => {
          const team1 = getTeamById(fixture.team1.id);
          const team2 = getTeamById(fixture.team2.id);
          const isExpanded = expandedMatch === fixture.id;
          const isSelected = selectedMatch === fixture.id;
          const isCompleted = fixture.completed;

          const team1Short = team1 ? team1.short : "T1";
          const team2Short = team2 ? team2.short : "T2";
          const team1Color = team1 ? team1.color : "#cccccc";
          const team2Color = team2 ? team2.color : "#aaaaaa";

          const resultString = formatResult(fixture.result, team1, team2);

          return (
            <motion.div
              key={fixture.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${fixture.completed ? "opacity-70" : ""}`}
            >
              <div
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isExpanded ? "bg-gray-50" : ""
                }`}
                onClick={() => handleMatchClick(fixture)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-1 sm:gap-0">
                  <div className="flex items-center text-xs text-gray-500">
                    <FiCalendar className="mr-1 flex-shrink-0" />
                    <span>
                      Match {fixture.matchNumber} • {formatDate(fixture.date)}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1 sm:mt-0">
                    <FiMapPin className="mr-1 flex-shrink-0" />
                    <span className="text-ellipsis overflow-hidden">
                      {fixture.venue}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-2 h-10 rounded-sm"
                      style={{ backgroundColor: team1Color }}
                    ></div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">
                        {team1Short}
                      </p>
                      <p className="text-xs text-gray-500">{team1.short}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {fixture.completed ? (
                      <div className="flex items-center justify-center bg-green-100 text-green-800 rounded-full h-7 w-7 sm:h-6 sm:w-6">
                        <FiCheck />
                      </div>
                    ) : (
                      <>
                        <div className="text-sm font-semibold text-gray-500 mr-2">
                          VS
                        </div>
                        {!fixture.completed && (
                          <div className="text-primary">
                            {isExpanded ? (
                              <FiChevronUp size={20} />
                            ) : (
                              <FiChevronDown size={20} />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-medium text-sm sm:text-base">
                        {team2Short}
                      </p>
                      <p className="text-xs text-gray-500">{team2.short}</p>
                    </div>
                    <div
                      className="w-2 h-10 rounded-sm"
                      style={{ backgroundColor: team2Color }}
                    ></div>
                  </div>
                </div>

                {fixture.completed && fixture.result && (
                  <div className="mt-3 text-sm">
                    {fixture.result.type === "noResult" ? (
                      <div className="text-center text-yellow-600 bg-yellow-50 py-2 px-3 rounded text-xs font-medium">
                        No Result (Match Abandoned)
                      </div>
                    ) : (
                      <div className="text-center text-primary bg-blue-50 py-2 px-3 rounded text-xs font-medium">
                        {resultString}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 sm:px-4 pb-4">
                      <div className="border-t border-gray-200 pt-4">
                        {selectedMatch && selectedMatch.id === fixture.id && (
                          <>
                            {fixture.completed && (
                              <div className="mb-4 bg-blue-50 p-3 sm:p-4 rounded-md text-sm">
                                <div className="font-medium mb-1 text-blue-700">
                                  Current Result:
                                </div>
                                {fixture.result.type === "noResult" ? (
                                  <p>No Result (Match Abandoned)</p>
                                ) : fixture.result.type === "runs" ? (
                                  <p>
                                    {getTeamById(fixture.result.winner).name}{" "}
                                    won by {fixture.result.margin} runs
                                  </p>
                                ) : (
                                  <p>
                                    {getTeamById(fixture.result.winner).name}{" "}
                                    won by {fixture.result.margin} wickets (
                                    {fixture.result.ballsRemaining} balls
                                    remaining)
                                  </p>
                                )}
                                <div className="mt-2 text-blue-600 font-medium">
                                  Edit this result below
                                </div>
                              </div>
                            )}
                            <MatchSimulator
                              match={selectedMatch}
                              teams={teams}
                              onSubmitResult={updateMatchResult}
                              onClose={closeMatchSimulator}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FixturesList;
