import bcrypt from "bcrypt";

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

export const users: User[] = [
  { id: 1, username: "admin", password: bcrypt.hashSync("password123", 10), role: "admin" },
  { id: 2, username: "user", password: bcrypt.hashSync("userpassword", 10), role: "user" }
];