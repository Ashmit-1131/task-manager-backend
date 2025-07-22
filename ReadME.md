# Task Manager Backend

A secure backend API built with Express.js, MongoDB (Mongoose), and JWT authentication. Manage users, tasks, and embedded subtasks with soft‑delete support.

---

## Quick Start

1. **Clone & Install**

   ```bash
   git clone https://github.com/Ashmit-1131/task-manager-backend.git
   cd task-manager-backend
   npm install
   ```

2. **Environment**

   * Copy `.env.example` → `.env`
   * Fill in the values:

     ```ini
     MONGO_URI=your_mongo_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=8082
     ```

3. **Run**

   ```bash
   npm run dev
   ```

   The API listens at `http://localhost:8082` by default (or your configured `PORT`).

---

## Base URL

* **Deployed**: `https://task-manager-backend-1gyi.onrender.com`
* **Local**:    `http://localhost:8082`

Use either as your `{{base_url}}` in Postman.
You might already get the base url with postman collections

---

## Postman Testing

1. **Import the Collection**

   * Open Postman desktop.
   * File → Import → select `docs/TaskManagerAPI.postman_collection.json`.

2. **Set Environment**

   * Manage Environments → Add new:

     * `base_url` → choose one of the URLs above.
     * `token` → *(empty)*

3. **Register & Login**

   * **Auth → Register User**

     ```json
     { "name":"You", "email":"you@example.com", "password":"pass123" }
     ```
   * **Auth → Login User** → copy returned `token` into environment. Bearer <token>
   

4. **Tasks**

   * **Create Task** → `{ "subject":"Task1", "deadline":"2025-08-01" }`
                         `{ "subject":"Task2", "deadline":"2025-08-01" }`
   * **Get Tasks**
   * **Update Task** → `/tasks/{{taskId}}`
   * **Delete Task** → `/tasks/{{taskId}}`  //delete Task2

5. **Subtasks**

   * **Create Subtasks** → `/tasks/{{taskId}}/subtasks`

     ```json
     { "subtasks":[ { "subject":"Subtask1" }, { "subject":"Subtask2" } ] }
     ```
   * **Get Subtasks** → `/tasks/{{taskId}}/subtasks`
   * **Update Subtasks (bulk sync)**

     ```json
     { "subtasks":[
         { "_id":"ID1","subject":"Subtask1","deleted":true },
         { "_id":"ID2","subject":"Subtask2","deleted":false }
     ] }
     ```

---

## API Overview

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| POST   | `/auth/register`          | Register new user           |
| POST   | `/auth/login`             | Login to receive JWT        |
| GET    | `/tasks`                  | List user’s tasks           |
| POST   | `/tasks`                  | Create a new task           |
| PUT    | `/tasks/:taskId`          | Update existing task        |
| DELETE | `/tasks/:taskId`          | Soft-delete a task          |
| GET    | `/tasks/:taskId/subtasks` | List a task’s subtasks      |
| POST   | `/tasks/:taskId/subtasks` | Add new subtasks            |
| PUT    | `/tasks/:taskId/subtasks` | Bulk-update (sync) subtasks |

For full examples and sample responses, refer to the imported Postman collection.

---



##  Contact

If you have any questions or issues, feel free to reach out:

* **Phone:** +91-6393078913
* **Email:** [beingashmit@gmail.com](mailto:beingashmit@gmail.com)

I’m also available on LinkedIn: [https://www.linkedin.com/in/ashmit-yadav-588192228/](https://www.linkedin.com/in/ashmit-yadav-588192228/)
