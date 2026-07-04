export type Role = "user" | "admin" | "system-admin";

export type ManagementRole = Exclude<Role, "user">;

export type StationStatus = "New" | "In Progress" | "Finish";

export type Session = {
  username: string;
  role: Role;
  teamId: string | null;
};

export type AuthAccount = {
  username: string;
  password: string;
  role: ManagementRole;
};

export type Team = {
  id: string;
  name: string;
  username: string;
  password: string;
  score: number;
  finish: number;
  totalTimeMinutes: number;
};

export type StationDefinition = {
  id: string;
  name: string;
  isEnable: boolean;
};

export type TeamStation = {
  id: string;
  name: string;
  isEnable: boolean;
  status: StationStatus;
  score: number;
  startTime: string | null;
  endTime: string | null;
  teamId: string;
  stationId: string;
};

export type StationFormValues = {
  id: string;
  name: string;
  isEnable: boolean;
};

export type TeamFormValues = {
  id: string;
  name: string;
  username: string;
  password: string;
  score: number;
  finish: number;
  totalTimeMinutes: number;
};

export type LocalDatabaseSeed = {
  activeTeamId?: string;
  teams?: Team[];
  authAccounts?: AuthAccount[];
  stationDefinitions?: StationDefinition[];
  teamStations?: Record<string, TeamStation[]>;
};

export type LocalDatabase = {
  activeTeamId: string;
  teams: Team[];
  authAccounts: AuthAccount[];
  stationDefinitions: StationDefinition[];
  teamStations: Record<string, TeamStation[]>;
};

export type MovementStore = {
  session: Session | null;
  activeTeamId: string;
  teams: Team[];
  authAccounts: AuthAccount[];
  stationDefinitions: StationDefinition[];
  teamStations: Record<string, TeamStation[]>;
  loadDatabase: (seed: LocalDatabaseSeed) => void;
  login: (session: Session) => void;
  logout: () => void;
  setActiveTeam: (teamId: string) => void;
  startStation: (teamId: string, stationId: string) => void;
  finishStation: (teamId: string, stationId: string, score: number) => void;
  resetStation: (teamId: string, stationId: string) => void;
  patchTeamStation: (
    teamId: string,
    stationId: string,
    patch: Partial<TeamStation>,
  ) => void;
  deleteStationDefinition: (stationId: string) => void;
  saveStationDefinition: (
    values: StationFormValues,
    editingId?: string,
  ) => void;
  deleteTeam: (teamId: string) => void;
  saveTeam: (values: TeamFormValues, editingId?: string) => void;
};
