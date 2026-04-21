export type DbData = {
  users: DbDataUser[];
  reports: DbDataReport[];
};

type DbDataUser = {
  id: string;
  email: string;
  password: string;
  isSignedIn: boolean;
};

export type DbDataReport = {
  id: string;
  make: string;
  model: string;
  year: string;
  mileage: string;
  longitude: number;
  latitude: number;
  price: number;
  approved: boolean;
};
