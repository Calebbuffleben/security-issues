import { users, User } from "./users";
import bcrypt from "bcrypt";

export function authenticate(username: string, password: string): User {
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error("Invalid credentials");
  }

  return { id: user.id, username: user.username, password: user.password, role: user.role };
}