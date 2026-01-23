export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  expiresIn: number;
};

