# Grip Invest - Mini Investment Platform

This project is a full-stack mini investment platform built for the Grip Invest Winter Internship 2025 selection process. It features a complete backend API, a responsive React frontend, and a fully containerized local deployment setup using Docker.

## Features

-   **Complete User Authentication**: A full user flow with frontend pages for Signup, Login, and a simulated Password Reset, all secured with JSON Web Tokens (JWT).
-   **AI-Powered Assists**: Includes AI-driven suggestions for password strength, auto-generation of product descriptions, and AI-powered recommendations based on user risk appetite.
-   **Enhanced Dashboard**: A dynamic dashboard providing a snapshot of the user's portfolio, including total investment value, investment count, and a chart visualizing risk distribution.
-   **Full Investment Workflow**: Allows authenticated users to browse products with interactive filtering, view product details, and make new investments while checking against their account balance.
-   **User Profile Management**: A dedicated page for users to view their details, update their risk appetite, and add funds to their account.
-   **Admin-Simulated Log Viewer**: An activity page with a password gate where users can view their transaction history, complete with AI-generated summaries and error analysis.
-   **Containerized Environment**: The entire application stack (Frontend, Backend, Database) can be launched with a single command using Docker Compose.

## Tech Stack

-   **Backend**: Node.js, Express.js (ESM), MySQL
-   **Frontend**: React.js, Vite, Tailwind CSS, Axios, React Router, Recharts
-   **DevOps**: Docker, Docker Compose
-   **Testing**: Jest, Supertest (Backend) & Vitest, React Testing Library (Frontend)

---

## Running the Project Locally with Docker

This is the recommended way to run the project.

### Prerequisites
-   [Git](https://git-scm.com/)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) must be installed and running.

### Setup Instructions
1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-folder>
    ```

2.  **Create the Backend Environment File:**
    Navigate to the `backend` folder and create a file named `.env`. It's recommended to copy `backend/.env.example` if it exists, or create the file from scratch with the following content, replacing placeholder values.
    
    Path: `backend/.env`
    ```ini
    # Database Configuration
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=grip_user
    DB_PASSWORD=YourStrongPassword_123
    DB_NAME=gripinvest_db

    # Application Port
    PORT=3001

    # JWT Secret Key
    JWT_SECRET=your_super_secret_jwt_key
    ```

3.  **Build and Run the Containers:**
    From the **root directory** of the project, run:
    ```bash
    docker-compose up --build
    ```
    The initial build may take a few minutes.

4.  **Access the Application:**
    -   **Frontend**: [http://localhost:5173](http://localhost:5173)
    -   **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## API Endpoints Overview

| Method | Endpoint                         | Description                        | Auth Required |
| :----- | :------------------------------- | :--------------------------------- | :-----------: |
| `POST` | `/api/auth/signup`               | Register a new user                |      No       |
| `POST` | `/api/auth/login`                | Log in a user and get a JWT        |      No       |
| `POST` | `/api/auth/forgot-password`      | Start password reset flow          |      No       |
| `POST` | `/api/auth/reset-password`       | Complete password reset flow       |      No       |
| `GET`  | `/api/products`                  | Get a list of all products         |      Yes      |
| `GET`  | `/api/products/recommendations`  | Get AI-powered recommendations     |      Yes      |
| `POST` | `/api/products`                  | Create a new product (admin)       |      Yes      |
| `POST` | `/api/investments`               | Make a new investment              |      Yes      |
| `GET`  | `/api/investments`               | Get the user's portfolio           |      Yes      |
| `GET`  | `/api/user/profile`              | Get the user's profile data        |      Yes      |
| `PUT`  | `/api/user/profile`              | Update profile (risk/balance)      |      Yes      |
| `GET`  | `/api/logs`                      | Get the user's activity logs       |      Yes      |
| `GET`  | `/api/logs/summary`              | Get an AI summary of activity      |      Yes      |
| `GET`  | `/api/logs/error-summary`        | Get an AI summary of errors        |      Yes      |


### Password Reset Flow (Simulated)

This project includes a complete, simulated password reset workflow. No actual emails are sent.

1.  **Request a Reset**: On the Login page, click "Forgot Password?". Enter the email of an existing user and submit.
2.  **Get the Token**: A success message will appear on the screen. In the **backend terminal** where the server is running, a unique password reset token will be printed to the console.
3.  **Go to the Reset URL**: Copy the token from the terminal and manually navigate to the reset URL in your browser: `http://localhost:5173/reset-password/PASTE_TOKEN_HERE`.
4.  **Set New Password**: Enter your new password and submit. You will be redirected to the login page where you can now use your new credentials.