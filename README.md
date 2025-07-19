# 🩺 Symptom Pre-Fill API

A Node.js + TypeScript backend for collecting and managing structured symptom and medicine data before and after medical appointments. This API helps patients submit information ahead of time and enables doctors to review and update records efficiently — improving communication, documentation, and care quality.

---

## 📌 Features

- RESTful CRUD endpoints for symptoms and medicines  
- Secure user registration and JWT login  
- Password hashing with bcrypt  
- Input validation and error handling  
- CI/CD with GitHub Actions  
- Docker & Docker Compose support  
- Test suite using Jest + Supertest  
- Environment variables managed with `.env` and GitHub Secrets  

---

## 🛠️ Tech Stack

| Category         | Technology                  |
|------------------|-----------------------------|
| Backend          | Node.js, Express            |
| Language         | TypeScript                  |
| Database         | MongoDB + Mongoose          |
| Auth & Security  | JWT, bcrypt                 |
| Dev Tools        | ts-node, nodemon, dotenv    |
| Testing          | Jest, Supertest             |
| CI/CD            | GitHub Actions, Docker      |
| Style Guide      | Airbnb-style JS/TS linting  |

---

## 🏥 Project Logic: Patient & Doctor Workflow

- **Patients** fill in symptoms and medicines *before* an appointment  
  - E.g. via `/users/:userId/symptoms` or `/users/:userId/medicines`
  - Marked as `submittedBy: 'patient'`  

- **Doctors** can later **review and update** submitted data  
  - Update notes, frequency, dosage, etc.  
  - Marked as `updatedByDoctor: true`  

This approach supports **preparation, documentation, and follow-up** in clinical workflows.

---

## 🚀 Getting Started

### 1. Clone the project

```
git clone git@github.com:Angie-newbie/symptom-prefill-api.git
cd symptom-prefill-api
```

### 2. Install dependencies

```
npm install
```

### 3. Setup environment variables
Create a .env file:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/symptomdb
JWT_SECRET=SymptomsPreFillSecretKey
```

### 4. Run the server
```
npm run dev
```

### 5. Run Tests
```
npm run build
npm test 
```

## 🐳 Docker Support

### 1. Build & Run Locally

```
docker-compose up --build
```

### 2. Make sure .env contains:

```
PORT=3000
JWT_SECRET=yourSecret
DATABASE_URL=mongodb://mongo:27017/symptoms-test
NODE_ENV=development
```

### 3. CI/CD Tagging Convention
Container images are named using:
```
Container images are named using:
```

# 📘 API Overview

## Authentication & Headers

- Most endpoints require a valid **JWT token** for authentication.
- Include the token in your request headers as:
```
Authorization: Bearer <your_jwt_token>
```
- The `/users/register` and `/users/login` endpoints are public and do **not** require this header.
- Requests without a valid token will receive a `401 Unauthorized` response.


## API Endpoints

### Auth

| Method | Route           | Description            |
|--------|------------------|------------------------|
| POST   | /users/register  | Register a new user    |
| POST   | /users/login     | Log in and receive JWT |

---

### Users

| Method | Route       | Description         |
|--------|-------------|---------------------|
| GET    | /users       | Get all users        |
| GET    | /users/:id   | Get a user by ID     |
| PUT    | /users/:id   | Update user profile  |
| DELETE | /users/:id   | Delete a user        |

---

### Symptoms

| Method | Route                             | Description                  |
|--------|-----------------------------------|------------------------------|
| GET    | /users/:userId/symptoms           | Get all symptoms for a user  |
| GET    | /users/:userId/symptoms/:id       | Get one symptom              |
| POST   | /users/:userId/symptoms/create    | Submit a new symptom         |
| PUT    | /users/:userId/symptoms/:id       | Update a symptom             |
| DELETE | /users/:userId/symptoms/:id       | Delete a symptom             |

---

### Medicines

| Method | Route                             | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | /users/:userId/medicines          | Get all medicines for a user   |
| GET    | /users/:userId/medicines/:id      | Get one medicine               |
| POST   | /users/:userId/medicines          | Submit a new medicine          |
| PUT    | /users/:userId/medicines/:id      | Update an existing medicine    |
| DELETE | /users/:userId/medicines/:id      | Delete a medicine              |

---

## Security & Ethics Considerations

- JWT authentication for protected routes
- Passwords hashed with bcrypt
- Request input validated before DB insertion
- No hardcoded credentials — secrets are injected via CI/CD
- Ethical usage: intended for clinical support, not diagnosis replacement

---

## Future Improvements

-  Doctor dashboard to review incoming symptoms  
- Department-specific customization: hospital departments can tailor the form templates to suit their needs (e.g., mental health, flu clinic, etc.) 
-  Multilingual forms
-  Mobile-friendly frontend intake form  
-  Admin analytics (symptom trends, frequency)  
-  Integration with Electronic Health Records (EHR)

---

## License
MIT License