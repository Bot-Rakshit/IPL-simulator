import React from "react";
import { motion } from "framer-motion";
import { FiRefreshCw, FiInfo } from "react-icons/fi";

const Header = ({ resetSimulation }) => {
  const [showInfo, setShowInfo] = React.useState(false);

  return (
    <header className="bg-gradient-to-r from-primary to-[#092D5D] text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              className="w-8 h-8 mr-2 text-secondary"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M7 12 A5 5 0 0 1 17 12 A5 5 0 0 1 7 12"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="8"
                y1="8"
                x2="8.5"
                y2="8.5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="16"
                y1="8"
                x2="15.5"
                y2="8.5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="8"
                y1="16"
                x2="8.5"
                y2="15.5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="16"
                y1="16"
                x2="15.5"
                y2="15.5"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <div>
              <h1 className="text-xl font-bold">IPL Top 4 Simulator</h1>
              <p className="text-xs text-gray-300">
                Predict the playoff scenarios
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-white/10"
              onClick={() => setShowInfo(!showInfo)}
            >
              <FiInfo className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {showInfo && (
          <motion.div
            className="mt-4 p-3 bg-white/10 rounded-lg text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-semibold text-secondary mb-1">How to use:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-100">
              <li>Click on a match from the fixtures list</li>
              <li>Enter the match details including scores and overs</li>
              <li>Submit the result to update the points table</li>
              <li>
                NRR is calculated based on runs scored and conceded over overs
                played
              </li>
              <li>The top 4 teams qualify for the playoffs</li>
            </ul>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
