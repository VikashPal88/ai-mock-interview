"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import mockData from "@/lib/mockInterviewData.json"

type InterviewData = {
    jobTitle: string | null
    jobDescription: string | null,
    interviewQuestions: InterviewQuestions[],
    userId: string | null,
    id: string,
}

type InterviewQuestions = {
    answer: string,
    question: string
}

function StartInterview() {
    const { interviewId } = useParams()
    const [interviewData, setInterviewData] = useState<InterviewData>()


    console.log("interviewData", interviewData)

    const GetInterviewQuestion = (resData) => {
        setInterviewData({
            jobTitle: resData.interviewSession.jobTitle,
            jobDescription: resData.interviewSession.jobDescription,
            interviewQuestions: resData.questions.interview_questions,
            userId: resData.interviewSession.userId,
            id: resData.interviewSession.id,
        })
    }

    useEffect(() => {
        const resData = mockData;
        GetInterviewQuestion(resData)
    }, [interviewId])

    return (
        <div>StartInterview</div>
    )
}

export default StartInterview