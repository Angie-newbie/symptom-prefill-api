# 🩺 Symptom Pre-Fill API

A Node.js + TypeScript backend for collecting and managing structured symptom and medicine data before and after medical appointments. This API helps patients submit information ahead of time and enables doctors to review and update records efficiently — improving communication, documentation, and care quality.

---

## 📌 Features

- Symptom and medicine CRUD endpoints  
- Separate logic for patient submissions and doctor updates  
- Secure user registration and JWT login  
- Password hashing with bcrypt  
- Input validation and error handling  
- Designed for integration with frontend intake forms or telehealth platforms  

---

## 🛠️ Tech Stack

| Category         | Technology            |
|------------------|------------------------|
| Backend          | Node.js, Express       |
| Language         | TypeScript             |
| Database         | MongoDB + Mongoose     |
| Auth & Security  | JWT, bcrypt            |
| Dev Tools        | nodemon, dotenv        |
| Styling          | Follows Airbnb-style JS/TS conventions |

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

-  JWT authentication to protect sensitive endpoints  
-  bcrypt password hashing  
-  Field validation to prevent incomplete or misleading records  
-  Patient safety first: Data is meant to assist, not replace, clinical judgment  
-  Planned improvements: CORS policy, role-based access, multilingual support

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