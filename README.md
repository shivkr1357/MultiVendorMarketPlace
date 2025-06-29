# Monolith API

A complete REST API for the marketplace application, built as a monolithic service using Node.js, Express, TypeScript, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Customer, vendor, and admin roles
- **Product Management**: CRUD operations with vendor-specific access
- **Order Management**: Order creation, tracking, and status updates
- **Search & Filtering**: Product search with pagination
- **Stock Management**: Automatic stock updates on order creation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or remote)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/marketplace
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Products

- `GET /api/products` - Get all products (with pagination and filters)
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (vendor/admin only)
- `PUT /api/products/:id` - Update product (vendor/admin only)
- `DELETE /api/products/:id` - Delete product (vendor/admin only)

### Orders

- `GET /api/orders` - Get orders (filtered by user role)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order (customer only)
- `PATCH /api/orders/:id/status` - Update order status (vendor/admin only)

## User Roles

### Customer

- Can view products
- Can create orders
- Can view their own orders

### Vendor

- Can view products
- Can create, update, and delete their own products
- Can view orders containing their products
- Can update order status for their products

### Admin

- Full access to all endpoints
- Can manage all products and orders
- Can view all user data

## Database Seeding

To seed the database with sample data, you can use the seeder service from the backend directory:

```bash
cd ../backend/seeder-service
npm run seed
```

This will create:

- Admin user: `admin@marketplace.com` / `admin123`
- Vendor users: random emails / `vendor123`
- Customer users: random emails / `customer123`
- Sample products and orders

## Development

### Project Structure

```
src/
├── controllers/     # Request handlers
├── models/         # Mongoose models
├── routes/         # Express routes
├── utils/          # Utility functions
└── index.ts        # Main server file
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (not implemented yet)

## Environment Variables

| Variable         | Description               | Default                                 |
| ---------------- | ------------------------- | --------------------------------------- |
| `PORT`           | Server port               | `3001`                                  |
| `MONGODB_URI`    | MongoDB connection string | `mongodb://127.0.0.1:27017/marketplace` |
| `JWT_SECRET`     | JWT signing secret        | `your-secret-key`                       |
| `JWT_EXPIRES_IN` | JWT expiration time       | `7d`                                    |

## Health Check

The API includes a health check endpoint:

- `GET /health` - Returns server status and timestamp

## Error Handling

The API uses consistent error responses:

```json
{
  "error": "Error message",
  "message": "User-friendly message"
}
```

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Role-based access control
- Input validation and sanitization
- CORS enabled for frontend integration
