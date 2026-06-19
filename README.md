<div align="center">

# 🐶 VetPass

### Digital Veterinary Passport System for Pets 🩺📱

VetPass is a modern full-stack web application that replaces physical pet vaccination booklets with a secure, digital system.

---

![VetPass Banner](https://github.com/ayishahgoedar0908/VetPass/blob/c1d5bbb441e331bdf7b552ed4786fb1105af258a/VetPass.png)

</div>

---

## 🚀 Overview

## 🚀 Overview

VetPass is a digital pet healthcare management system developed to improve the way veterinary records are stored and accessed. Many pet owners still rely on paper-based vaccination booklets, which can easily be lost, damaged, or become outdated. VetPass addresses this problem by providing a secure and centralized web platform where all pet health information can be managed digitally.

The application enables veterinarians to register pets, maintain vaccination records, add medical notes, track treatments, and manage healthcare information through a modern dashboard. Pet owners can securely log in to view their pets' profiles, vaccination history, and medical records in real time.

One of the key features of VetPass is its QR code integration. Every registered pet receives a unique QR code that can be scanned to quickly access important information, including identification details, vaccination status, and owner contact information. This feature improves efficiency during veterinary appointments and helps ensure that critical information is always available when needed.

Built using HTML, CSS, JavaScript, Node.js, Express.js, MySQL, and JWT authentication, VetPass demonstrates the implementation of a complete full-stack application with database integration, user authentication, CRUD operations, and real-world problem solving. The project aims to provide a practical, secure, and scalable solution for modern veterinary clinics and pet owners.

### ✨ What it does:
- 🐕 Create pet profiles
- 💉 Track vaccinations & medical history
- 📷 Generate QR codes per pet
- 👨‍⚕️ Vet dashboard for updates
- 🌐 Access anywhere, anytime

---

## 🧠 Problem Solved

Traditional pet records are:
- ❌ Paper-based
- ❌ Easy to lose
- ❌ Hard to update

VetPass makes it:
- ✅ Digital
- ✅ Secure
- ✅ Fast
- ✅ Always accessible via QR

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript 

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Authentication
- JSON Web Token (JWT)

### Development Tools
- VS Code
- Git
- GitHub
- Thunder Client / Postman

## 📁 Project Structure
VetPass/
│
├── backend/
│   │
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── petRoutes.js
│   │   ├── vaccinationRoutes.js
│   │   └── medicalRoutes.js
│   │
│   ├── middlewares/
│   │   └── auth.js
│   │
│   └── sql/
│       └── schema.sql
│
│
├── frontend/
│   │
│   ├── login.html
│   ├── dashboard.html
│   ├── pet-profile.html
│   ├── vaccinations.html
│   ├── medical-history.html
│   ├── qr.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── login.js
│   │   ├── pets.js
│   │   ├── dashboard.js
│   │   └── api.js
│   │
│   └── img/
│
│
├── .gitignore
├── .env
├── .env.example
└── README.md

## ⚙️ Local Setup

### 📥 1. Clone the repository
```bash
git clone https://github.com/ayishahgoedar0908/VetPass.git
