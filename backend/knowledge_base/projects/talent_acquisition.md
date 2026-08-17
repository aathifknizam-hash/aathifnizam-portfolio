# Talent Acquisition

## Overview

Talent Acquisition is a resume-processing and candidate-ranking system built with Django and a React frontend. The repository structure shows a hiring workflow where resumes are uploaded, parsed, scored against job requirements, and ranked for recruiter review.

## Problem

Recruitment teams need to process many resumes and compare candidates against a job description efficiently. Manually reviewing every resume is slow and inconsistent, especially when role requirements and candidate skills vary.

## Solution

The project automates the early stages of hiring. It accepts resume uploads, extracts resume data, stores structured candidate profiles, and scores candidates against job descriptions based on skill match, experience, education, and project relevance.

## Key Features

- Bulk resume upload
- Resume parsing and processing
- Candidate profile extraction
- Job model and requirement tracking
- Candidate scoring and ranking
- Recruiter feedback and shortlist decisions
- Dashboard views for jobs and rankings

## Architecture

The repository includes a Django backend with application modules for:

- `jobs/` for job definitions and hiring requirements
- `candidates/` for candidate profile and resume-linked data
- `resumes/` for resume upload and parsing tasks
- `ranking/` for scoring and ranking output
- `ai_pipeline/` for embedding and ranking logic

The frontend includes dashboard pages such as:

- `Dashboard.jsx`
- `Jobs.jsx`
- `Rankings.jsx`
- `Upload.jsx`
- `CandidateDetail.jsx`

## Frontend

The frontend is a Vite-based React application with pages for uploading resumes, reviewing jobs, and looking at ranked candidates.

## Backend

The backend is built with Django and Django REST Framework. It includes APIs for resume upload, stats, re-parsing, ranking results, and candidate/job workflows.

## Database

The repository uses Django models for `Job`, `Resume`, `CandidateProfile`, `RankingResult`, and recruiting feedback. The code shows relational data structures for jobs, resumes, and candidate matching decisions.

## AI / RAG

This project uses AI-driven resume parsing and candidate matching rather than a document-based RAG flow. The repository includes `ai_pipeline/` modules for extractor, embeddings, parser, and ranker logic, and the ranking formula is explicitly defined in the project code.

## APIs

The backend exposes Django REST endpoints for:

- resume upload
- stats summaries
- candidate ranking results
- job and candidate management
- re-parsing actions

## Authentication

No authentication system is described in the repository structure.

## Workflow

1. Recruiter uploads resumes.
2. The backend validates file type, deduplicates uploads, and queues parsing.
3. Resume content is extracted and structured into candidate profiles.
4. Candidate skills and experience are matched to a job profile.
5. The ranking engine scores the candidate against weighted factors.
6. Recruiters review rankings and provide feedback.

## Technologies

- Python
- Django
- Django REST Framework
- React
- Vite
- SQL / Django models
- AI parsing and ranking logic

## Challenges

The biggest challenge is converting messy resume text into structured candidate profiles and then comparing those profiles to job requirements in a fair and explainable way. The repository includes logic to normalize candidate names, parse skills, and calculate weighted rankings.

## Design Decisions

- Keep resume parsing and ranking as separate backend tasks.
- Use Django models to store structured candidate metadata and recruiter decisions.
- Score candidates through weighted criteria instead of a single keyword match.
- Use a dashboard-driven workflow so recruiters can review results quickly.

## Interview Explanation

"Talent Acquisition is a resume-ranking platform I built to automate the first stage of recruitment. The system uploads resumes, extracts candidate information, matches it against a job description, and produces a ranked shortlist. I used Django for the backend, React for the dashboard, and AI-driven parsing to make the workflow faster and more consistent for recruiters."
