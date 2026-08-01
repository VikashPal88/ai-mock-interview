
import { auth } from '@/auth'
import UserButton from '@/components/ui/UserButton'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const MenuOption = [
    {
        name: "Dashboard",
        path: "/dashboard"
    },
    {
        name: "Upgrade",
        path: "/upgrade"
    },
    {
        name: "How it works?",
        path: "/how-it-works"
    },
]

async function AppHeader() {
    const session = await auth()

    // console.log(session?.user.email)

    return (
        <nav className="flex w-full items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
            <Link href="/" className='flex items-center gap-2'>
                <Image src={'/logo.svg'} alt='logo' width={36} height={36} />
                <h1 className="text-lg font-bold md:text-xl">AI Mock Interview</h1>
            </Link>
            <div>
                <ul className='flex gap-5'>
                    {MenuOption.map((option, index) => (
                        <li key={index} className='text-lg hover:scale-105 transition-all cursor-pointer'>{option.name}</li>
                    ))}
                </ul>
            </div>

            <UserButton user={session?.user} />
        </nav>
    )
}

export default AppHeader
