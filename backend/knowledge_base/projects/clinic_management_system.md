# Clinic Management System

## Overview

The Clinic Management System is a healthcare management project that covers patient registration, appointment scheduling, consultations, lab requests, prescriptions, and billing. The resume describes it as a healthcare application with authentication, multiple roles, relational database design, Django REST Framework, and React interfaces.

## Problem

Healthcare operations require structured coordination across patient records, appointments, consultations, and billing. The system needs a reliable relational model and role-based access so doctors, reception staff, lab technicians, and pharmacists can work from a shared platform.

## Solution

The project provides a healthcare workflow platform built around relational data models and REST APIs. It supports patient management, appointment scheduling, consultation records, prescriptions, billing, and multiple user roles working on the same operational system.

## Main Features

- Authentication and role-based access
- Patient management
- Appointment scheduling
- Consultation workflows
- Lab requests
- Prescriptions
- Billing
- Multi-role healthcare operations

## User Roles

The project specifically includes multiple roles in the system, as described in the resume:

- Admin
- Receptionist
- Doctor
- Lab Technician
- Pharmacist

## Backend

The backend is built with:

- Python
- Django
- Django REST Framework

The project includes REST APIs for patient management, doctor consultations, appointment scheduling, billing, and authentication.

## Frontend

The frontend is built with React. The resume states that the project integrated role-based modules via React interfaces.

## REST APIs

The project includes Django REST Framework APIs for:

- Patient management
- Doctor consultations
- Appointment scheduling
- Billing
- Authentication
- Secure CRUD operations

## Database Design

The database design is explicitly described as relational and normalized. The system stores and connects data across:

- Patients
- Doctors
- Appointments
- Consultations
- Prescriptions
- Lab requests
- Billing
- Roles

The design uses primary and foreign keys and constraints to maintain referential integrity.

## Authentication

The project includes authentication and secure access for healthcare operations. The resume confirms that authentication was part of the system, and the workflow includes different roles with specific responsibilities.

## Main Workflows

The core workflows include:

- Patient registration
- Appointment booking and scheduling
- Consultation records
- Lab request management
- Prescription generation
- Billing and payments

## Billing

Billing is a core module in the healthcare management system. The resume specifically includes billing and payment-related processes as part of the project scope.

## Doctor Workflow

The doctor module was built end-to-end. The resume states that the project included:

- consultation workflows
- patient history access
- prescription generation

## Challenges / Design Decisions

The main technical challenge was coordinating a healthcare workflow with multiple roles and interrelated entities. The design decision was to use a normalized relational database so patient, consultation, lab, prescription, and billing records remained consistent and queryable across the application.

## Technologies

- Python
- Django
- Django REST Framework
- SQL
- React
- Relational database design

## Interview Explanation

"The Clinic Management System was a healthcare application built using Django, Django REST Framework, and React. It handled patient registration, appointments, consultations, lab requests, prescriptions, and billing in a single platform. I designed the relational data model around patients, doctors, appointments, and clinical records, and I implemented role-based access so doctors, reception staff, lab technicians, and pharmacists could work within the same system without losing data consistency."
