import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export async function Header() {
  const session = await auth()

  return (
    <nav className="flex w-full items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
      <Link href="/" className="flex items-center gap-3">
        <Image src={'/logo.svg'} alt='logo' width={36} height={36} />
        <h1 className="text-lg font-bold md:text-xl">AI Mock Interview</h1>
      </Link>

      <div className="flex items-center gap-3">
        {session?.user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              Welcome, <span className="font-semibold text-purple-500">{session.user.name || session.user.username}</span>
            </span>
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/sign-in" })
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}