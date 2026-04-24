# 🛒 ShopMart - Full Stack E-Commerce Platform

## 🚀 Overview

ShopMart is a modern full-stack e-commerce web application built using **Next.js**, **React**, and a backend API.
It includes user authentication, admin dashboard, shopping cart, order management, and a chatbot support system.

---

## 🧩 Features

### 👤 User Features

* User Registration & Login
* Product Browsing with Search & Filter
* Add to Cart & Manage Cart
* Checkout & Place Orders
* View Order History
* Chatbot Support (FAQ-based)

### 🛠️ Admin Features

* Admin Login & Registration
* Dashboard with system stats
* Login history tracking
* Session-based access control

---

## ⚙️ Tech Stack

### Frontend:

* Next.js (App Router)
* React.js
* Tailwind CSS
* Framer Motion
* Lucide Icons

### Backend:

* REST API (Spring Boot)
* MySQL / Database

---

## 📦 Folder Structure

```
app/
 ├── Navbar/
 ├── cart/
 ├── products/
 ├── order/
 ├── admin/
 ├── context/
 ├── bot/
 ├── data/
```

---

## 🔌 API Endpoints

### Auth:

* POST `/api/auth/login`
* POST `/api/auth/register`

### Admin:

* POST `/api/auth/admin/login`
* POST `/api/auth/admin/register`

### Cart:

* GET `/api/cart/{userId}`
* POST `/api/cart/add/{userId}`
* PUT `/api/cart/increase/{id}`
* PUT `/api/cart/decrease/{id}`
* DELETE `/api/cart/delete/{id}`

### Orders:

* POST `/api/orders/place/{userId}`
* GET `/api/orders/{userId}`
* PUT `/api/orders/cancel/{orderId}`

---

## 🎯 Key Highlights

* 🔐 Custom password validation (Strength checker)
* ⚡ Real-time UI updates (Cart, Orders)
* 🎨 Modern UI with animations
* 🔔 Custom Toast Notification System
* 🤖 Built-in Chatbot Support

---


## 🚀 Future Improvements

* JWT Authentication & Role-based access
* Payment Gateway Integration
* AI Chatbot (OpenAI / Dialogflow)
* Admin analytics dashboard
* Deployment (Vercel + Cloud backend)

---

## 🧑‍💻 Author

**Kavisudar (ShopMart Developer)**

---
