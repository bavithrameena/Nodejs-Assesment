# Node.js Admin API

This is a secure and role-based Express.js API for managing **Accounts**, **Destinations**, **Account Members**, and **Logs**.

---

## Getting Started

### Prerequisites

* Node.js (v16 or later)
* MongoDB (local or Atlas)
* `npm` or `yarn`

### Installation

```bash

npm install
```

---

## Running in Development

To start the server in development mode:

```bash
npm run develop
```

> Make sure you have `nodemon` installed (as a dev dependency or globally). If not:

```bash
npm install --save-dev nodemon
```

### `package.json` (script example)

```json
"scripts": {
  "develop": "nodemon server/app.js"
}
```

---

## Authentication & Authorization

* Uses JWT tokens for authentication
* Role-based authorization: `Admin`, `User`
* Middleware:

  * `authenticateToken`: verifies JWT
  * `authorizeRoles`: checks user roles

---

## API Documentation

### Base URL

```
http://localhost:8000
```

---

### Account APIs

| Method | Endpoint         | Access        | Description                     |
| ------ | ---------------- | ------------- | ------------------------------- |
| POST   | `/accounts`      | Admin         | Create a new account            |
| GET    | `/accounts`      | Admin/User    | List all accounts               |
| PUT    | `/accounts/:id`  | Admin/User    | Update an account               |
| DELETE | `/accounts/:id`  | Admin         | Delete an account               |
| GET    | `/find-accounts` | Authenticated | Search accounts by name/website |

---

### Destination APIs

| Method | Endpoint            | Access     | Description              |
| ------ | ------------------- | ---------- | ------------------------ |
| POST   | `/destinations`     | Admin      | Create a new destination |
| GET    | `/destinations`     | Admin/User | List all destinations    |
| PUT    | `/destinations/:id` | Admin/User | Update a destination     |


---

### Account Members APIs

| Method | Endpoint           | Access     | Description                 |
| ------ | ------------------ | ---------- | --------------------------- |
| POST   | `/account-members` | Admin      | Add member to an account    |
| GET    | `/account-members` | Admin/User | Get members of all accounts |

---

### Logs API

| Method | Endpoint | Access     | Description     |
| ------ | -------- | ---------- | --------------- |
| GET    | `/logs`  | Admin/User | Get system logs |

---


