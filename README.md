# Grip Invest - Mini Investment Platform

This project is a full-stack mini investment platform built for the Grip Invest Winter Internship 2025 selection process. It features a complete backend API, a responsive React frontend, and a fully containerized local deployment setup using Docker.

## Features

-   **Complete User Authentication**: A full user flow with frontend pages for both Signup and Login using JSON Web Tokens (JWT).
-   **AI-Powered Assists**: Includes AI-driven suggestions for password strength during signup and auto-generation of product descriptions if one is not provided.
-   **Enhanced Dashboard**: A dynamic dashboard that provides a snapshot of the user's portfolio, including total investment value, investment count, and a chart visualizing risk distribution.
-   **Investing Workflow**: Allows authenticated users to view product details and make new investments.
-   **Automated Logging**: A global middleware automatically logs every API request to the database for auditing.
-   **Containerized Environment**: The entire application stack (Frontend, Backend, Database) can be launched with a single command using Docker Compose.

## Tech Stack

-   **Backend**: Node.js, Express.js, MySQL
-   **Frontend**: React.js, Vite, Tailwind CSS, Axios, React Router, Recharts
-   **DevOps**: Docker, Docker Compose
-   **Testing**: Jest, Supertest (Backend) & Vitest, React Testing Library (Frontend)

---

## Running the Project Locally with Docker

This is the recommended way to run the project, as it sets up the database, backend, and frontend in one step.

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
    Navigate to the `backend` folder and create a file named `.env`. Copy the contents below into it and replace the placeholder values with your own secrets.

    Path: `backend/.env`
    ```ini
    # Database Configuration for Docker
    DB_HOST=db
    DB_PORT=3306
    DB_USER=grip_user
    DB_PASSWORD=YourStrongPassword_123
    DB_NAME=gripinvest_db

    # Application Port
    PORT=3001

    # JWT Secret Key
    JWT_SECRET=your_super_secret_jwt_key
    ```
    **Note:** The `DB_HOST` must be `db`, which is the name of our database service in the `docker-compose.yml` file.

3.  **Build and Run the Containers:**
    From the **root directory** of the project, run the following command. This will build the images for the frontend and backend and start all three services.

    ```bash
    docker-compose up --build
    ```
    The initial build may take a few minutes.

4.  **Access the Application:**
    Once the containers are running, you can access the services:
    -   **Frontend Application**: [http://localhost:5173](http://localhost:5173)
    -   **Backend API**: [http://localhost:3001](http://localhost:3001)

5.  **Stopping the Application:**
    To stop all running containers, press `Ctrl + C` in the terminal where Docker is running, and then run:
    ```bash
    docker-compose down
    ```
---
## API Endpoints Overview

| Method | Endpoint                    | Description                      | Auth Required |
| :----- | :-------------------------- | :------------------------------- | :-----------: |
| `POST` | `/api/auth/signup`          | Register a new user              |      No       |
| `POST` | `/api/auth/login`           | Log in a user and get a JWT      |      No       |
| `GET`  | `/api/products`             | Get a list of all products       |      Yes      |
| `POST` | `/api/products`             | Create a new product (admin)     |      Yes      |
| `GET`  | `/api/investments`          | Get the logged-in user's portfolio |      Yes      |
| `POST` | `/api/investments`          | Make a new investment            |      Yes      |