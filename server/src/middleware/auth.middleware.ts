import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/user.service";

export interface AuthenticatedUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

interface JwtPayload {
  userId: string;
  email: string;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Missing or invalid authorization token",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET || "default_fallback_secret";

    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (!decoded || !decoded.userId) {
      res.status(401).json({
        success: false,
        error: "Invalid token",
        message: "Token payload is invalid",
      });
      return;
    }

    let user = await UserService.findById(decoded.userId);

    if (!user && decoded.email) {
      user = await UserService.ensureUser({
        id: decoded.userId,
        email: decoded.email,
      });
    }

    if (!user) {
      res.status(401).json({
        success: false,
        error: "User not found",
        message: "The authenticated user account no longer exists",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: "Invalid or expired token",
        message: "Your session has expired. Please sign in again.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Authentication error",
      message: "An error occurred during authentication verification",
    });
  }
}
