# employee-management-portal
>This is an employee management portal built with React and Node.js.  
> Users authenticate via JWT, and after login can view, add, edit, and delete employees.  
> The frontend uses Tailwind CSS and the backend uses SQLite for simplicity.  
> The app is fully functional in GitHub Codespaces and supports environment-based configuration.

## Tech Stack
- React (Vite)
- Tailwind CSS v4
- Node.js + Express
- SQLite
- JWT Authentication

## Default Login
Email: admin@test.com
Password: admin123

## Port Visibility
If running on codespace, make sure to make both ports as public to avoic preflight and cors issues.
## Environment Configuration

This project uses environment variables to support both local development and GitHub Codespaces.

### Frontend
- `.env` → used in GitHub Codespaces
- `.env.local` → used automatically for local development (overrides `.env`)

Example:

.env (Codespaces)

VITE_API_BASE_URL=https://<codespace>-5000.app.github.dev



.env.local (Local)

VITE_API_BASE_URL=http://localhost:5000

.env.local is ignored by git.


### Backend Environment


### Backend
The backend uses a simple `.env` file:

PORT=5000

JWT_SECRET=secret123

This works both locally and in Codespaces.

## Running Locally
1. Start backend
   ```bash
   cd backend
   npm install
   npm run dev
   
2. Start frontend
 ```bash
   cd backend
   npm install
   npm run dev

