import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const PointsTable = ({ teams, fixtures }) => {
  const [expandMobileView, setExpandMobileView] = useState(false);
  const qualifiedTeams = teams.slice(0, 4).map((team) => team.id);

  const getRemainingMatches = (teamId) => {
    if (!fixtures) return 0;
    return fixtures.filter(
      (f) => (f.team1.id === teamId || f.team2.id === teamId) && !f.completed
    ).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-primary to-[#092D5D] px-4 py-3 flex justify-between items-center">
        <h2 className="text-white font-semibold text-lg">Points Table</h2>
        <button
          className="md:hidden flex items-center text-white/80 hover:text-white"
          onClick={() => setExpandMobileView(!expandMobileView)}
        >
          {expandMobileView ? (
            <>
              <span className="text-xs mr-1">Simple View</span>
              <FiChevronUp size={16} />
            </>
          ) : (
            <>
              <span className="text-xs mr-1">Full Details</span>
              <FiChevronDown size={16} />
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              {/* Position column - always visible */}
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">#</th>

              {/* Team column - always visible */}
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Team</th>

              {/* Essential stats - Now shown first after Team */}
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">P</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">Pts</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">NRR</th>

              {/* Win/Loss/NR - hidden on mobile unless expanded */}
              <th
                className={`px-2 sm:px-4 py-2 sm:py-3 text-center ${
                  !expandMobileView ? "hidden md:table-cell" : ""
                }
                }`}
              >
                W
              </th>
              <th
                className={`px-2 sm:px-4 py-2 sm:py-3 text-center ${
                  !expandMobileView ? "hidden md:table-cell" : ""
                }
                }`}
              >
                L
              </th>
              <th
                className={`px-2 sm:px-4 py-2 sm:py-3 text-center ${
                  !expandMobileView ? "hidden md:table-cell" : ""
                }
                }`}
              >
                NR
              </th>

              {/* Remaining - hidden on mobile unless expanded */}
              <th
                className={`px-2 sm:px-4 py-2 sm:py-3 text-center ${
                  !expandMobileView ? "hidden md:table-cell" : ""
                }
                }`}
              >
                Rem
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => {
              const isQualified = qualifiedTeams.includes(team.id);
              const remainingMatches = getRemainingMatches(team.id);

              return (
                <motion.tr
                  key={team.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`border-t border-gray-200 ${
                    isQualified ? "bg-green-50" : ""
                  }`}
                >
                  {/* Position - always visible */}
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <span
                      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs
                      ${
                        isQualified
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {team.position}
                    </span>
                  </td>

                  {/* Team - always visible */}
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: team.color }}
                      ></div>
                      <span className="font-medium">
                        <span className="hidden sm:inline">{team.name}</span>
                        <span className="sm:hidden">{team.short}</span>
                      </span>
                    </div>
                  </td>

                  {/* Essential stats - Now shown first after Team */}
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                    {team.matches}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold">
                    {team.points}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                    <div className="flex items-center justify-center">
                      <span
                        className={
                          team.nrr > 0
                            ? "text-green-600"
                            : team.nrr < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }
                      >
                        <span className="hidden sm:inline">
                          {team.nrr > 0 ? (
                            <FiTrendingUp className="inline mr-1" />
                          ) : team.nrr < 0 ? (
                            <FiTrendingDown className="inline mr-1" />
                          ) : (
                            <FiMinus className="inline mr-1" />
                          )}
                        </span>
                        {team.nrr > 0 ? "+" : ""}
                        {team.nrr.toFixed(3)}
                      </span>
                    </div>
                  </td>

                  {/* Win/Loss/NR - hidden on mobile unless expanded */}
                  <td
                    className={`px-2 sm:px-4 py-2 sm:py-3 text-center ${
                      !expandMobileView ? "hidden md:table-cell" : ""
                    }
                    }`}
                  >
                    {team.won}
                  </td>
                  <td
                    className={`px-2 sm:px-4 py-2 sm:py-3 text-center ${
                      !expandMobileView ? "hidden md:table-cell" : ""
                    }
                    }`}
                  >
                    {team.lost}
                  </td>
                  <td
                    className={`px-2 sm:px-4 py-2 sm:py-3 text-center ${
                      !expandMobileView ? "hidden md:table-cell" : ""
                    }
                    }`}
                  >
                    {team.nr}
                  </td>

                  {/* Remaining - hidden on mobile unless expanded */}
                  <td
                    className={`px-2 sm:px-4 py-2 sm:py-3 text-center font-medium ${
                      !expandMobileView ? "hidden md:table-cell" : ""
                    }
                    }`}
                  >
                    {fixtures ? remainingMatches : "-"}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 rounded-full mr-1"></div>
          <span>Playoff qualification</span>
        </div>
      </div>
    </div>
  );
};

export default PointsTable;
