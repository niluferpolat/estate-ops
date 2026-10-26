# 📦 Estate OPS – Real Estate Operations API

Hello!  
Estate OPS is a backend API for managing real estate operational workflows, built with NestJS, TypeScript, and MongoDB.

This README includes installation steps, environment variable configuration, running instructions, testing, and deployment info.

---

## 🧰 1. Installation Instructions

Clone the repository:

```bash
git clone https://github.com/niluferpolat/estate-ops.git
cd estate-ops
```

Install Dependencies:

```bash
npm install

Make sure Node.js is installed.
Download nodejs if needed:
[NodeJs](https://nodejs.org/en/download)
```

## 🔧 2. Environment Variables(MongoDB Atlas Included)

Create your .env file.

Fill your ```env``` with your MongoDB Atlas connection string
Example:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

## ⏯️ 3. How to Run the Project

Start normally: 

```bash
npm run start
```

Start in development mode:

```bash
npm run start:dev
```

## 🧪 4. How to Run Tests

Run all tests:

```bash
npm run test
```

Test coverage:
```bash
npm run test:cov
```

### 🔗 Live API (Railway Deploy)

👉 **[Estate OPS](https://estate-ops-production.up.railway.app/api)**

