# TeamFlow — Role-Based Project & Task Management

TeamFlow is a full-stack project and task management application built to demonstrate secure Role-Based Access Control (RBAC). It allows teams to manage projects, assign tasks, manage users, and track important activities through audit logs.

## Features

- User authentication with login/logout
- JWT authentication using HTTP-only cookies
- Three roles: Admin, Manager, and Member
- Role-based protected routes and API authorization
- Project CRUD operations
- Task CRUD operations
- Project-based task assignment
- Role and resource-level authorization
- User management
- Audit logs for important actions
- Input validation and centralized error handling
- Responsive user interface

## Role Permissions

| Feature | Admin | Manager | Member |
|---|---|---|---|
| View Dashboard | ✓ | ✓ | ✓ |
| Manage Users | ✓ | — | — |
| View Projects | All | Own/Managed | Accessible |
| Create Projects | ✓ | ✓ | — |
| Edit/Delete Projects | ✓ | Own | — |
| View Tasks | All | Own Projects | Assigned |
| Create Tasks | ✓ | Own Projects | — |
| Edit Tasks | ✓ | Own Projects | Status Only |
| Delete Tasks | ✓ | Own Projects | — |
| View Audit Logs | ✓ | — | — |

Backend authorization is enforced independently of frontend UI restrictions.

## Technology Stack

**Frontend:** React.js, React Router, Context API, Axios, Vite, CSS3

**Backend:** Node.js, Express.js, JWT, Express Validator

**Database:** MongoDB, Mongoose

**Tools:** Git, GitHub, Postman, VS Code

## Project Structure

```text
TeamFlow/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── utils/
│   │   └── validators/
│   └── package.json
│
├── .gitignore
└── README.md

## Database Design

The application uses MongoDB with Mongoose.

### Main Collections

- **Users** — stores user information, authentication data, and roles.
- **Projects** — stores project details, manager, members, status, and timestamps.
- **Tasks** — stores task details, project, assignee, status, priority, due date, and creator.
- **AuditLogs** — records important actions performed within the application.

## Setup & Installation

### Prerequisites

- Node.js
- npm
- MongoDB Atlas or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/teamflow-rbac.git
cd teamflow-rbac

### 2. Install Backend Dependencies
```bash
cd server
npm install

Create a server/.env file:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development

Start the backend:
```bash
npm run dev

### 3. Install Frontend Dependencies
Open another terminal:
```bash
cd client
npm install

Create a client/.env file:
```bash
VITE_API_URL=http://localhost:5000/api

Start the frontend:
```bash
npm run dev

The application will normally be available at:
http://localhost:5173

### 4. Seed Demo Data

The project includes seed data for testing the different RBAC roles.

From the server directory, run:
```bash
npm run seed

The seed script creates demo users, projects, and related data for testing.

After seeding, use the demo credentials below to test the different roles.

Demo Credentials
Role	  Email	           Password
Admin	  admin@teamflow.com	Admin@123
Manager	manager@teamflow.com	Manager@123
Member	member@teamflow.com	Member@123

These accounts are provided only for demonstration and assessment purposes.

If the seed script has not been run, the demo accounts will not be available.

