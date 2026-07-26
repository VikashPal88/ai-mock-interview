import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import React from 'react'
import EmptyState from './EmptyState'
import CreateInterviewDialog from '@/app/(routes)/_components/CreateInterviewDialog';

async function Dashboard() {
    const session = await auth();
    const interviewList: any[] = []

    return (
        <div className='py-20 px-10 md:px-28 lg:px-44 xl:px-56 '>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='text-lg text-gray-500'>My Dashboard</h2>
                    <h2 className='text-2xl font-black'>Welcome, {session?.user?.name || session?.user?.username}</h2>
                </div>
                <CreateInterviewDialog />
            </div>

            {interviewList.length === 0 && <EmptyState />}
        </div>
    )
}

export default Dashboard
