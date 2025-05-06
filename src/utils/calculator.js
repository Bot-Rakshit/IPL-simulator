/**
 * Calculates points based on match results
 * @param {Object} team - Team object
 * @param {string} result - Win, Loss, or NR
 * @returns {number} - Points to be added
 */
export const calculatePoints = (team, result) => {
  switch (result) {
    case 'win':
      return 2;
    case 'nr':
      return 1;
    default:
      return 0;
  }
};

/**
 * Calculates the new Net Run Rate (NRR) for two teams after a match
 * 
 * NRR = (Total runs scored / Total overs faced) - (Total runs conceded / Total overs bowled)
 * 
 * @param {Object} team1 - First team object
 * @param {Object} team2 - Second team object
 * @param {number} margin - Margin of victory (runs or wickets)
 * @param {number} firstInningsScore - Runs scored in first innings
 * @param {number} firstInningsOvers - Overs faced in first innings
 * @param {number} secondInningsScore - Runs scored in second innings
 * @param {number} secondInningsOvers - Overs faced in second innings
 * @param {number} ballsRemaining - Balls remaining when team won by wickets
 * @returns {Object} - Object containing updated NRR for both teams
 */
export const calculateNewNRR = (
  team1,
  team2,
  margin,
  firstInningsScore,
  firstInningsOvers,
  secondInningsScore,
  secondInningsOvers,
  ballsRemaining = 0
) => {
  // Convert overs to balls for precise calculations
  const firstInningsBalls = Math.floor(firstInningsOvers) * 6 + (firstInningsOvers % 1) * 10;
  const secondInningsBalls = Math.floor(secondInningsOvers) * 6 + (secondInningsOvers % 1) * 10;
  
  // Get existing runs and overs for both teams
  // For team 1
  const team1PrevMatches = team1.matches;
  const team1PrevRunsScored = team1.runsScored || 0;
  const team1PrevRunsConceded = team1.runsConceded || 0;
  const team1PrevBallsFaced = team1.ballsFaced || 0;
  const team1PrevBallsBowled = team1.ballsBowled || 0;
  
  // For team 2
  const team2PrevMatches = team2.matches;
  const team2PrevRunsScored = team2.runsScored || 0;
  const team2PrevRunsConceded = team2.runsConceded || 0;
  const team2PrevBallsFaced = team2.ballsFaced || 0;
  const team2PrevBallsBowled = team2.ballsBowled || 0;
  
  // Update runs and balls for both teams
  const team1NewRunsScored = team1PrevRunsScored + firstInningsScore;
  const team1NewRunsConceded = team1PrevRunsConceded + secondInningsScore;
  const team1NewBallsFaced = team1PrevBallsFaced + firstInningsBalls;
  const team1NewBallsBowled = team1PrevBallsBowled + secondInningsBalls;
  
  const team2NewRunsScored = team2PrevRunsScored + secondInningsScore;
  const team2NewRunsConceded = team2PrevRunsConceded + firstInningsScore;
  const team2NewBallsFaced = team2PrevBallsFaced + secondInningsBalls;
  const team2NewBallsBowled = team2PrevBallsBowled + firstInningsBalls;
  
  // Calculate new NRR
  const team1NewNRR = 
    (team1NewRunsScored / (team1NewBallsFaced / 6)) - 
    (team1NewRunsConceded / (team1NewBallsBowled / 6));
  
  const team2NewNRR = 
    (team2NewRunsScored / (team2NewBallsFaced / 6)) - 
    (team2NewRunsConceded / (team2NewBallsBowled / 6));
  
  return {
    nrr: {
      team1: team1NewNRR,
      team2: team2NewNRR
    }
  };
};