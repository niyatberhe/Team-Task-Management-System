# TaskFlow: Team Task Management System

TaskFlow is a simple team project management web application built for our final Thrive Club capstone project.

## Team Members
| Name   | Role |
|--------|------|
| Samira Junaid | Frontend Developer (Handlebars templates, Tailwind CSS) |
| Niyat Tadesse | Backend Developer (Express.js, MongoDB, JWT Auth) |

## Tech Stack
| Layer      | Technology              |
|------------|-------------------------|
| Templating | Handlebars (.hbs)       |
| Styling    | Tailwind CSS (CDN)      |
| Backend    | Node.js, Express.js     |
| Database   | MongoDB Atlas           |
| Auth       | JWT, bcryptjs           |

## Setup
git clone <repo-url>
cd team-task-manager/backend && npm install

Create backend/.env:
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key

npm run dev
Open http://localhost:5000

## Page Routes
| Route     | Access        | Page               |
|-----------|---------------|--------------------|
| /         | Public        | Landing page       |
| /login    | Public        | Login form         |
| /signup   | Public        | Signup form        |
| /manager  | Manager only  | Manager dashboard  |
| /employee | Employee only | Employee dashboard |
| /logout   | Auth required | Clears session     |

## API Endpoints (Postman)
| Method | Endpoint         | Access  |
|--------|-----------------|---------|
| POST   | /api/auth/signup | Public  |
| POST   | /api/auth/login  | Public  |
| GET    | /api/tasks       | Cookie  |
| POST   | /api/tasks       | Manager |
| PUT    | /api/tasks/:id   | Cookie  |
| DELETE | /api/tasks/:id   | Manager |

Postman note: after login copy token from Set-Cookie header,
send as: Cookie: token=<value>
