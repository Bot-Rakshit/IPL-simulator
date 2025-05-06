import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiAward,
  FiCheck,
  FiArrowLeft,
  FiStar,
  FiTrendingUp,
  FiTrendingDown,
  FiCircle,
  FiShield,
  FiFlag,
  FiZap,
} from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";

const FinalResults = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const resultsRef = useRef(null);
  const [activeTab, setActiveTab] = useState("top4");

  // Load teams data from localStorage on component mount
  useEffect(() => {
    const storedTeams = localStorage.getItem("rankedTeams");
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    } else {
      // Fallback to regular teams if ranked teams not available
      const regularTeams = localStorage.getItem("teams");
      if (regularTeams) {
        setTeams(JSON.parse(regularTeams));
      } else {
        console.error("No teams data found in localStorage");
      }
    }
  }, [navigate]);

  // Handle going back to the simulator
  const handleBackClick = () => {
    navigate("/");
  };

  // Sort teams by points and NRR
  const sortedTeams =
    teams.length > 0
      ? [...teams].sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          return b.nrr - a.nrr;
        })
      : [];

  // Get top 4 teams
  const qualifiedTeams = sortedTeams.slice(0, 4).map((team) => team.id);

  // If no teams data, show loading state
  if (teams.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-6 mx-auto"></div>
          <p className="text-gray-600 text-xl font-medium">
            Loading your predictions...
          </p>
          <p className="text-gray-400 mt-2">
            Please wait while we prepare your results
          </p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const getPositionBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <div className="absolute -top-2 -left-2 w-14 h-14 z-10">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-amber-500 rounded-full shadow-lg transform -rotate-12 scale-90"></div>
              <div className="absolute inset-0 bg-amber-400 rounded-full shadow-lg flex items-center justify-center">
                <FiFlag className="text-white text-xl" />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="absolute -top-2 -left-2 w-12 h-12 z-10">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-slate-400 rounded-full shadow-lg transform -rotate-12 scale-90"></div>
              <div className="absolute inset-0 bg-slate-300 rounded-full shadow-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">2</span>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="absolute -top-2 -left-2 w-12 h-12 z-10">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-amber-700 rounded-full shadow-lg transform -rotate-12 scale-90"></div>
              <div className="absolute inset-0 bg-amber-600 rounded-full shadow-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">3</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="absolute -top-2 -left-2 w-12 h-12 z-10">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-primary rounded-full shadow-lg transform -rotate-12 scale-90"></div>
              <div className="absolute inset-0 bg-blue-500 rounded-full shadow-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">4</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTeamLogo = (team, large = false) => {
    // Replace this with actual team logos if available
    return (
      <div
        className={`${
          large ? "w-16 h-16" : "w-12 h-12"
        } rounded-full shadow-md flex items-center justify-center`}
        style={{ backgroundColor: team.color }}
      >
        <span className="text-white font-bold text-xl">
          {team.short?.charAt(0)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 hover:bg-slate-100 py-2 px-4 rounded-lg transition-colors text-slate-700"
          >
            <FiArrowLeft />
            <span className="font-medium hidden sm:inline">Back</span>
          </button>
          <h1 className="text-xl font-bold text-primary">
            IPL Playoff Predictions
          </h1>
          {/* Share button removed */}
          <div className="w-[88px]"></div>{" "}
          {/* Spacer to keep header balanced */}
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-6">
        {/* Hero section - More compact */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-2 rounded-full mb-2">
            <FiAward size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Your IPL Playoff Predictions
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Based on your simulations, here are the qualifying teams
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-1 rounded-xl shadow-md flex">
            <button
              onClick={() => setActiveTab("top4")}
              className={`py-2 px-6 rounded-lg font-medium transition-all ${
                activeTab === "top4"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Top 4
            </button>
            <button
              onClick={() => setActiveTab("standings")}
              className={`py-2 px-6 rounded-lg font-medium transition-all ${
                activeTab === "standings"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Standings
            </button>
          </div>
        </div>

        <div ref={resultsRef} className="pt-2">
          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            {activeTab === "top4" ? (
              <motion.div
                key="top4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  {/* Left column: Table Topper + Other teams */}
                  <div className="lg:col-span-3 space-y-4">
                    {/* Table Topper Card */}
                    <motion.div variants={itemVariants}>
                      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-1/3 p-4 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center relative">
                            <div
                              className="absolute left-4 top-4 rounded-full w-8 h-8 flex items-center justify-center shadow-sm text-white position-indicator"
                              style={{ backgroundColor: sortedTeams[0].color }}
                            >
                              <span className="font-bold text-sm">1</span>
                            </div>

                            <div className="text-center">
                              <div
                                className="w-16 h-16 rounded-full shadow-md flex items-center justify-center text-white font-bold text-2xl mx-auto team-logo"
                                style={{
                                  backgroundColor: sortedTeams[0].color,
                                }}
                              >
                                {sortedTeams[0].short?.charAt(0)}
                              </div>
                              <div className="mt-2">
                                <h2 className="font-bold text-gray-800 text-lg team-name">
                                  {sortedTeams[0].name}
                                </h2>
                                <div className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium mt-1 team-qualifier-tag">
                                  <FiFlag className="mr-1 text-xs" /> Table
                                  Topper
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full sm:w-2/3 p-4">
                            <div className="mb-2">
                              <p className="text-sm text-gray-500">
                                Finished at the top of the table, earning a spot
                                in Qualifier 1
                              </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-gray-50 rounded-lg py-2 px-3 text-center">
                                <p className="text-xs text-gray-500 uppercase font-medium">
                                  Points
                                </p>
                                <p className="font-bold text-gray-800 text-xl">
                                  {sortedTeams[0].points}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-lg py-2 px-3 text-center">
                                <p className="text-xs text-gray-500 uppercase font-medium">
                                  W-L
                                </p>
                                <p className="font-bold text-gray-800 text-lg">
                                  {sortedTeams[0].won}-{sortedTeams[0].lost}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-lg py-2 px-3 text-center">
                                <p className="text-xs text-gray-500 uppercase font-medium">
                                  NRR
                                </p>
                                <p
                                  className={`font-bold text-lg ${
                                    sortedTeams[0].nrr >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {sortedTeams[0].nrr > 0 ? "+" : ""}
                                  {sortedTeams[0].nrr.toFixed(3)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Other playoff teams - Grid layout */}
                    <motion.div variants={itemVariants}>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {sortedTeams.slice(1, 4).map((team, index) => (
                          <div
                            key={team.id}
                            className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm relative pt-2"
                          >
                            <div
                              className="absolute left-3 top-3 rounded-full w-8 h-8 flex items-center justify-center shadow-sm text-white position-indicator"
                              style={{ backgroundColor: team.color }}
                            >
                              <span className="font-bold text-sm">
                                {index + 2}
                              </span>
                            </div>

                            <div className="px-3 pt-3 pb-3">
                              <div className="mb-3 ml-9">
                                <h3 className="font-bold text-gray-800 text-base truncate team-name">
                                  {team.name}
                                </h3>
                                <div className="inline-flex items-center px-1.5 py-0.5 bg-blue-50 text-primary rounded text-xs font-medium mt-1 w-fit team-qualifier-tag">
                                  <FiShield className="mr-1 text-xs" />{" "}
                                  Qualifier
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="bg-gray-50 rounded py-2">
                                  <div className="font-medium text-gray-500">
                                    PTS
                                  </div>
                                  <div className="font-bold text-gray-800 text-base">
                                    {team.points}
                                  </div>
                                </div>
                                <div className="bg-gray-50 rounded py-2">
                                  <div className="font-medium text-gray-500">
                                    W-L
                                  </div>
                                  <div className="font-bold text-gray-800 text-base">
                                    {team.won}-{team.lost}
                                  </div>
                                </div>
                                <div className="bg-gray-50 rounded py-2">
                                  <div className="font-medium text-gray-500">
                                    NRR
                                  </div>
                                  <div
                                    className={`font-bold text-base ${
                                      team.nrr >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {team.nrr > 0 ? "+" : ""}
                                    {team.nrr.toFixed(3)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Just missed section - if space allows */}
                    {sortedTeams.length > 4 && (
                      <motion.div variants={itemVariants}>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                          <div className="p-3 bg-gray-50 border-b border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-700">
                              Just Missed the Cut
                            </h2>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                  <th className="px-3 py-2 text-left">Rank</th>
                                  <th className="px-3 py-2 text-left">Team</th>
                                  <th className="px-3 py-2 text-center">Pts</th>
                                  <th className="px-3 py-2 text-center">W-L</th>
                                  <th className="px-3 py-2 text-right">
                                    Missed By
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {sortedTeams.slice(4, 6).map((team, index) => {
                                  const pointsBehind =
                                    sortedTeams[3].points - team.points;
                                  const isTiedInPoints = pointsBehind === 0;

                                  return (
                                    <tr
                                      key={team.id}
                                      className="border-t border-gray-100"
                                    >
                                      <td className="px-3 py-2">
                                        <span className="flex items-center justify-center w-5 h-5 bg-gray-100 text-gray-800 rounded-full text-xs">
                                          {index + 5}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2">
                                        <div className="flex items-center">
                                          <div
                                            className="w-2 h-6 rounded-sm mr-2"
                                            style={{
                                              backgroundColor: team.color,
                                            }}
                                          ></div>
                                          <span className="font-medium text-gray-800 text-xs">
                                            {team.name}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        {team.points}
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        {team.won}-{team.lost}
                                      </td>
                                      <td className="px-3 py-2 text-right">
                                        {isTiedInPoints ? (
                                          <span className="text-orange-600 font-medium">
                                            {(
                                              sortedTeams[3].nrr - team.nrr
                                            ).toFixed(3)}{" "}
                                            NRR
                                          </span>
                                        ) : (
                                          <span className="text-red-600 font-medium">
                                            {pointsBehind}{" "}
                                            {pointsBehind === 1 ? "pt" : "pts"}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right column: Playoff Bracket */}
                  <div className="lg:col-span-2">
                    <motion.div variants={itemVariants}>
                      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                        <div className="p-3 bg-gray-50 border-b border-gray-100">
                          <h2 className="text-sm font-semibold text-gray-700 flex items-center">
                            <FiAward className="mr-2 text-primary" />
                            Playoff Scenario
                          </h2>
                        </div>

                        <div className="p-3 space-y-3">
                          {/* Qualifier 1 */}
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg overflow-hidden border border-blue-200">
                            <div className="bg-primary px-3 py-2 text-white text-xs font-semibold">
                              Qualifier 1
                            </div>
                            <div className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-white font-bold team-logo"
                                    style={{
                                      backgroundColor: sortedTeams[0].color,
                                    }}
                                  >
                                    <span className="text-xs">
                                      {sortedTeams[0].short}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800 text-xs">
                                      {sortedTeams[0].short}
                                    </p>
                                    <p className="text-xs text-gray-500">1st</p>
                                  </div>
                                </div>

                                <div className="text-center px-2">
                                  <div className="text-base font-bold text-gray-700">
                                    VS
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div>
                                    <p className="font-medium text-gray-800 text-xs text-right">
                                      {sortedTeams[1].short}
                                    </p>
                                    <p className="text-xs text-gray-500 text-right">
                                      2nd
                                    </p>
                                  </div>
                                  <div
                                    className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-white font-bold team-logo"
                                    style={{
                                      backgroundColor: sortedTeams[1].color,
                                    }}
                                  >
                                    <span className="text-xs">
                                      {sortedTeams[1].short}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-blue-50 mt-2 p-2 rounded text-xs border border-blue-100">
                                <p className="text-primary">
                                  <FiZap className="inline mr-1 text-xs" />
                                  Winner to Final
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Eliminator */}
                          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg overflow-hidden border border-orange-200">
                            <div className="bg-amber-600 px-3 py-2 text-white text-xs font-semibold">
                              Eliminator
                            </div>
                            <div className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-white font-bold team-logo"
                                    style={{
                                      backgroundColor: sortedTeams[2].color,
                                    }}
                                  >
                                    <span className="text-xs">
                                      {sortedTeams[2].short}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800 text-xs">
                                      {sortedTeams[2].short}
                                    </p>
                                    <p className="text-xs text-gray-500">3rd</p>
                                  </div>
                                </div>

                                <div className="text-center px-2">
                                  <div className="text-base font-bold text-gray-700">
                                    VS
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div>
                                    <p className="font-medium text-gray-800 text-xs text-right">
                                      {sortedTeams[3].short}
                                    </p>
                                    <p className="text-xs text-gray-500 text-right">
                                      4th
                                    </p>
                                  </div>
                                  <div
                                    className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-white font-bold team-logo"
                                    style={{
                                      backgroundColor: sortedTeams[3].color,
                                    }}
                                  >
                                    <span className="text-xs">
                                      {sortedTeams[3].short}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-orange-50 mt-2 p-2 rounded text-xs border border-orange-100">
                                <p className="text-amber-700">
                                  <FiZap className="inline mr-1 text-xs" />
                                  Winner to Q2
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Qualifier 2 */}
                          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg overflow-hidden border border-green-200">
                            <div className="bg-green-600 px-3 py-2 text-white text-xs font-semibold">
                              Qualifier 2
                            </div>
                            <div className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-700 font-bold text-xs">
                                      Q1
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800 text-xs">
                                      Q1 Loser
                                    </p>
                                  </div>
                                </div>

                                <div className="text-center px-2">
                                  <div className="text-base font-bold text-gray-700">
                                    VS
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div>
                                    <p className="font-medium text-gray-800 text-xs text-right">
                                      E Winner
                                    </p>
                                  </div>
                                  <div className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-700 font-bold text-xs">
                                      E
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-green-50 mt-2 p-2 rounded text-xs border border-green-100">
                                <p className="text-green-700">
                                  <FiZap className="inline mr-1 text-xs" />
                                  Winner to Final
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="standings"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary to-[#092D5D] px-6 py-4">
                  <h2 className="text-white font-bold text-lg">
                    Complete Tournament Standings
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="px-4 py-4 text-left font-semibold">#</th>
                        <th className="px-4 py-4 text-left font-semibold">
                          Team
                        </th>
                        <th className="px-4 py-4 text-center font-semibold">
                          Matches
                        </th>
                        <th className="px-4 py-4 text-center font-semibold">
                          W
                        </th>
                        <th className="px-4 py-4 text-center font-semibold">
                          L
                        </th>
                        <th className="px-4 py-4 text-center font-semibold">
                          NR
                        </th>
                        <th className="px-4 py-4 text-center font-semibold">
                          Points
                        </th>
                        <th className="px-4 py-4 text-center font-semibold">
                          NRR
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTeams.map((team, index) => {
                        const isQualified = qualifiedTeams.includes(team.id);
                        const isTableTopper = index === 0;

                        return (
                          <tr
                            key={team.id}
                            className={`border-t border-gray-200 ${
                              isQualified ? "bg-blue-50/50" : ""
                            } hover:bg-gray-50`}
                          >
                            <td className="px-4 py-4">
                              {isTableTopper ? (
                                <span className="flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-800 rounded-full text-sm font-bold shadow-sm">
                                  <FiFlag className="text-amber-500" />
                                </span>
                              ) : isQualified ? (
                                <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold shadow-sm">
                                  {index + 1}
                                </span>
                              ) : (
                                <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-800 rounded-full text-sm font-bold">
                                  {index + 1}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-10 rounded-sm mr-3 flex-shrink-0"
                                  style={{ backgroundColor: team.color }}
                                ></div>
                                <div>
                                  <div className="font-medium text-gray-800 flex items-center flex-wrap gap-2">
                                    {team.name}
                                    {isTableTopper && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 whitespace-nowrap">
                                        <FiFlag
                                          className="mr-0.5 text-amber-500"
                                          size={10}
                                        />
                                        Table Topper
                                      </span>
                                    )}
                                    {isQualified && !isTableTopper && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                                        <FiCheck className="mr-0.5" size={10} />
                                        Playoff
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {team.short}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              {team.matches}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="font-medium text-green-600">
                                {team.won}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="font-medium text-red-600">
                                {team.lost}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              {team.nr || 0}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                                {team.points}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center">
                                {team.nrr > 0 ? (
                                  <FiTrendingUp
                                    className="text-green-500 mr-1"
                                    size={14}
                                  />
                                ) : team.nrr < 0 ? (
                                  <FiTrendingDown
                                    className="text-red-500 mr-1"
                                    size={14}
                                  />
                                ) : (
                                  <FiCircle
                                    className="text-gray-400 mr-1"
                                    size={10}
                                  />
                                )}
                                <span
                                  className={`font-medium ${
                                    team.nrr > 0
                                      ? "text-green-600"
                                      : team.nrr < 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {team.nrr > 0 ? "+" : ""}
                                  {team.nrr.toFixed(3)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="inline-block w-3 h-3 bg-blue-100 rounded-full mr-2"></span>
                      <span>Playoff Qualification</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="inline-block w-3 h-3 bg-amber-100 rounded-full mr-2"></span>
                      <span>Table Topper</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-6 mb-2">
          <div className="text-xs text-gray-500 flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
            <FiAward className="mr-1.5 text-primary" />
            <span>Generated with IPL Top 4 Simulator</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinalResults;
