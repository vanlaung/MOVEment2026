import type {
  AuthAccount,
  Role,
  StationDefinition,
  StationStatus,
  Team,
} from "./types";

export const ROLE_LABELS: Record<Role, string> = {
  user: "User",
  admin: "Admin",
  "system-admin": "System Admin",
};

export const STATUS_ORDER: Record<StationStatus, number> = {
  "In Progress": 0,
  New: 1,
  Finish: 2,
};

export const DEFAULT_STATIONS: StationDefinition[] = [
  {id: "ST01", name: "Station 1", isEnable: true},
  {id: "ST02", name: "Station 2", isEnable: true},
  {id: "ST03", name: "Station 3", isEnable: true},
  {id: "ST04", name: "Station 4", isEnable: true},
  {id: "ST05", name: "Station 5", isEnable: true},
];

export const DEFAULT_AUTH_ACCOUNTS: AuthAccount[] = [
  {username: "admin", password: "admin", role: "admin"},
  {
    username: "systemadmin",
    password: "systemadmin",
    role: "system-admin",
  },
];

export const DEFAULT_TEAMS: Team[] = [
  {
    id: "TEAM01",
    name: "Team 1",
    username: "team01",
    password: "team01",
    score: 90,
    finish: 1,
    totalTimeMinutes: 24,
  },
  {
    id: "TEAM02",
    name: "Team 2",
    username: "team02",
    password: "team02",
    score: 180,
    finish: 2,
    totalTimeMinutes: 41,
  },
  {
    id: "TEAM03",
    name: "Team 3",
    username: "team03",
    password: "team03",
    score: 120,
    finish: 1,
    totalTimeMinutes: 28,
  },
  {
    id: "TEAM04",
    name: "Team 4",
    username: "team04",
    password: "team04",
    score: 60,
    finish: 1,
    totalTimeMinutes: 17,
  },
  {
    id: "TEAM05",
    name: "Team 5",
    username: "team05",
    password: "team05",
    score: 0,
    finish: 0,
    totalTimeMinutes: 0,
  },
  {
    id: "TEAM06",
    name: "Team 6",
    username: "team06",
    password: "team06",
    score: 210,
    finish: 2,
    totalTimeMinutes: 39,
  },
  {
    id: "TEAM07",
    name: "Team 7",
    username: "team07",
    password: "team07",
    score: 140,
    finish: 1,
    totalTimeMinutes: 31,
  },
  {
    id: "TEAM08",
    name: "Team 8",
    username: "team08",
    password: "team08",
    score: 75,
    finish: 1,
    totalTimeMinutes: 22,
  },
  {
    id: "TEAM09",
    name: "Team 9",
    username: "team09",
    password: "team09",
    score: 0,
    finish: 0,
    totalTimeMinutes: 0,
  },
  {
    id: "TEAM10",
    name: "Team 10",
    username: "team10",
    password: "team10",
    score: 160,
    finish: 2,
    totalTimeMinutes: 44,
  },
];
