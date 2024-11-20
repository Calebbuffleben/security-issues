import express, { Request, Response } from "express";
import { users } from "./users";

const app = express();
const PORT = 3001;

app.use(express.json());

// Login endpoint
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Vulnerable: Comparing passwords without hashing
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.status(200).send("Login successful!");
  } else {
    res.status(401).send("Invalid credentials!");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Vulnerable server running at http://localhost:${PORT}`);
});
