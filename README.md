# Paperglow — Multi-Tenant Business SaaS Platform

Paperglow is a production-grade multi-tenant SaaS application running on **PHP 8.3**, **Laravel 11**, **Blade**, **Livewire**, **Alpine.js**, **Tailwind CSS**, and **MariaDB / MySQL**, purpose-built for deployment on **Shujaa Host DirectAdmin**.

## Technology Stack

- **Backend Runtime**: PHP 8.3+ (Engineered for DirectAdmin cPanel / Apache)
- **Framework**: Laravel 11 with Eloquent Multi-Tenancy
- **Frontend / Templating**: Laravel Blade, Livewire, Alpine.js, Tailwind CSS
- **Database Engine**: MariaDB 10.5+ / MySQL 8.0+
- **Production Persistence**: Pure database storage with strict `organization_id` scoping
- **Zero Node.js in Production**: No Node.js runtime, Vite server, or npm required to run on DirectAdmin.

## Core Multi-Tenant Platform Modules

1. **Authentication & Session Management**:
   - Organization registration, user logins, secure password hashing, and session management.
   - Default administrator: `admin@paperglow.co.ke` / `Paperglow@2026`.
2. **Workspaces & Multi-Tenancy**:
   - Organization creation, tenant switching, role-based access control (`owner`, `admin`, `manager`, `member`, `auditor`).
   - Server-side data isolation via `TenantScope` and `BelongsToOrganization` Eloquent trait.
3. **SaaS Application Catalog & Subscriptions**:
   - 14 business applications with modular subscription states, monthly KES pricing, and active status toggling.
4. **Notifications**:
   - In-app notification center with category tagging, read/unread states, and bulk actions.
5. **Immutable Audit Trails**:
   - Automatic activity logging across all modules with actor ID, IP address, and change details.

## Integrated SaaS Applications

1. **Business Manager & Invoices**: Electronic invoices, quotations, VAT (16%), customers directory, expenses vouchers, and sales ledgers.
2. **Property Manager**: Multi-property estates, units, tenant leasing, and M-Pesa rent collections.
3. **Pharmacy Manager**: PPB-compliant dispensary POS, medicine inventory, batch numbers, and prescription sales.
4. **Chama & Sacco Manager**: Community groups, monthly merry-go-round savings, welfare contributions, and micro-loans.
5. **Ticketing & Helpdesk**: Customer support ticket tracking, priority tiers, staff assignment, and status updates.
6. **Booking & Appointments**: Client consultation scheduling, calendar slots, and deposit payments.
7. **Stock & Inventory**: Warehouse inventory, SKUs, barcode tracking, min/max thresholds, and stock adjustments.
8. **Legal Practice Manager**: Advocate case diaries, court forum schedules, client matters, and fee billing.
9. **School & Academy Manager**: Student enrollment, CBC grade rosters, parent contacts, and fee balances.
10. **Clinic & OPD Manager**: Outpatient triage, patient medical records, clinical notes, and consultations.
11. **Team & Workforce**: Staff directory and organizational role hierarchy.
12. **Contracts & Agreements**: Commercial agreements and compliance files.

## DirectAdmin Deployment

See detailed step-by-step instructions in [DIRECTADMIN_DEPLOYMENT.md](DIRECTADMIN_DEPLOYMENT.md).
Database schema available at `database/paperglow_directadmin_mysql_schema.sql`.
