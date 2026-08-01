import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { aj } from "@/lib/arcjet";
import { describe } from "zod/v4/core";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_URL_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_URL_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!
});

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const jobTitle = formData.get('jobTitle') as string | null;
        const jobDescription = formData.get('jobDescription') as string | null;

        const decision = await aj.protect(req, { userId: session.user.email ?? '', requested: 5 });
        console.log("Arcjet Decision", decision)

        // @ts-ignore
        if (decision?.reason?.remaining == 0) {
            return NextResponse.json({
                status: 429,
                result: "No free credit remaiining, Try again after 24 Hour"
            })
        }


        const isFilePresent = file && typeof file !== 'string' && (file as File).size > 0;

        if (isFilePresent) {
            // Mode 1: Resume Upload
            const pdfFile = file as File;
            const bytes = await pdfFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `upload-${Date.now()}.pdf`,
                isPrivateFile: false,
                useUniqueFileName: true,
            });

            // Call n8n Webhook with Resume URL
            const result = await axios.post("http://localhost:5678/webhook/generate-interview-question", {
                resumeURL: uploadResponse?.url,
                jobTitle: jobTitle || null,
                jobDescription: jobDescription || null
            });

            console.log("n8n response (resume mode):", result.data);

            const formattedQuestions = typeof result.data === 'object' ? JSON.stringify(result.data) : String(result.data || "");

            // Save Interview Session & Questions in Database
            const interviewSession = await prisma.interviewSession.create({
                data: {
                    userId: session.user.id,
                    resumeURL: uploadResponse.url,
                    jobTitle: jobTitle || null,
                    jobDescription: jobDescription || null,
                    interviewQuestions: formattedQuestions,
                    status: "COMPLETED"
                }
            });

            return NextResponse.json({
                success: true,
                interviewSession,
                questions: result.data
            }, { status: 200 });

        } else {
            // Mode 2: Job Description
            if (!jobTitle && !jobDescription) {
                return NextResponse.json({ error: "Please upload a resume or provide job details." }, { status: 400 });
            }

            // Call n8n Webhook with Job Title & Description
            const result = await axios.post("http://localhost:5678/webhook/generate-interview-question", {
                resumeURL: null,
                jobTitle: jobTitle,
                jobDescription: jobDescription
            });

            const formattedQuestions = typeof result.data === 'object' ? JSON.stringify(result.data) : String(result.data || "");

            // Save Interview Session & Questions in Database
            const interviewSession = await prisma.interviewSession.create({
                data: {
                    userId: session.user.id,
                    resumeURL: null,
                    jobTitle: jobTitle || null,
                    jobDescription: jobDescription || null,
                    interviewQuestions: formattedQuestions,
                    status: "COMPLETED"
                }
            });

            return NextResponse.json({
                success: true,
                interviewSession,
                questions: result.data
            }, { status: 200 });
        }

    } catch (error: any) {
        console.error("Upload / n8n Error: ", error?.response?.data || error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}