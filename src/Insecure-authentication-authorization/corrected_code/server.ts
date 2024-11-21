import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authenticate } from "./auth";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.SECRET_KEY || "secure-secret-key";

app.use(express.json());

// Middleware for JWT verification
function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET_KEY) as { id: number; role: string };
    req.user = payload;
    next();
  } catch (error) {
    res.status(403).send("Invalid or expired token");
  }
}

// Middleware for role-based authorization
function authorizeRole(role: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user || user.role !== role) {
      return res.status(403).send("Access denied");
    }
    next();
  };
}

// Login route
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = authenticate(username, password);

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

// Admin-only route
app.get("/admin", authenticateToken, authorizeRole("admin"), (req: Request, res: Response) => {
  res.status(200).send("Welcome, Admin!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
