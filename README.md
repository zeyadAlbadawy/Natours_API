# 🌍 Natours API

The **Natours API** is a production-ready RESTful API for a fictional tour booking platform. It is built with Node.js, Express, and MongoDB, and follows a modular, secure, and scalable architecture.

---

## 🚀 Features

- RESTful API with full CRUD functionality
- Tour management: create, read, update, delete
- User authentication & authorization (JWT)
- Role-based access control (admin, lead-guide, guide, user)
- API filtering, sorting, pagination, and field limiting
- Geo-spatial queries: find tours within a radius
- Secure HTTP headers and request sanitization
- Image uploading and resizing with Sharp
- Custom error handling with global error controller
- Environment-based configuration

---

## 🏗️ Project Architecture

The application follows the **MVC (Model-View-Controller)** pattern and has a clean, modular structure:

```
natours/
│
├── controllers/          # Route handler functions (business logic)
│   ├── authController.js
│   ├── tourController.js
│   └── userController.js
│
├── models/               # Mongoose models for MongoDB
│   ├── tourModel.js
│   ├── userModel.js
│   ├── reviewModel.js
│   └── bookingModel.js
│
├── routes/               # Route definitions
│   ├── tourRoutes.js
│   ├── userRoutes.js
│   ├── reviewRoutes.js
│   └── bookingRoutes.js
│
├── dev-data/             # Test data and data import scripts
│   └── data/
│
├── public/               # Static files (for frontend if needed)
│
├── utils/                # Utility classes and error helpers
│   ├── appError.js
│   ├── catchAsync.js
│   └── apiFeatures.js
│
├── views/                # Pug templates (for rendered views)
│
├── config.env            # Environment variables
├── app.js                # Main Express app setup
├── server.js             # Server start + database connection
└── README.md             # Project documentation
```

---

## 🔐 Security & Best Practices

- **JWT Authentication** for login and protected routes
- **Helmet** for setting secure HTTP headers
- **Rate Limiting** to prevent brute-force attacks
- **Data Sanitization** against NoSQL injection and XSS
- **Password hashing** using bcrypt
- **Role-based access control** with middleware
- **Error handling** with centralized global error controller

---

## 🌐 API Endpoints

Here are a few example routes:

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| GET    | `/api/v1/tours`           | Get all tours                 |
| GET    | `/api/v1/tours/:id`       | Get a tour by ID              |
| POST   | `/api/v1/tours`           | Create a new tour             |
| PATCH  | `/api/v1/tours/:id`       | Update a tour                 |
| DELETE | `/api/v1/tours/:id`       | Delete a tour                 |
| GET    | `/get-monthly-plan/:year` | Get Monthly plan overview     |
| POST   | `/api/v1/users/signup`    | Create a new user             |
| POST   | `/api/v1/users/login`     | Log in and receive a JWT      |
| GET    | `/api/v1/users/me`        | Get current user’s profile    |
| PATCH  | `/api/v1/users/updateMe`  | Update logged-in user details |
| DELETE | `/api/v1/users/deleteMe`  | Deactivate user account       |

---

## 🧪 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/zeyadAlbadawy/Natours_API
   cd natours-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` or modify `config.env` and include:

   ```
   NODE_ENV=development
   PORT=3000
   DATABASE=mongodb://localhost:3000/natours
   DATABASE_PASSWORD=your_db_password_if_using_atlas
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   ```

4. **Import sample data (optional)**

   ```bash
   npm run import:data
   ```

5. **Run the app**
   ```bash
   npm run start:dev
   ```

---

## 📦 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (JSON Web Tokens)**
- **Pug (for rendered views, optional)**
- **Cloudinary / Sharp (for image processing)**
- **Postman** (for API testing)

---

This project is part of the course **"Node.js, Express, MongoDB & More: The Complete Bootcamp"** by [Jonas Schmedtmann].
