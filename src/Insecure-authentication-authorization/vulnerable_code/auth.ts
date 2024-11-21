import { users } from "./users";

export function authenticate(username: string, password: string) {
  // Vulnerable: No hashing, plain-text password comparison
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  return { id: user.id, username: user.username, role: user.role };
}
