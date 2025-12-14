# Unified Civic Issue Detection & Grievance Redressal Platform (U-CIDGRP)

## Overview

U-CIDGRP is a full-stack web application designed to bridge the gap between citizens and civic authorities. It enables citizens to report visual civic issues (like potholes, garbage, broken streetlights) which are automatically analyzed by AI and routed to the correct department (PWD, Electricity, etc.).

## Key Features

### For Citizens

- **One-Click Reporting**: Upload a photo, and our Gemini AI integration automatically detects the issue type, severity, and department.
- **Real-Time Tracking**: Monitor the status of reported issues (Pending, Resolved).
- **Privacy**: Strict data isolation ensures you only see your own reports.

### For Authorities (Department Admins & Workers)

- **Role-Based Dashboards**:
  - **Super Admin**: City-wide health view with heatmaps and department performance analytics.
  - **Dept Admin**: Manages issues specific to their department (e.g., PWD Admin only sees PWD issues).
  - **Workers**: Receive assigned tasks on mobile-friendly dashboards for field resolution.
- **Department Filtering**: Strict backend logic ensures data segregation (e.g., Electricity workers never see Sanitation issues).
- **Geospatial Visualization**: Heatmaps and issue plotting using Google Maps integration.

### AI Integration

- **Automatic Classification**: Uses Google Gemini Pro Vision to analyze images.
- **Civic Assistant**: A chatbot that answers citizens' queries about civic laws and safety.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite, Zustand, Lucide React.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (with proper relational schema).
- **AI Services**: Google Gemini API (Visual & Text).
- **Deployment**:
  - Frontend: Vercel (Ready)
  - Backend/DB: Railway

## Setup & Demo

### Prerequisites

- Node.js v18+
- PostgreSQL Database
- Google Gemini API Key

### Installation

1.  **Clone & Install**

    ```bash
    git clone <repo-url>
    cd unified-civil-issue-detection-main
    npm install
    cd node
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the `node/` directory:

    ```env
    DATABASE_URL=postgresql://user:pass@localhost:5432/civic_db
    GEMINI_API_KEY=your_gemini_key
    JWT_SECRET=your_jwt_secret
    ```

3.  **Run Locally**
    - Start Backend: `cd node && npm start`
    - Start Frontend: `npm run dev`

### Demo Credentials (One-Click Access available on Login Page)

| Role                   | Email                         | Password      | Department  |
| :--------------------- | :---------------------------- | :------------ | :---------- |
| **Super Admin**        | `super@civic.com`             | `admin123`    | N/A         |
| **Citizen**            | `citizen@civic.com`           | `password123` | N/A         |
| **Electricity Admin**  | `electricity_admin@civic.com` | `admin123`    | Electricity |
| **PWD Admin**          | `pwd_admin@civic.com`         | `admin123`    | PWD         |
| **Electricity Worker** | `qqqq@gmail.com`              | `qqqq`        | Electricity |

## Deployment Guide

### Frontend (Vercel)

1.  Connect this repo to Vercel.
2.  Set Environment Variable: `VITE_API_URL` = `https://<your-railway-backend-url>`
3.  Deploy!

### Backend (Railway)

1.  Connect repo to Railway.
2.  Add PostgreSQL plugin.
3.  Set `GEMINI_API_KEY` and `JWT_SECRET` in variables.
4.  Deploy.
