"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import ResumeUpload from './ResumeUpload'
import JobDescription from './JobDescription'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import mockData from "@/lib/mockInterviewData.json"
import { toast } from 'sonner'

function CreateInterviewDialog() {
    const [formData, setFormData] = useState<any>();
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onHandleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }))
    }

    const onSubmit = async () => {
        setLoading(true)
        const formData_ = new FormData();

        if (file) {
            formData_.append('file', file)
        }
        if (formData?.jobTitle) {
            formData_.append('jobTitle', formData.jobTitle)
        }
        if (formData?.jobDescription) {
            formData_.append('jobDescription', formData.jobDescription)
        }

        try {
            // COMMENTED OUT ORIGINAL API CALL FOR DEVELOPMENT
            // const res = await axios.post("/api/generate-interview-questions", formData_)
            // console.log("Success:", res.data)

            // USING MOCK JSON DATA
            const resData = mockData;
            console.log("Mock Data:", resData);

            if ((resData as any)?.status == 429) {
                console.log((resData as any)?.result)
                // toast.warning(res)
                return;
            }

            router.push(`/interview/${resData?.interviewSession?.id}`)

        } catch (e) {
            console.error("Error submitting interview:", e)
        } finally {
            setLoading(false)
        }
    }

    const isSubmitDisabled = loading || (!file && !formData?.jobTitle)

    return (
        <Dialog>
            <DialogTrigger render={<Button>+ Create Interview</Button>} />
            <DialogContent className={"min-w-3xl"}>
                <DialogHeader>
                    <DialogTitle>Please submit following details.</DialogTitle>
                    <DialogDescription>
                        Upload your resume or enter job description details below.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="resume-upload" className="w-full mt-2">
                    <TabsList>
                        <TabsTrigger value="resume-upload">Resume Upload</TabsTrigger>
                        <TabsTrigger value="job-description">Job Description</TabsTrigger>
                    </TabsList>
                    <TabsContent value="resume-upload">
                        <ResumeUpload setFiles={(f: File) => setFile(f)} />
                    </TabsContent>
                    <TabsContent value="job-description">
                        <JobDescription onHandleInputChange={onHandleInputChange} />
                    </TabsContent>
                </Tabs>

                <DialogFooter className='flex gap-6'>
                    <DialogClose render={<Button variant={'ghost'}>Cancel</Button>} />
                    <Button onClick={onSubmit} disabled={isSubmitDisabled}>
                        {loading && <Loader2Icon className='animate-spin' />} Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateInterviewDialog