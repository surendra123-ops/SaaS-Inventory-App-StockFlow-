# StockFlow MVP SaaS

Production-ready multi-tenant inventory SaaS MVP with Node.js + Express + MongoDB backend and React + Vite frontend.

## Setup Steps

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Configure environment variables

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`

### 3) Run the apps

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Backend runs on `http://localhost:5000`, frontend on `http://localhost:5173`.

## Backend Folder Structure

```txt
backend/src
  config/         env + database config
  controllers/    HTTP handlers
  middlewares/    auth + validation + error middleware
  models/         Mongoose schemas
  repositories/   data access layer
  routes/         API route definitions
  services/       business logic layer
  utils/          shared helpers and response utilities
  validators/     Zod request validators
```

## Frontend Folder Structure

```txt
frontend/src
  api/            Axios client + endpoint wrappers
  components/     reusable UI components
  context/        auth state context
  hooks/          reusable hooks
  pages/          route pages
  utils/          helpers
```

## Mongoose Schemas

Implemented schemas are in:

- `backend/src/models/User.js`
- `backend/src/models/Organization.js`
- `backend/src/models/Product.js`
- `backend/src/models/Settings.js`

Important constraints:

- `Product` has unique compound index `{ organizationId: 1, sku: 1 }`
- `Settings.organizationId` is unique
- All product/settings/dashboard queries are scoped by `organizationId`

## Auth + Security

- JWT access and refresh tokens
- Both tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- Protected routes via `authMiddleware`
- Rate limiting + helmet + CORS + cookie-parser
- Global consistent error/success response contract

## API Documentation

Base URL: `http://localhost:5000/api`

### Response format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

### Auth

- `POST /auth/signup`
  - body: `{ "email": "user@org.com", "password": "password123", "organizationName": "Org Name" }`
- `POST /auth/login`
  - body: `{ "email": "user@org.com", "password": "password123" }`
- `POST /auth/refresh`
  - uses refresh token cookie
- `POST /auth/logout`
  - clears access + refresh cookies

### Products (auth required)

- `GET /products?search=term`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

Product payload:

```json
{
  "name": "Apple Watch",
  "sku": "AW-001",
  "description": "Series 9",
  "quantity": 20,
  "costPrice": 250,
  "sellingPrice": 350,
  "lowStockThreshold": 5
}
```

### Dashboard (auth required)

- `GET /dashboard`
  - returns `totalProducts`, `totalQuantity`, `lowStockItems`

### Settings (auth required)

- `GET /settings`
- `PUT /settings`
  - body: `{ "defaultLowStockThreshold": 10 }`

## Notes

- Duplicate SKU is prevented per organization.
- Negative quantity/prices are rejected.
- Invalid IDs/tokens and missing required fields are handled with consistent errors.
