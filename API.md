# AXIONSOFT SOLUTION — REST API SPECIFICATION

This document outlines all public and administrative route handlers.

---

## 1. Public Endpoints

### `POST /api/inquiries`
Submits a client project brief or commercial inquiry.
- **Rate Limit:** 5 requests per minute per IP.
- **Honeypot:** `website_trap` must be empty.
- **Request Body (JSON):**
  ```json
  {
    "fullName": "Sarah Connor",
    "businessEmail": "sarah@cyberdyne.io",
    "companyName": "Cyberdyne Systems",
    "phone": "+1 (555) 019-2834",
    "serviceRequired": "Cybersecurity & VAPT",
    "budget": "$50,000 – $100,000",
    "timeline": "1 – 3 months",
    "projectDescription": "Comprehensive defensive security audit of internal API gateway.",
    "consent": true,
    "website_trap": ""
  }
  ```
- **Responses:**
  - `201 Created`: `{ "success": true, "inquiryId": "cm..." }`
  - `400 Bad Request`: Validation failure.
  - `429 Too Many Requests`: Rate limit exceeded.

### `POST /api/careers/apply`
Submits an engineering job candidacy.
- **Request Body (JSON):**
  ```json
  {
    "fullName": "Alex Rivera",
    "email": "alex@systems.dev",
    "roleApplied": "Senior Distributed Systems Engineer",
    "portfolioUrl": "https://github.com/alexrivera",
    "resumeUrl": "https://drive.google.com/...",
    "coverNote": "Specialized in event-driven distributed state machines."
  }
  ```

---

## 2. Authentication Endpoints

### `POST /api/auth/login`
Authenticates an administrator and issues an HTTP-only session cookie.
- **Request Body:**
  ```json
  {
    "email": "admin@axiontech.in",
    "password": "Admin@Axion2026!"
  }
  ```
- **Response:** `200 OK` + `Set-Cookie: axion_admin_session=...; HttpOnly; SameSite=Lax; Path=/`

### `POST /api/auth/logout`
Clears session cookie and invalidates session.

### `GET /api/auth/me`
Returns current session payload.

---

## 3. Administrative CMS Endpoints

*All endpoints below require an active `axion_admin_session` cookie.*

| Endpoint | Method | Description |
|---|---|---|
| `/api/admin/settings` | `GET` | Retrieve all dynamic company settings |
| `/api/admin/settings` | `POST` | Upsert company name, tagline, email, locations, colors |
| `/api/admin/inquiries/[id]` | `PATCH` | Update status (`NEW`, `IN_REVIEW`, `CONTACTED`, `ARCHIVED`) and notes |
| `/api/admin/inquiries/[id]` | `DELETE` | Permanently delete inquiry |
| `/api/admin/projects` | `GET` | List all projects |
| `/api/admin/projects` | `POST` | Create new project case study |
| `/api/admin/projects` | `PATCH` | Toggle `isFeatured` or `isPublished` |
| `/api/admin/projects?id=:id`| `DELETE` | Delete project |
| `/api/admin/products` | `GET`, `POST`, `PATCH`, `DELETE` | CRUD for proprietary software assets |
| `/api/admin/services` | `GET`, `PATCH` | Update service descriptions and status |
| `/api/admin/blog` | `GET`, `POST`, `DELETE` | Publish and manage research articles |
| `/api/admin/careers` | `GET`, `PATCH` | Candidate application status reviews |
| `/api/admin/users` | `GET`, `POST` | Provision admin users and roles |
