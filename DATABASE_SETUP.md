# Database + Backend Setup (MySQL)

This project now includes a Node.js/Express API connected to MySQL for registration, login, password reset, profile/session validation and logout.

## 1. Requirements

Install:
- Node.js 18+ (Node 20 is fine)
- MySQL 8.x
- VS Code + Live Server extension (recommended for the frontend)

## 2. Create the MySQL database

Open MySQL Workbench and run:

```sql
SOURCE path/to/MCAProjectTeam/server/database/schema.sql;
```

Or open `server/database/schema.sql` in Workbench and execute the entire file.

Database created: `mca_project_team`

Main authentication table: `users`

## 3. Configure backend environment

Open a terminal inside `server`:

```bash
cd server
```

Copy `.env.example` to `.env`.

Windows CMD:

```cmd
copy .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and put your actual MySQL password:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=mca_project_team
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_ORIGIN=http://127.0.0.1:5500,http://localhost:5500
```

## 4. Install backend packages

Inside `server`:

```bash
npm install
```

## 5. Start backend

```bash
npm run dev
```

Expected:

```text
MCA Project Team API running at http://localhost:5000
```

Test in browser:

```text
http://localhost:5000/api/health
```

Expected response when MySQL is connected:

```json
{"success":true,"message":"API and MySQL are connected."}
```

## 6. Start frontend

Do not double-click the HTML file. Use Live Server so the frontend has an HTTP origin.

In VS Code, right-click `index.html` or `pages/registration.html` and choose **Open with Live Server**.

Typical URL:

```text
http://127.0.0.1:5500/pages/registration.html
```

## 7. Test authentication

1. Open Registration.
2. Create a new user.
3. In MySQL Workbench run:

```sql
USE mca_project_team;
SELECT id, name, email, phone, role, created_at FROM users;
```

4. Open Login and sign in with the same email/password.
5. The dashboard will validate the JWT using `/api/auth/me` and display the user's name.
6. Logout clears the saved session.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API + MySQL connection |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/reset-password` | Demo password reset |
| GET | `/api/auth/me` | Validate JWT and return current user |

## Important security note

The current forgot-password flow is suitable for a college demo because it resets by registered email. A production system should first verify ownership using an OTP or one-time email reset token.

Passwords are never stored directly. They are hashed with bcrypt before being inserted into MySQL.

## If Live Server uses another port

If the frontend opens on a different origin such as `http://127.0.0.1:5501`, add it to `CLIENT_ORIGIN` in `.env`, separated by a comma, then restart the backend.

## When deploying later

Change `js/api-config.js` from:

```js
window.API_BASE_URL = "http://localhost:5000/api";
```

to your deployed backend URL, for example:

```js
window.API_BASE_URL = "https://your-api.onrender.com/api";
```
