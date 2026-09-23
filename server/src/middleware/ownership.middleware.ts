import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { prisma } from "../db";

/**
 * Authorization middleware foundation:
 * Verifies that the authenticated user actually owns the specified Form resource.
 * The backend NEVER trusts a client-supplied userId or ownerId parameter.
 */
export async function requireFormOwnership(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authenticatedUser = req.user;
    if (!authenticatedUser) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "You must be logged in to perform this action",
      });
      return;
    }

    const rawFormId = req.params.formId || req.params.id;
    if (!rawFormId) {
      res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Resource ID parameter is missing",
      });
      return;
    }

    const formId = Array.isArray(rawFormId) ? rawFormId[0] : rawFormId;

    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { id: true, userId: true },
    });

    if (!form) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Requested form resource was not found",
      });
      return;
    }

    // Ownership check: resource.userId MUST match verified req.user.id
    if (form.userId !== authenticatedUser.id) {
      res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission to access or modify this resource",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Authorization error",
      message: "An error occurred while verifying resource authorization",
    });
  }
}
