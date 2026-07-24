"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signUpSchema, SignUpInput } from "@/lib/validations/auth"

export async function registerUser(data: SignUpInput) {
  try {
    const validatedFields = signUpSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.issues[0]?.message || "Invalid input data.",
      }
    }

    const { name, username, email, password } = validatedFields.data
    const normalizedEmail = email.toLowerCase().trim()
    const normalizedUsername = username.toLowerCase().trim()

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingEmail) {
      return {
        success: false,
        error: "An account with this email address already exists.",
      }
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: normalizedUsername },
    })

    if (existingUsername) {
      return {
        success: false,
        error: "This username is already taken. Please choose another one.",
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user in database
    await prisma.user.create({
      data: {
        name: name.trim(),
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
      },
    })

    return {
      success: true,
      message: "Account created successfully! You can now sign in.",
    }
  } catch (err: any) {
    console.error("Registration error:", err)
    return {
      success: false,
      error: "Something went wrong during registration. Please try again.",
    }
  }
}
