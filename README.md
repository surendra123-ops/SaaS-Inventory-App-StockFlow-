# StockFlow

DEPLOY LINK : https://saas-inventory-app-stockflow.onrender.com

StockFlow is a multi-tenant inventory SaaS MVP for small teams that need to track products, monitor low stock, and manage inventory settings per organization.

It includes a Node.js + Express backend with MongoDB, and a React + Vite frontend with a production-style dashboard interface.

## 1. Project Overview

StockFlow solves a common inventory problem: teams need one place to manage products, quantities, low-stock alerts, and organization defaults while keeping customer data isolated.

What the app does today:

- Lets users sign up and create a new organization
- Supports secure login/logout with cookie-based JWT auth
- Provides product CRUD with per-organization SKU uniqueness
- Shows dashboard metrics and low-stock insights
- Supports organization-level inventory settings
- Includes search and pagination for product lists

## 2. Features

### Authentication

- Email/password signup and login
- Access token + refresh token flow
- Tokens stored in HTTP-only cookies
- Session refresh through `/api/auth/refresh`

### Multi-tenant system

- Each user belongs to one `organizationId`
- Product, settings, and dashboard queries are organization-scoped
- SKU uniqueness is enforced per organization

### Product management

- Create, list, update, and delete products
- Search by name or SKU (case-insensitive, partial match)
- Pagination with page metadata

### Dashboard

- Total product count
- Total quantity across products
- Low stock list based on product threshold or organization default
- Recent products table with pagination in UI

### Settings

- Per-organization default low stock threshold
- Used when a product does not define its own threshold

### Search and pagination

- Backend-driven search and pagination on products endpoint
- Frontend debounced search input
- Page controls and page indicator

## 3. Tech Stack

### Backend

- Node.js
- Express
- Mongoose
- Zod
- JWT (`jsonwebtoken`)
- `cookie-parser`, `helmet`, `cors`, `morgan`, `express-rate-limit`

### Frontend

- React (Vite)
- React Router
- Axios
- Tailwind CSS
- Context API for auth and UI state

### Database

- MongoDB

### Auth

- JWT access + refresh tokens
- HTTP-only cookies

## 4. Architecture

The backend follows a clean layered structure:

- **Controller layer** handles HTTP request/response
- **Service layer** handles business rules
- **Repository layer** handles database access
- **Model layer** defines schemas/indexes
- **Middleware layer** handles auth, validation, and errors

### Backend folder structure

```txt
backend/src
  app.js
  server.js
  config/
    db.js
    env.js
  controllers/
    authController.js
    productController.js
    dashboardController.js
    settingsController.js
  middlewares/
    authMiddleware.js
    errorMiddleware.js
    validate.js
  models/
    User.js
    Organization.js
    Product.js
    Settings.js
  repositories/
    authRepository.js
    productRepository.js
    settingsRepository.js
  routes/
    authRoutes.js
    productRoutes.js
    dashboardRoutes.js
    settingsRoutes.js
  services/
    authService.js
    productService.js
    settingsService.js
  utils/
    apiResponse.js
    AppError.js
    token.js
    escapeRegex.js
  validators/
    authValidator.js
    productValidator.js
    settingsValidator.js
```

### Frontend folder structure

```txt
frontend/src
  api/
    axios.js
    authApi.js
    productApi.js
    dashboardApi.js
    settingsApi.js
  components/
    AppLayout.jsx
    ProtectedRoute.jsx
    ProductForm.jsx
    ui/
      Button.jsx
      Input.jsx
      Card.jsx
      Table.jsx
      Badge.jsx
      Modal.jsx
      Skeleton.jsx
      ToastProvider.jsx
  context/
    AuthContext.jsx
    AuthContextValue.js
    ToastContextValue.js
  hooks/
    useAuth.js
    useToast.js
  pages/
    LoginPage.jsx
    SignupPage.jsx
    DashboardPage.jsx
    ProductsPage.jsx
    SettingsPage.jsx
  utils/
    formatError.js
    cn.js
  App.jsx
  main.jsx
  index.css
```

### Request flow

Most backend requests follow:

`Route -> Controller -> Service -> Repository -> Model -> MongoDB`

## 5. Authentication Flow

### Signup

1. Client calls `POST /api/auth/signup`
2. Backend validates payload with Zod
3. Creates organization
4. Hashes password with bcrypt
5. Creates user linked to `organizationId`
6. Creates default settings for that organization
7. Returns user and sets auth cookies

### Login

1. Client calls `POST /api/auth/login`
2. Backend validates credentials
3. Issues access and refresh tokens
4. Stores both tokens in HTTP-only cookies

### Token handling

- Access token is read from cookies by `authMiddleware`
- If access token expires, frontend Axios interceptor calls `/api/auth/refresh`
- Refresh endpoint validates refresh token and sets a new access token cookie

### Logout

- `POST /api/auth/logout` clears access/refresh cookies

## 6. Multi-Tenant Design

Multi-tenant isolation is organization-based.

- JWT payload contains `organizationId`
- `authMiddleware` attaches `organizationId` to request context
- Repositories query by `organizationId`
- Product unique index is `{ organizationId, sku }`

This prevents cross-organization reads/writes at the query level.

## 7. API Documentation

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

### Auth routes

#### `POST /auth/signup`

- **Description:** Create organization and user
- **Body:**

```json
{
  "email": "owner@acme.com",
  "password": "password123",
  "organizationName": "Acme Inc"
}
```

- **Response data:**

```json
{
  "user": {
    "id": "string",
    "email": "owner@acme.com",
    "organizationId": "string"
  }
}
```

#### `POST /auth/login`

- **Description:** Authenticate user and set auth cookies
- **Body:**

```json
{
  "email": "owner@acme.com",
  "password": "password123"
}
```

- **Response data:** same `user` object shape as signup

#### `POST /auth/refresh`

- **Description:** Issue new access token from refresh cookie
- **Body:** none
- **Response data:**

```json
{}
```

#### `POST /auth/logout`

- **Description:** Clear auth cookies
- **Body:** none
- **Response data:**

```json
{}
```

### Product routes (auth required)

#### `GET /products`

- **Description:** List products with optional search and pagination
- **Query params:**
  - `search` (optional)
  - `page` (optional, default 1)
  - `limit` (optional, default 10)
- **Response data:**

```json
{
  "items": [
    {
      "_id": "string",
      "organizationId": "string",
      "name": "Apple Watch",
      "sku": "AW-001",
      "description": "Series 9",
      "quantity": 20,
      "costPrice": 250,
      "sellingPrice": 350,
      "lowStockThreshold": 5,
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### `POST /products`

- **Description:** Create product for current organization
- **Body:**

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

- **Response data:**

```json
{
  "product": {}
}
```

#### `PUT /products/:id`

- **Description:** Update product (organization-scoped)
- **Body:** same as product create
- **Response data:**

```json
{
  "product": {}
}
```

#### `DELETE /products/:id`

- **Description:** Delete product (organization-scoped)
- **Body:** none
- **Response data:**

```json
{}
```

### Dashboard route (auth required)

#### `GET /dashboard`

- **Description:** Dashboard totals and low-stock items
- **Response data:**

```json
{
  "totalProducts": 12,
  "totalQuantity": 430,
  "lowStockItems": []
}
```

### Settings routes (auth required)

#### `GET /settings`

- **Description:** Get organization settings
- **Response data:**

```json
{
  "settings": {
    "_id": "string",
    "organizationId": "string",
    "defaultLowStockThreshold": 10
  }
}
```

#### `PUT /settings`

- **Description:** Update organization settings
- **Body:**

```json
{
  "defaultLowStockThreshold": 10
}
```

- **Response data:**

```json
{
  "settings": {}
}
```

## 8. Frontend Flow

### Pages

- `/login`
- `/signup`
- `/dashboard`
- `/products`
- `/settings`

### Navigation flow

`Login/Signup -> Dashboard -> Products/Settings`

### State management

- `AuthProvider` stores current user in localStorage
- Protected routes use `ProtectedRoute`
- Toasts handled with `ToastProvider`

### Axios behavior

- Single Axios instance with `withCredentials: true`
- Response interceptor handles `401`:
  - tries `/auth/refresh`
  - retries original request
  - clears auth state if refresh fails

## 9. Environment Setup

### Backend `.env`

Create `backend/.env` using:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/stockflow
JWT_ACCESS_SECRET=replace_with_long_access_secret
JWT_REFRESH_SECRET=replace_with_long_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
COOKIE_SECURE=false
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env`

Create `frontend/.env` using:

```env
VITE_API_URL=http://localhost:5000/api
```

### MongoDB setup

- Ensure MongoDB is running locally on `127.0.0.1:27017`
- Or replace `MONGO_URI` with your remote MongoDB connection string

## 10. How to Run

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Build frontend

```bash
cd frontend
npm run build
```

## 11. Project Structure

At repository root:

```txt
backend/
frontend/
README.md
```

The backend follows route/controller/service/repository/model layering.  
The frontend follows API/context/hooks/pages/components layering.

## 12. Error Handling and Validation

### Validation

- Backend uses Zod schemas for:
  - auth payloads
  - product payloads
  - settings payloads
- Validation middleware rejects invalid bodies before business logic runs

### Error handling

- Global `errorMiddleware` normalizes errors
- Duplicate key errors return `409`
- Validation errors return `400`
- Auth errors return `401`
- Unknown errors return `500`

All errors follow:

```json
{
  "success": false,
  "message": "..."
}
```

## 13. Security

- Passwords hashed with `bcryptjs`
- Access and refresh tokens are in HTTP-only cookies
- `authMiddleware` protects private routes
- Helmet hardens HTTP headers
- CORS is restricted by `CORS_ORIGIN`
- Rate limiting is enabled
- Tenant isolation enforced through `organizationId` filters


