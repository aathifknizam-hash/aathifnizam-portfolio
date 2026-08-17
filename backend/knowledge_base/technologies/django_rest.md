# Django REST Framework

## What it is

Django REST Framework is a Python framework for building REST APIs on top of Django. It provides serializers, viewsets, authentication integration, and structured API endpoints.

## Why Aathif used it

Aathif used Django REST Framework in the Smart Service Desk project and the Healthcare Management System project described in the resume. The API layer needed to support authentication, CRUD operations, role-aware workflows, and database-backed endpoints.

## Where it was used

- Smart Service Desk (`rag-powered-helpdesk`)
- Healthcare Management System (resume-based project)

## How it was implemented

The Smart Service Desk repository includes Django app modules for authentication, tickets, knowledge base, admin panel, and AI services. The project configures DRF and JWT authentication for API access. The Healthcare Management System project uses DRF to expose patient, appointment, consultation, billing, and authentication endpoints.

## Components

- DRF API views and routers
- Serializers
- Django models and database integration
- JWT authentication
- REST endpoints for project workflows

## Interview Explanation

"Django REST Framework was a natural fit for service desk and healthcare workflow projects because it gives a clean way to build authenticated CRUD APIs on top of Django models. I used it for patient and ticket-related workflows, role-aware operations, and secure backend services."
