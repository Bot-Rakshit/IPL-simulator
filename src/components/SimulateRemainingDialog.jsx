import React from "react";
import { motion } from "framer-motion";
import { FiHelpCircle, FiZap } from "react-icons/fi";

const SimulateRemainingDialog = ({ onConfirm, onCancel, remainingCount }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-lg shadow-lg max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <FiHelpCircle className="text-primary text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Incomplete Matches Found
            </h3>
          </div>

          <p className="text-gray-600 mb-1">
            There are still {remainingCount} match
            {remainingCount !== 1 ? "es" : ""} that haven't been simulated.
          </p>
          <p className="text-gray-600 mb-5">
            Would you like to auto-simulate the remaining matches to view final
            results, or continue editing?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Continue Editing
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-[#0a3a7d] flex items-center"
            >
              <FiZap className="mr-2" />
              Simulate Remaining
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SimulateRemainingDialog;
