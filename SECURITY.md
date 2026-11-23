# AXIONSOFT SOLUTION — SECURITY ARCHITECTURE & POLICIES

Axion Technologies adheres to rigorous defensive software engineering practices.

---

## 1. Defensive Architecture Safeguards

1. **Authentication & Session Hardening:**
   - Password hashing with `bcryptjs` and 10 salt rounds.
   - JWT tokens signed with SHA-256 HMAC using `jose`.
   - Admin sessions delivered exclusively via `HttpOnly`, `SameSite=Lax`, and `Secure` cookies.
   - Server-side route authorization via `src/middleware.ts` preventing client-side bypass.

2. **Input Validation & Sanitization:**
   - Strict `zod` schema enforcement on every incoming HTTP API route handler.
   - In-memory sliding-window IP rate limiting on public inquiry forms.
   - Automated honeypot traps (`website_trap`) filtering automated bot submissions.

3. **Protection Against Common Attack Vectors:**
   - **XSS:** React auto-escaping and JSX attribute sanitation.
   - **SQL Injection:** 100% parameterized database queries via Prisma ORM.
   - **BOLA / IDOR:** Administrative session checks verification on all mutating endpoints.
   - **CSRF:** Strict SameSite cookie policy and CORS origin enforcement.

4. **Defensive Cybersecurity Service Policy:**
   - All cybersecurity services offered by Axion Technologies describe authorized defensive assessments, VAPT, vulnerability audits, and secure coding practices.
   - Axion strictly adheres to formal bilateral rules of engagement and ethical disclosure standards.

---

## 2. Security Headers (Nginx / Edge)

```http
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

## 3. Vulnerability Reporting

To report a vulnerability in Axion Technologies infrastructure, contact our defensive team at:
`security@axiontech.in`
