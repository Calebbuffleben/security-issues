import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authenticate } from "./auth";

const app = express();
const PORT = 3000;
const SECRET_KEY = "insecuresecret"; // Vulnerable: Hardcoded secret

app.use(express.json());

// Login route
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = authenticate(username, password);

    // Vulnerable: Generating a token with the role encoded directly
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);

    res.status(200).json({ token });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

// Admin-only route
app.get("/admin", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Authorization header missing");
  }

  try {
    // Vulnerable: Trusting the token without verifying the role correctly
    const decoded = jwt.verify(authHeader.split(" ")[1], SECRET_KEY) as any;

    if (decoded.role !== "admin") {
      return res.status(403).send("Access denied");
    }

    res.status(200).send("Welcome, Admin!");
  } catch (error) {
    res.status(403).send("Invalid token");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
