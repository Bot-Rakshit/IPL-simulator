// Helper function to convert overs string (e.g., "205.1") to balls
const oversStringToBalls = (oversStr) => {
  if (!oversStr || typeof oversStr !== "string") return 0;
  const parts = oversStr.split("/"); // Split runs/overs
  if (parts.length < 2) return 0;
  const oversPart = parts[1];
  const overParts = oversPart.split("."); // Split full overs and balls
  const fullOvers = parseInt(overParts[0], 10) || 0;
  const ballsInOver =
    overParts.length > 1 ? parseInt(overParts[1], 10) || 0 : 0;
  return fullOvers * 6 + ballsInOver;
};

// Helper function to parse runs from "runs/overs" string
const parseRuns = (runsStr) => {
  if (!runsStr || typeof runsStr !== "string") return 0;
  const parts = runsStr.split("/");
  return parseInt(parts[0], 10) || 0;
};

// Team IDs and initial data based on provided JSON
export const initialTeams = [
  {
    // RCB - ID: 9
    id: 9,
    name: "Royal Challengers Bengaluru",
    short: "RCB",
    color: "#EC1C24", // Standard RCB Red
    matches: 11,
    won: 8,
    lost: 3,
    nr: 0,
    points: 16,
    nrr: 0.482,
    totalRunsScored: parseRuns("1938/205.1"),
    totalBallsFaced: oversStringToBalls("1938/205.1"),
    totalRunsConceded: parseRuns("1863/207.5"),
    totalBallsBowled: oversStringToBalls("1863/207.5"),
  },
  {
    // PBKS - ID: 7
    id: 7,
    name: "Punjab Kings",
    short: "PBKS",
    color: "#DD1F2D",
    matches: 11,
    won: 7,
    lost: 3,
    nr: 1,
    points: 15,
    nrr: 0.376,
    totalRunsScored: parseRuns("1835/188.1"),
    totalBallsFaced: oversStringToBalls("1835/188.1"),
    totalRunsConceded: parseRuns("1794/191.2"),
    totalBallsBowled: oversStringToBalls("1794/191.2"),
  },
  {
    // MI - ID: 6
    id: 6,
    name: "Mumbai Indians",
    short: "MI",
    color: "#006CB7",
    matches: 11,
    won: 7,
    lost: 4,
    nr: 0,
    points: 14,
    nrr: 1.274,
    totalRunsScored: parseRuns("1962/202.2"),
    totalBallsFaced: oversStringToBalls("1962/202.2"),
    totalRunsConceded: parseRuns("1846/219.1"),
    totalBallsBowled: oversStringToBalls("1846/219.1"),
  },
  {
    // GT - ID: 3
    id: 3,
    name: "Gujarat Titans",
    short: "GT",
    color: "#1B2133",
    matches: 10,
    won: 7,
    lost: 3,
    nr: 0,
    points: 14,
    nrr: 0.867,
    totalRunsScored: parseRuns("1983/193.5"),
    totalBallsFaced: oversStringToBalls("1983/193.5"),
    totalRunsConceded: parseRuns("1829/195.2"),
    totalBallsBowled: oversStringToBalls("1829/195.2"),
  },
  {
    // DC - ID: 2
    id: 2,
    name: "Delhi Capitals",
    short: "DC",
    color: "#004C93",
    matches: 11,
    won: 6,
    lost: 4,
    nr: 1,
    points: 13,
    nrr: 0.362,
    totalRunsScored: parseRuns("1826/191.1"),
    totalBallsFaced: oversStringToBalls("1826/191.1"),
    totalRunsConceded: parseRuns("1818/197.5"),
    totalBallsBowled: oversStringToBalls("1818/197.5"),
  },
  {
    // KKR - ID: 4
    id: 4,
    name: "Kolkata Knight Riders",
    short: "KKR",
    color: "#3A225D",
    matches: 11,
    won: 5,
    lost: 5,
    nr: 1,
    points: 11,
    nrr: 0.249,
    totalRunsScored: parseRuns("1648/187.4"),
    totalBallsFaced: oversStringToBalls("1648/187.4"),
    totalRunsConceded: parseRuns("1614/189.1"),
    totalBallsBowled: oversStringToBalls("1614/189.1"),
  },
  {
    // LSG - ID: 5
    id: 5,
    name: "Lucknow Super Giants",
    short: "LSG",
    color: "#0057E2", // Using a standard blue, adjust if specific LSG color known
    matches: 11,
    won: 5,
    lost: 6,
    nr: 0,
    points: 10,
    nrr: -0.469,
    totalRunsScored: parseRuns("2065/215.4"),
    totalBallsFaced: oversStringToBalls("2065/215.4"),
    totalRunsConceded: parseRuns("2141/213.1"),
    totalBallsBowled: oversStringToBalls("2141/213.1"),
  },
  {
    // SRH - ID: 10
    id: 10,
    name: "Sunrisers Hyderabad",
    short: "SRH",
    color: "#FF822A",
    matches: 11,
    won: 3,
    lost: 7,
    nr: 1,
    points: 7,
    nrr: -1.192,
    totalRunsScored: parseRuns("1804/197.1"),
    totalBallsFaced: oversStringToBalls("1804/197.1"),
    totalRunsConceded: parseRuns("1889/182.4"),
    totalBallsBowled: oversStringToBalls("1889/182.4"),
  },
  {
    // RR - ID: 8
    id: 8,
    name: "Rajasthan Royals",
    short: "RR",
    color: "#EA1A85",
    matches: 12,
    won: 3,
    lost: 9,
    nr: 0,
    points: 6,
    nrr: -0.718,
    totalRunsScored: parseRuns("2206/235.5"),
    totalBallsFaced: oversStringToBalls("2206/235.5"),
    totalRunsConceded: parseRuns("2367/235.0"),
    totalBallsBowled: oversStringToBalls("2367/235.0"),
  },
  {
    // CSK - ID: 1
    id: 1,
    name: "Chennai Super Kings",
    short: "CSK",
    color: "#FDB913",
    matches: 11,
    won: 2,
    lost: 9,
    nr: 0,
    points: 4,
    nrr: -1.117,
    totalRunsScored: parseRuns("1841/218.4"),
    totalBallsFaced: oversStringToBalls("1841/218.4"),
    totalRunsConceded: parseRuns("1947/204.1"),
    totalBallsBowled: oversStringToBalls("1947/204.1"),
  },
].sort((a, b) => a.id - b.id); // Sort by ID to ensure consistent order

