# EduGraphix Lab Security Specification

## Data Invariants
- Leads can only be created by the public. Admins can read, update, and delete them.
- Digital Audits can only be created by the public (associated with a lead). Admins can manage them.
- Contact Messages can only be created by the public. Admins can manage them.
- Services, Portfolio, and Insights are managed by Admins. Public can only read active/published items.
- Admins are defined by their UID being present in an `admins` collection or by a specific email (bootstrapped).

## The Dirty Dozen Payloads

1. **Identity Spoofing (Lead)**: Public user tries to update a lead's status to 'converted' without authorization.
2. **Resource Poisoning (Audit)**: User tries to inject a massive string (1MB) as an institution name in an audit.
3. **State Shortcutting (Lead)**: User tries to create a lead with status 'converted' directly.
4. **Unauthorized Read (Leads)**: Non-admin user tries to list all leads.
5. **PII Leak (Contact)**: Non-admin user tries to read a specific contact message by ID.
6. **Bypassing Required Fields (Lead)**: User tries to create a lead without a phone number.
7. **Invalid Enum (Lead)**: User tries to set lead status to 'invalid_status'.
8. **Unauthorized Write (Services)**: Non-admin tries to create a new service.
9. **Audit Manipulation**: User tries to set their own totalScore to 100 without answering questions correctly.
10. **Timestamp Fraud**: User tries to provide a backdated `createdAt` timestamp.
11. **Admin Escalation**: User tries to create a document in the `admins` collection.
12. **Bulk Delete**: Non-admin tries to delete the entire `leads` collection.

## Test Strategy
- Verify public can create leads/audits/messages.
- Verify public cannot read leads/audits/messages.
- Verify admin can manage everything.
- Verify data validation (schema, types, enums).
- Verify immutability of certain fields (createdAt).
