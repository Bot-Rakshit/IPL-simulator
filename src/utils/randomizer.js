/**
 * Utility functions for generating random match results
 */

/**
 * Returns a random integer between min and max (inclusive)
 */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random T20 score
 * @param {boolean} isChasing - Whether the team is chasing a target
 * @param {number} targetScore - The target score if chasing
 * @returns {number} - Random score
 */
const getRandomScore = (isChasing = false, targetScore = null) => {
  if (isChasing && targetScore) {
    // When chasing, decide if the chase is successful (60% probability)
    const isSuccessful = Math.random() < 0.6;

    if (isSuccessful) {
      // For successful chase, score should be between target and target+10
      return getRandomInt(targetScore, targetScore + 10);
    } else {
      // For failed chase, score should be between target-50 and target-1
      return getRandomInt(Math.max(targetScore - 50, 30), targetScore - 1);
    }
  } else {
    // First innings score distribution for T20 matches
    const scoreRanges = [
      { min: 120, max: 140, probability: 0.05 }, // Low score (Reduced)
      { min: 141, max: 160, probability: 0.15 }, // Below average (Reduced)
      { min: 161, max: 175, probability: 0.4 }, // Average-Good (Increased, centered)
      { min: 176, max: 190, probability: 0.25 }, // Good (Adjusted range/prob)
      { min: 191, max: 210, probability: 0.1 }, // Very Good (Adjusted range/prob)
      { min: 211, max: 230, probability: 0.05 }, // Excellent (Reduced, adjusted range)
    ];

    const random = Math.random();
    let cumulativeProbability = 0;

    for (const range of scoreRanges) {
      cumulativeProbability += range.probability;
      if (random <= cumulativeProbability) {
        return getRandomInt(range.min, range.max);
      }
    }

    // Fallback
    return getRandomInt(150, 180);
  }
};

/**
 * Generates random overs played
 * @param {boolean} isChasing - Whether the team is chasing
 * @param {boolean} isSuccessful - Whether the chase was successful
 * @returns {number} - Overs played in format 19.5 (19 overs and 5 balls)
 */
const getRandomOvers = (isChasing = false, isSuccessful = false) => {
  if (isChasing) {
    if (isSuccessful) {
      // For successful chase, overs between 15 and 19.5
      const fullOvers = getRandomInt(15, 19);
      const balls = getRandomInt(0, 5);
      return fullOvers + balls / 10;
    } else {
      // For failed chase, always use full 20 overs
      return 20;
    }
  } else {
    // First innings almost always uses full 20 overs in T20
    return 20;
  }
};

/**
 * Calculates balls remaining from overs
 * @param {number} overs - Overs in format 19.5
 * @returns {number} - Balls remaining
 */
const calculateBallsRemaining = (overs) => {
  const fullOvers = Math.floor(overs);
  const balls = Math.round((overs - fullOvers) * 10);
  return (20 - fullOvers) * 6 - balls;
};

/**
 * Generates a random match result
 * @returns {Object} - Random match result
 */
const generateRandomResult = () => {
  // 5% chance of no result
  if (Math.random() < 0.05) {
    return {
      type: "noResult",
    };
  }

  // Determine result type and winner logic more clearly
  const firstInningsScore = getRandomScore();
  const secondInningsScore = getRandomScore(true, firstInningsScore);
  const firstInningsOvers = 20;

  // Case 1: Team batting first wins (Runs victory)
  if (firstInningsScore > secondInningsScore) {
    const margin = firstInningsScore - secondInningsScore;
    return {
      type: "runs",
      margin: margin, // Always positive here
      firstInningsScore,
      firstInningsOvers,
      secondInningsScore,
      secondInningsOvers: 20, // Chase failed, full overs
    };
  }
  // Case 2: Team batting second wins (Wickets victory)
  else if (secondInningsScore > firstInningsScore) {
    const secondInningsOvers = getRandomOvers(true, true);
    const wickets = getRandomInt(1, 8);
    return {
      type: "wickets",
      margin: 10 - wickets,
      ballsRemaining: calculateBallsRemaining(secondInningsOvers),
      firstInningsScore,
      firstInningsOvers,
      secondInningsScore,
      secondInningsOvers,
    };
  }
  // Case 3: Scores are level (Handle as a Tie or Super Over - simplified to Runs victory for now)
  // Or an unexpected scenario. Let's default to a narrow runs victory for simplicity.
  else {
    // Make it a 1 run victory for the team batting first to avoid issues
    const adjustedSecondInningsScore = firstInningsScore - 1;
    return {
      type: "runs",
      margin: 1,
      firstInningsScore,
      firstInningsOvers,
      secondInningsScore: adjustedSecondInningsScore,
      secondInningsOvers: 20,
    };
  }

  // Determine if result is by runs or wickets (50-50 chance)
  // const isBattingFirst = Math.random() < 0.5;

  // if (isBattingFirst) {
  // Team batting first wins by runs
  // const firstInningsScore = getRandomScore();
  // const secondInningsScore = getRandomScore(true, firstInningsScore);
  // const firstInningsOvers = 20;
  // const secondInningsOvers = 20;

  // const margin = firstInningsScore - secondInningsScore;
  // Ensure margin is positive
  // const positiveMargin = Math.max(1, margin);

  // return {
  //   type: "runs",
  //   margin: positiveMargin,
  //   firstInningsScore,
  //   firstInningsOvers,
  //   secondInningsScore: firstInningsScore - positiveMargin,
  //   secondInningsOvers,
  // };
  // } else {
  // Team batting second wins by wickets
  // const firstInningsScore = getRandomScore();
  // const secondInningsScore = getRandomScore(true, firstInningsScore);
  // const firstInningsOvers = 20;

  // if (secondInningsScore > firstInningsScore) {
  // Chase successful
  // const secondInningsOvers = getRandomOvers(true, true);
  // const wickets = getRandomInt(1, 8); // Random wickets lost between 1-8 for successful chase

  // return {
  //   type: "wickets",
  //   margin: 10 - wickets,
  //   ballsRemaining: calculateBallsRemaining(secondInningsOvers),
  //   firstInningsScore,
  //   firstInningsOvers,
  //   secondInningsScore,
  //   secondInningsOvers,
  // };
  // } else {
  // Chase failed - should be runs victory
  // const margin = firstInningsScore - secondInningsScore;
  // const positiveMargin = Math.max(1, margin);
  // return {
  //   type: "runs",
  //   margin: positiveMargin,
  //   firstInningsScore,
  //   firstInningsOvers,
  //   secondInningsScore: firstInningsScore - positiveMargin,
  //   secondInningsOvers: 20,
  // };
  // }
  // }
};

/**
 * Randomizes all fixtures in the tournament
 * @param {Array} fixtures - Current fixtures
 * @param {Array} teams - Team data
 * @returns {Array} - Updated fixtures with random results
 */
export const randomizeAllFixtures = (fixtures, teams) => {
  return fixtures.map((fixture) => {
    // Skip already completed matches
    if (fixture.completed) {
      return fixture;
    }

    const randomResult = generateRandomResult();

    // Determine winner (50-50 chance)
    const team1Wins = Math.random() < 0.5;

    if (randomResult.type === "noResult") {
      return {
        ...fixture,
        completed: true,
        result: randomResult,
      };
    } else {
      return {
        ...fixture,
        completed: true,
        result: {
          ...randomResult,
          winner: team1Wins ? fixture.team1.id : fixture.team2.id,
        },
      };
    }
  });
};
