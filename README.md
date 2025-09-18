# Grip Invest - Mini Investment Platform

This project is a full-stack mini investment platform built as part of the Grip Invest Winter Internship 2025 selection process. It includes a backend API, a React frontend, and a containerized local deployment setup using Docker.

## Features

- **User Authentication**: Secure user signup and login using JWT.
- **Product Management**: CRUD API for managing investment products.
- **Investing**: Functionality for users to invest in available products and view their portfolio.
- **Transaction Logging**: Middleware that logs every API request to the database.
- **Containerized**: Fully containerized with Docker for easy setup and deployment.

## Tech Stack

- **Backend**: Node.js, Express.js, MySQL
- **Frontend**: React.js, Vite, Tailwind CSS, Axios
- **DevOps**: Docker, Docker Compose
- **Testing**: Jest, Supertest

## Running the Project Locally with Docker

**Prerequisites:**
- Docker Desktop must be installed and running.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/gripinvest_winter_internship_backend.git](https://github.com/your-username/gripinvest_winter_internship_backend.git)
    cd gripinvest_winter_internship_backend
    ```

2.  **Configure Backend Environment:**
    - Navigate to the `backend` folder.
    - Create a `.env` file by copying the contents of `.env.example` (or create it from scratch).
    - **Important:** The `DB_HOST` in this `.env` file must be `db`.

3.  **Run Docker Compose:**
    - From the project's **root directory**, run the following command:
    ```bash
    docker-compose up --build
    ```
    - This will build the images and start the frontend, backend, and database containers.

4.  **Access the Application:**
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:3001`