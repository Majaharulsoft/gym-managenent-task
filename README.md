# Gym Management System

## Project Overview

The Gym Class Scheduling and Membership Management System is designed to manage gym operations efficiently. The system defines three roles: Admin, Trainer, and Trainee, each with specific permissions. Admins are responsible for creating and managing trainers, scheduling classes, and assigning trainers to these schedules. Each day can have a maximum of five class schedules, with each class lasting two hours. Trainers conduct the classes and can view their assigned class schedules but cannot create new schedules or manage trainee profiles. Trainees can create and manage their own profiles and book class schedules if there is availability, with a maximum of ten trainees per schedule.

---

---

## Technology Stack

- **Frontend**: None 
- **Backend**: 
  - JavaScript
  - Express.js
  - Mongoose (MongoDB ORM)
  - MongoDB
  - JWT (JSON Web Token) for authentication
- **API Documentation**: Postman
- **Environment Variables**: Dotenv

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description                       | Parameters                      | Response                          |
|--------|--------------------|-----------------------------------|----------------------------------|-----------------------------------|
| POST   | `/api/v1/register`| Register a new user               | `name`, `email`, `password`, `role` | Success or error message          |
| POST   | `/api/v1/login`   | Log in a user (returns JWT)       | `email`, `password`              | JWT token or error message        |

### Class Management (Admin Only)

| Method | Endpoint              | Description                         | Parameters                  | Response                              |
|--------|-----------------------|-------------------------------------|------------------------------|---------------------------------------|
| GET    | `/api/v1/classLists`          | Get all available classes           | None                         | List of classes                      |
| POST   | `/api/v1/createClass`          | Create a new class                  | `name`, `trainer`, `schedule` | Success message or error              |
| PUT    | `/api/v1/updateClass/:id`       | Update a class                      | Class properties              | Success message or error              |
| DELETE | `/api/v1/deleteClass/:id`       | Delete a class                      | None                         | Success message or error              |

### Trainer Management (Admin Only)

| Method | Endpoint             | Description                        | Parameters                          | Response                             |
|--------|----------------------|------------------------------------|-------------------------------------|--------------------------------------|
| GET    | `/api/v1/trainerList` | Get all trainers                   | None                                | List of trainers                     |
| POST   | `/api/v1/createTrainer` | Add a new trainer                  | `name`, `email`, `expertise`, `bio` | Success message or error             |
| PUT    | `/api/v1/updateTrainers/:id` | Update a trainer's profile    | Trainer properties                  | Success message or error             |
| DELETE | `/api/v1/deleteTrainer/:id` | Delete a trainer's profile    | None                                | Success message or error             |

### Member Booking (Members Only)

| Method | Endpoint               | Description                       | Parameters           | Response                          |
|--------|------------------------|-----------------------------------|----------------------|-----------------------------------|
| POST   | `/api/v1/bookClass`   | Book a class                      | `classId`, `userId`  | Booking confirmation              |
| GET    | `/api/v1/myClass`| View member's bookings            | `userId`             | List of member's bookings         |

---

## Database Schema

### User Model

javaScript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['Admin', 'Trainer', 'Member'] }
});
```

### Class Model

javaScript
const classSchema = new mongoose.Schema({
  name: String,
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  schedule: Date,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
```

### Trainer Model

 javaScript
const trainerSchema = new mongoose.Schema({
  name: String,
  email: String,
  expertise: String,
  bio: String,
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
});
```

---

## Instructions to Run Locally

### Prerequisites

- **Node.js** installed (v14 or later)
- **MongoDB** installed and running locally
- **Git** installed

### Step-by-step Guide

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Majaharulsoft/gym-managenent-task
    cd gym-managenent-task
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following values:

    ```
    MONGO_URI=your_MONGO_URI
    JWT_SECRET=your_secret_key
    PORT=5000
    ```

4. **Run the server:**

    ```bash
    npm run dev
    ```

5. **Access the app:**

   Open [http://localhost:5000](http://localhost:5000) in your browser.

### Postman API Docs

Access the API documentation at [https://documenter.getpostman.com/view/28385145/2sAXqtagsB](https://documenter.getpostman.com/view/28385145/2sAXqtagsB).

---

## Live Hosting Link

Live Link [https://gym-management-system-wine.vercel.app](https://gym-management-system-wine.vercel.app)

---


### Key Features to Test

- **Create Trainers**: Log in as an admin and create new trainers using the `/api/class/trainers` endpoint.
- **Schedule Classes**: Log in as an admin and create new classes using the `/api/class` endpoint.
- **Booking Classes**: Log in as a member, browse available classes, and book one using the `/api/class/book/:id` endpoint.