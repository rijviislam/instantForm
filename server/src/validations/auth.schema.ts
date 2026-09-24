import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Full name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(60, { message: "Name must be less than 60 characters" }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
