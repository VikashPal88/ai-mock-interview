import { z } from "zod"

export const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username cannot exceed 20 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const signInSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Please enter your email or username" }),
  password: z
    .string()
    .min(1, { message: "Please enter your password" }),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
