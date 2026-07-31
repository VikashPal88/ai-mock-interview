# 🤖 AI Mock Interview Platform

An end-to-end, AI-powered mock interview prep platform built with **Next.js 16 (App Router)**, **n8n Automation Engine**, **Prisma v7 ORM**, **PostgreSQL**, **NextAuth v5**, and **ImageKit**. Users can upload their resumes or job descriptions to automatically generate tailored interview questions and practice mock interviews.

---

## 🏗️ Application Architecture

```
                               ┌─────────────────────────┐
                               │       User Client       │
                               │   (Next.js 16 App)      │
                               └────────────┬────────────┘
                                            │ Upload PDF / Form
                                            ▼
                               ┌─────────────────────────┐
                               │   Next.js API Route     │
                               │ (/api/generate-interview)│
                               └──────┬───────────┬──────┘
                                      │           │
                 Upload PDF           │           │ Post Resume URL
                 (ArrayBuffer)        │           │ (JSON Payload)
                                      ▼           ▼
                         ┌────────────────┐   ┌─────────────────────────┐
                         │   ImageKit     │   │   n8n Workflow Engine   │
                         │ (Cloud Storage)│   │ (Docker / Webhook Port) │
                         └────────────────┘   └───────────┬─────────────┘
                                                          │ AI Processing &
                                                          │ Question Generation
                                                          ▼
                         ┌──────────────────────────────────────────────┐
                         │           PostgreSQL Database                │
                         │ (User & InterviewSession via Prisma ORM v7)  │
                         └──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Authentication**: NextAuth.js v5 (JWT Strategy, Credentials Provider with bcryptjs)
- **Database & ORM**: PostgreSQL & Prisma ORM v7 (`@prisma/client`, `@prisma/adapter-pg`)
- **AI Automation Engine**: n8n (Docker container)
- **Asset Storage**: ImageKit.io (PDF Resume hosting)
- **Styling & UI**: Tailwind CSS v4, Base UI / Radix UI, Lucide Icons, Framer Motion
- **HTTP Client**: Axios
- **Containerization**: Docker

---

## 🚀 Quick Start & Local Setup

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.x` or `>=22.16`
- **npm**: `v10.x` or higher
- **Docker Desktop**: Installed and running
- **Git**

---

### Step 1: Clone the Repository & Install Dependencies

```bash
git clone https://github.com/VikashPal88/ai-mock-interview.git
cd ai-mock-interview
npm install
```

---

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory and add your credentials:

```env
# NextAuth Configuration
AUTH_SECRET="your-super-secret-key"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Database Connection (Supabase / PostgreSQL)
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# ImageKit Storage Keys
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_imagekit_id"
IMAGEKIT_URL_PUBLIC_KEY="public_..."
IMAGEKIT_URL_PRIVATE_KEY="private_..."
```

---

### Step 3: Run n8n Engine via Docker

Launch n8n using Docker to process AI mock interview workflows:

```bash
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

- Open n8n in your browser: `http://localhost:5678`
- Create a Webhook trigger node with HTTP Method **POST** and Path `generate-interview-question`.
- Target Webhook URL: `http://localhost:5678/webhook/generate-interview-question`

---

### Step 4: Setup Database with Prisma

Generate the Prisma Client and push the database schema to your PostgreSQL database:

```bash
# Generate Prisma Client
npx prisma generate

# Push Schema to PostgreSQL Database
npx prisma db push
```

---

### Step 5: Start the Development Server

Launch the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Directory Structure

```text
ai-mock-interview/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (routes)/
│   │   ├── _components/
│   │   │   ├── CreateInterviewDialog.tsx
│   │   │   ├── JobDescription.tsx
│   │   │   └── ResumeUpload.tsx
│   │   └── dashboard/
│   ├── api/
│   │   └── generate-interview-questions/
│   │       └── route.ts
│   └── layout.tsx
├── components/
│   └── ui/
├── lib/
│   ├── auth.ts
│   └── prisma.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── prisma.config.ts
├── public/
├── .env
├── Dockerfile
├── package.json
└── README.md
```

---

## 📜 Available NPM Commands

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js development server |
| `npm run build` | Builds the production application |
| `npm run start` | Starts the production server |
| `npx prisma generate` | Generates the Prisma Client |
| `npx prisma db push` | Syncs schema with PostgreSQL DB |
| `npx prisma studio` | Opens interactive Prisma GUI for database |

---

## 🔒 License

Distributed under the MIT License. See `LICENSE` for more information.
