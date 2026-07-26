import CreateInterviewDialog from '@/app/(routes)/_components/CreateInterviewDialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

function EmptyState() {
    return (
        <div className='mt-14 flex flex-col items-center gap-5  border-dashed p-10 border-4 rounded-2xl bg-gray-50'>
            <Image src={"/interview.svg"} alt='emptystate' width={130} height={130} />
            <h2 className='mt-2 text-lg text-gray-500'>
                You don not have any Interview created
            </h2>
            <CreateInterviewDialog />
        </div>
    )
}

export default EmptyState