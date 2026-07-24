import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signInSchema } from "@/lib/validations/auth"
import { authConfig } from "@/auth.config"

declare module "next-auth" {
  interface User {
    username?: string | null
  }
  interface Session {
    user: {
      id?: string
      username?: string | null
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  interface JWT {
    id?: string
    username?: string | null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = signInSchema.safeParse(credentials)

        if (!validatedFields.success) {
          return null
        }

        const { identifier, password } = validatedFields.data

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier.toLowerCase() },
              { username: identifier.toLowerCase() },
            ],
          },
        })

        if (!user || !user.password) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (!passwordsMatch) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        }
      },
    }),
  ],
})
