import { z } from "zod"

export const userNameValidation = z
    .string()
    .min(3, "User name should have at least 3 character")
    .max(12, "User name should not exceed 12 character")
    .regex(/^[a-zA-Z0-9_]+$/, "User name is not valid")

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.email("Invailid email"),
    password: z.string().min(6, "Password must be 6 chsracter long")
})