// Fixtures data - Assuming this part is correct and uses numeric IDs 1-10
export const initialFixtures = [
  // Example completed fixture (ensure team IDs are numeric 1-10)

  // Uncompleted fixtures (ensure team IDs are numeric 1-10)
  {
    id: 56,
    matchNumber: 56,
    venue: "Wankhede Stadium, Mumbai",
    date: "2025-05-06T14:00:00Z",
    team1: { id: 6 }, // MI
    team2: { id: 3 }, // GT
    completed: false,
    result: null,
  },
  {
    id: 57,
    matchNumber: 57,
    venue: "Eden Gardens, Kolkata",
    date: "2025-05-07T14:00:00Z",
    team1: { id: 4 }, // KKR
    team2: { id: 1 }, // CSK
    completed: false,
    result: null,
  },
  {
    id: 58,
    matchNumber: 58,
    venue: "Himachal Pradesh Cricket Association Stadium, Dharamshala",
    date: "2025-05-08T14:00:00Z",
    team1: { id: 7 }, // PBKS
    team2: { id: 2 }, // DC
    completed: false,
    result: null,
  },
  {
    id: 59,
    matchNumber: 59,
    venue:
      "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
    date: "2025-05-09T14:00:00Z",
    team1: { id: 5 }, // LSG
    team2: { id: 9 }, // RCB
    completed: false,
    result: null,
  },
  {
    id: 60,
    matchNumber: 60,
    venue: "Rajiv Gandhi International Stadium, Hyderabad",
    date: "2025-05-10T14:00:00Z",
    team1: { id: 10 }, // SRH
    team2: { id: 4 }, // KKR
    completed: false,
    result: null,
  },
  {
    id: 61,
    matchNumber: 61,
    venue: "Himachal Pradesh Cricket Association Stadium, Dharamshala",
    date: "2025-05-11T10:00:00Z",
    team1: { id: 7 }, // PBKS
    team2: { id: 6 }, // MI
    completed: false,
    result: null,
  },
  {
    id: 62,
    matchNumber: 62,
    venue: "Arun Jaitley Stadium, Delhi",
    date: "2025-05-11T14:00:00Z",
    team1: { id: 2 }, // DC
    team2: { id: 3 }, // GT
    completed: false,
    result: null,
  },
  {
    id: 63,
    matchNumber: 63,
    venue: "MA Chidambaram Stadium, Chennai",
    date: "2025-05-12T14:00:00Z",
    team1: { id: 1 }, // CSK
    team2: { id: 8 }, // RR
    completed: false,
    result: null,
  },
  {
    id: 64,
    matchNumber: 64,
    venue: "M Chinnaswamy Stadium, Bengaluru",
    date: "2025-05-13T14:00:00Z",
    team1: { id: 9 }, // RCB
    team2: { id: 10 }, // SRH
    completed: false,
    result: null,
  },
  {
    id: 65,
    matchNumber: 65,
    venue: "Narendra Modi Stadium, Ahmedabad",
    date: "2025-05-14T14:00:00Z",
    team1: { id: 3 }, // GT
    team2: { id: 5 }, // LSG
    completed: false,
    result: null,
  },
  {
    id: 66,
    matchNumber: 66,
    venue: "Wankhede Stadium, Mumbai",
    date: "2025-05-15T14:00:00Z",
    team1: { id: 6 }, // MI
    team2: { id: 2 }, // DC
    completed: false,
    result: null,
  },
  {
    id: 67,
    matchNumber: 67,
    venue: "Sawai Mansingh Stadium, Jaipur",
    date: "2025-05-16T14:00:00Z",
    team1: { id: 8 }, // RR
    team2: { id: 7 }, // PBKS
    completed: false,
    result: null,
  },
  {
    id: 68,
    matchNumber: 68,
    venue: "M Chinnaswamy Stadium, Bengaluru",
    date: "2025-05-17T14:00:00Z",
    team1: { id: 9 }, // RCB
    team2: { id: 4 }, // KKR
    completed: false,
    result: null,
  },
  {
    id: 69,
    matchNumber: 69,
    venue: "Narendra Modi Stadium, Ahmedabad",
    date: "2025-05-18T10:00:00Z",
    team1: { id: 3 }, // GT
    team2: { id: 1 }, // CSK
    completed: false,
    result: null,
  },
  {
    id: 70,
    matchNumber: 70,
    venue:
      "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
    date: "2025-05-18T14:00:00Z",
    team1: { id: 5 }, // LSG
    team2: { id: 10 }, // SRH
    completed: false,
    result: null,
  },
];
