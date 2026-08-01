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
import axios from "axios"
import { Loader2Icon } from 'lucide-react'

function CreateInterviewDialog() {
    const [formData, setFormData] = useState<any>();
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

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
            const res = await axios.post("/api/generate-interview-questions", formData_)
            console.log("Success:", res.data)

            if (res?.data?.status == 429) {
                console.log(res?.data?.result)
                return;
            }

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