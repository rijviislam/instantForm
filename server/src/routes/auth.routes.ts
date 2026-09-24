import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { UserService } from "../services/user.service";
import { registerSchema, loginSchema } from "../validations/auth.schema";
import { authenticate, AuthenticatedRequest } from "../middleware/auth.middleware";

const router = Router();

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || process.env.AUTH_SECRET || "default_fallback_secret";
};

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const normalizedEmail = validatedData.email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await UserService.findByEmail(normalizedEmail);

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "Email already registered",
        message: "An account with this email address already exists.",
      });
      return;
    }

    // Securely hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Create user in database (Prisma / Neon)
    const user = await UserService.create({
      name: validatedData.name.trim(),
      email: normalizedEmail,
      passwordHash: hashedPassword,
    });

    // Generate identity verification token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
        message: error.errors[0]?.message || "Invalid input data",
      });
      return;
    }

    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: "An error occurred during account creation. Please try again later.",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const normalizedEmail = validatedData.email.trim().toLowerCase();

    // Find user by email
    const user = await UserService.findByEmail(normalizedEmail);

    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        error: "Invalid credentials",
        message: "Invalid email or password",
      });
      return;
    }

    // Verify password against stored hash
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: "Invalid credentials",
        message: "Invalid email or password",
      });
      return;
    }

    // Generate identity verification token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: safeUser,
      token,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
        message: error.errors[0]?.message || "Invalid credentials format",
      });
      return;
    }

    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: "An unexpected error occurred during sign in. Please try again later.",
    });
  }
});

// POST /api/auth/oauth-sync
router.post("/oauth-sync", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, image, provider, providerAccountId } = req.body;

    if (!email || !provider || !providerAccountId) {
      res.status(400).json({
        success: false,
        error: "Missing fields",
        message: "Email, provider, and providerAccountId are required",
      });
      return;
    }

    const user = await UserService.findOrCreateOAuthUser({
      name,
      email: String(email).trim().toLowerCase(),
      image,
      provider,
      providerAccountId,
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "OAuth user synced successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("OAuth sync error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to sync OAuth user session",
    });
  }
});

// GET /api/auth/me (Protected Route)
router.get("/me", authenticate, (req: AuthenticatedRequest, res: Response): void => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
