# PRAGATI-AI Security, Authentication & Password Handling Guide

## 1. Password Architecture Overview
In **PRAGATI-AI**, password security follows industry enterprise standards (NIST SP 800-63B guidelines):
- **Zero Plaintext Storage**: Plaintext passwords are NEVER written to the database or SQL scripts.
- **Cryptographic Hashing**: Passwords in the `users` table are stored using **Bcrypt with a Cost Factor of 12** (`$2b$12$...`).
- **One-Way Salted Hashes**: Bcrypt automatically generates a cryptographically secure 128-bit per-user salt and embeds it directly into the resulting 60-character hash string.

---

## 2. Seed Demo User Accounts & Passwords
For Phase 1 demonstration and evaluation in MySQL Workbench / API testing, 6 sample accounts with pre-computed Bcrypt hashes have been provisioned in `04_insert_master_data.sql`.

### Default Demo Password:
```
Pragati@2026!Secured
```

### Pre-configured User Matrix:
| User ID | Full Name | Email Address | Assigned Role | Ministry Scoping | Password (Plaintext for Demo) |
|---|---|---|---|---|---|
| `1` | Dr. Rajiv Kumar | `admin.rajiv@pragati.gov.in` | `ADMIN` | Central / All Ministries | `Pragati@2026!Secured` |
| `2` | Ananya Sharma | `monitoring.ananya@mospi.gov.in` | `MONITORING_OFFICER` | Central IPMD / All | `Pragati@2026!Secured` |
| `3` | Vikram Malhotra | `officer.vikram@morth.gov.in` | `MINISTRY_OFFICER` | Ministry of Road Transport (1) | `Pragati@2026!Secured` |
| `4` | Pooja Iyer | `officer.pooja@railways.gov.in` | `MINISTRY_OFFICER` | Ministry of Railways (2) | `Pragati@2026!Secured` |
| `5` | Siddharth Roy | `analyst.siddharth@pragati.gov.in` | `ANALYST` | Multi-Sector Analytics | `Pragati@2026!Secured` |
| `6` | Sunita Deshmukh | `viewer.sunita@pmo.gov.in` | `VIEWER` | Executive Read-Only View | `Pragati@2026!Secured` |

---

## 3. How Password Verification Works in Phase 2 (Node.js / Express)
When integrating the Node.js backend in Phase 2, use `bcryptjs` or `bcrypt` as follows:

```javascript
// Example Node.js Authentication Verification
const bcrypt = require('bcryptjs');
const db = require('./db');

async function loginUser(email, plainPassword) {
    // 1. Fetch user by email using parameterized prepared statement
    const [rows] = await db.execute(
        'SELECT user_id, full_name, email, password_hash, role, ministry_id, is_active FROM users WHERE email = ?',
        [email]
    );

    if (rows.length === 0) {
        throw new Error('Invalid email or password');
    }

    const user = rows[0];

    if (!user.is_active) {
        throw new Error('User account has been deactivated');
    }

    // 2. Compare plain password with stored bcrypt hash
    const isMatch = await bcrypt.compare(plainPassword, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // 3. Issue JWT Token (with role and ministry scope)
    return user;
}
```

---

## 4. How to Generate New Password Hashes
To add new administrative users or change existing passwords, use the Node.js helper snippet below:

```javascript
// Generate a new bcrypt hash with Cost 12
const bcrypt = require('bcryptjs');

async function hashNewPassword(newPassword) {
    const saltRounds = 12;
    const hash = await bcrypt.hash(newPassword, saltRounds);
    console.log('Bcrypt Hash:', hash);
    return hash;
}

hashNewPassword('YourNewSecureGovPassword#2026');
```

Then update in MySQL Workbench:
```sql
UPDATE users 
SET password_hash = '$2b$12$...' 
WHERE email = 'admin.rajiv@pragati.gov.in';
```

---

## 5. Security & Threat Mitigation Checklist
1. **SQL Injection Prevention**: All queries in backend services MUST use parameterized prepared statements (`?` placeholders with `mysql2/promise`).
2. **Role-Based Authorization (RBAC)**: Backend middleware will enforce endpoint permissions based on `users.role` and `users.ministry_id`.
3. **Audit Trail**: Every critical action (status updates, manual risk overrides, alert acknowledgments) is logged to `audit_logs` with the actor's `user_id` and IP address.
4. **Environment Isolation**: Database connection credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) must reside strictly in `.env` files and never be committed to source repositories.
