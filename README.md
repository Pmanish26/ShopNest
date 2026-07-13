# 🛒 ShopNest – MERN E-Commerce Platform

A full-stack e-commerce platform where users can browse products, add items to a cart, and place secure orders with **Razorpay** payment gateway — with a role-based admin dashboard for managing products and orders.

**Tech Stack:** React.js, Redux Toolkit, Tailwind CSS, Axios, Node.js, Express.js, MongoDB, Mongoose, JWT, **Razorpay API**

**Code Style:** 🎯 Modern JavaScript (ES Modules, async/await, optional chaining, nullish coalescing)

---

## ✨ Features

**Customer-facing**
- Browse products with search, category filters, sorting, and pagination
- Product detail pages with ratings and customer reviews
- Persistent server-side shopping cart (add / update / remove items)
- Secure checkout with **Razorpay** payment gateway (test mode cards included)
- Order history and order detail tracking

**Auth & Security**
- JWT-based authentication (httpOnly cookie + Bearer token support)
- Password hashing with bcrypt
- Role-based access control (`user` vs `admin`) enforced via middleware

**Admin Dashboard**
- Stats overview (products, orders, revenue, out-of-stock count)
- Full CRUD on products
- View all orders, update order status (Processing → Shipped → Delivered)
- User role management via API

**Modern Code Practices**
- ES6 Modules (`import`/`export` instead of `require`)
- Async/await for clean asynchronous code
- Optional chaining (`?.`) and nullish coalescing (`??`)
- Arrow functions and destructuring
- Error handling with try/catch

---

## 🏗️ Project Structure

```
mern-ecommerce/
├── backend/                    # Node.js/Express API
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # User, Product, Cart, Order
│   ├── middleware/            # Auth, error handling, async wrapper
│   ├── controllers/           # Business logic
│   ├── routes/                # REST routes
│   ├── utils/                 # Helpers (sendToken, seeder)
│   ├── app.js                 # Express app
│   ├── server.js              # Entry point
│   └── .env.example           # Config template
│
├── frontend/                  # React + Vite + Redux
│   ├── src/
│   │   ├── api/axios.js       # Configured HTTP client
│   │   ├── app/store.js       # Redux store
│   │   ├── features/          # Redux slices (auth, products, cart, orders)
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page routes
│   │   └── pages/admin/       # Admin-only pages
│   └── .env.example
│
├── README.md                  # This file
├── RAZORPAY_SETUP.md          # 📖 Razorpay integration guide
└── MODERN_PRACTICES.md        # 📖 Code style guide
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+ and npm
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A free [Razorpay](https://razorpay.com) account (test keys available immediately, no business info needed)

---

## 🚀 Setup & Run

### 1. Clone / unzip the project and install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

**backend/.env** (copy from `.env.example`):
```env
MONGO_URI=mongodb://127.0.0.1:27017/shopnest
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_long_random_secret_key_at_least_32_characters
JWT_EXPIRES_IN=7d
COOKIE_EXPIRES_DAYS=7
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

**frontend/.env** (copy from `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

> 📖 **New to Razorpay?** See [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md) for detailed setup guide.

### 3. Seed the database (creates demo accounts + sample products)

```bash
cd backend && npm run seed
```

Creates:
- **Admin:** `admin@shopnest.com` / `admin1234`
- **User:** `user@shopnest.com` / `user1234`
- **6 sample products**

### 4. Run both servers

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173**. 🎉

---

## 🎯 Quick Test Flow

1. Log in: `user@shopnest.com` / `user1234`
2. Browse & add products to cart
3. Checkout → Enter shipping address
4. Pay with test card: `4111 1111 1111 1111`, any future expiry, any CVV
5. Order placed! ✅
6. Log in as admin (`admin@shopnest.com` / `admin1234`) to manage orders

---

## 📖 What is `npm run seed`?

The **seeder script** automatically:
- Connects to MongoDB
- Creates demo accounts (admin + user)
- Inserts 6 sample products
- Clears old data each time it runs

**When to use:**
- First time setup (to have instant test data ready)
- To reset database during development

**Demo logins created:**
```
Admin:  admin@shopnest.com / admin1234  (can create/edit products, manage orders)
User:   user@shopnest.com / user1234    (can browse, buy, see own orders)
```

See [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md) for full details on everything.

---

## 🌐 API Endpoints

All endpoints require JWT in Authorization header or httpOnly cookie (except public routes).

### Auth
- `POST /auth/register` — Create account
- `POST /auth/login` — Login & get JWT
- `GET /auth/logout` — Logout
- `GET /auth/me` — Get your profile
- `PUT /auth/me` — Update your profile
- `GET /auth/users` — **Admin only** - List all users
- `PUT /auth/users/:id/role` — **Admin only** - Change user role
- `DELETE /auth/users/:id` — **Admin only** - Delete user

### Products
- `GET /products` — List products (supports search, filter, pagination)
- `GET /products/:id` — Get product details
- `POST /products` — **Admin only** - Create product
- `PUT /products/:id` — **Admin only** - Update product
- `DELETE /products/:id` — **Admin only** - Delete product
- `PUT /products/:id/review` — Add/update review
- `GET /products/:id/reviews` — Get all reviews

### Cart
- `GET /cart` — Get your cart
- `POST /cart` — Add item to cart
- `PUT /cart/:productId` — Update item quantity
- `DELETE /cart/:productId` — Remove item
- `DELETE /cart` — Clear cart

### Orders
- `POST /orders` — Place order (checkout)
- `GET /orders/me` — Get your orders
- `GET /orders/:id` — Get order details
- `GET /orders` — **Admin only** - Get all orders
- `PUT /orders/:id` — **Admin only** - Update order status
- `DELETE /orders/:id` — **Admin only** - Delete order

### Payment (Razorpay)
- `POST /payment/razorpay/order` — Create payment order
- `POST /payment/razorpay/verify` — Verify payment
- `GET /payment/razorpay/keyid` — Get Razorpay public key

---

## 📚 Additional Resources

- **Razorpay Setup Guide:** [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md)
  - How to get API keys
  - Test card numbers
  - Payment flow explanation
  - Troubleshooting

- **Modern JavaScript Practices:** [MODERN_PRACTICES.md](./MODERN_PRACTICES.md)
  - ES Modules
  - Async/await
  - Optional chaining & nullish coalescing
  - Code examples

- **Razorpay Official Docs:** https://razorpay.com/docs/

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection refused | Run `mongod` locally or check `MONGO_URI` in `.env` |
| Razorpay modal won't open | Ensure `VITE_RAZORPAY_KEY_ID` is set in `frontend/.env` |
| Payment fails | Check `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `backend/.env` |
| npm run seed fails | MongoDB must be running, check connection string |

See [RAZORPAY_SETUP.md#troubleshooting](./RAZORPAY_SETUP.md#-troubleshooting) for detailed help.

