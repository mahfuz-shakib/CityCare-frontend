# CityCare - Public Infrastructure Issue Reporting System

A comprehensive digital platform that enables citizens to report public infrastructure issues such as broken streetlights, potholes, water leakage, garbage overflow, damaged footpaths, and more. Government staff and admins can efficiently manage, verify, assign, and resolve reported issues.

## 🌐 Live Site URL

https://city-care0.netlify.app/

## ✨ Key Features

- **🔐 Secure Authentication**: Firebase Authentication with email/password and Google Sign-in support
- **📱 Responsive Design**: Fully responsive across mobile, tablet, and desktop devices
- **👥 Role-Based Access Control**: Three distinct roles (Admin, Staff, Citizen) with role-specific dashboards and permissions
- **📊 Real-Time Issue Tracking**: Complete timeline tracking system showing issue lifecycle from creation to resolution
- **🔍 Advanced Search & Filtering**: Server-side search and filtering by category, status, priority, and location
- **📄 Pagination**: Efficient server-side pagination for better performance on large datasets
- **💳 Payment Integration**: Stripe payment integration for issue boosting (৳100) and premium subscriptions (৳1000)
- **📈 Analytics Dashboard**: Comprehensive statistics and charts for admins, staff, and citizens
- **🎯 Priority Management**: Boost issue priority for faster resolution with payment
- **👤 User Management**: Admin can manage citizens (block/unblock) and staff (create, update, delete)
- **📋 Issue Management**: Full CRUD operations for issues with status workflow (Pending → In-Progress → Working → Resolved → Closed)
- **🔔 Notifications**: SweetAlert2 and React Toastify for user-friendly notifications
- **📄 PDF Invoice Generation**: Downloadable payment invoices for both admin and users
- **🎨 Modern UI/UX**: Beautiful, polished interface with Framer Motion animations
- **🔒 Private Routes**: Persistent authentication with no redirect on page refresh
- **📊 Timeline System**: Complete audit trail of all issue actions and status changes
- **⭐ Upvote System**: Citizens can upvote issues to show public importance (one vote per user per issue)
- **💎 Premium Subscription**: Free users limited to 3 issues, premium users get unlimited reporting
- **🛡️ Security**: Environment variables for sensitive data, token verification, and role-based middleware

## 🚀 Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- DaisyUI
- TanStack Query (React Query)
- React Router
- Framer Motion
- Axios
- SweetAlert2
- React Toastify
- jsPDF

### Backend
- Node.js
- Express.js
- MongoDB
- Firebase Admin SDK
- Stripe

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Firebase project
- Stripe account

### Frontend Setup

```bash
cd CityCare-frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd city-care-server
npm install
npm run dev
```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend (.env)**
```
PORT=3000
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
STRIPE_SECRET=your_stripe_secret_key
SITE_DOMAIN=http://localhost:5173
FB_SERVICE_KEY=your_base64_encoded_firebase_service_account
```

## 🎯 User Roles

### Admin
- View all issues
- Assign staff to issues
- Reject issues
- Manage staff (create, update, delete)
- Manage citizens (block/unblock)
- View all payments and generate invoices
- View comprehensive analytics

### Staff
- View assigned issues only
- Change issue status (Pending → In-Progress → Working → Resolved → Closed)
- Add progress updates
- View assigned issues statistics

### Citizen
- Report issues (3 free, unlimited with premium)
- Edit/delete own issues (if status is pending)
- Boost issue priority (৳100 per issue)
- Subscribe to premium (৳1000 one-time)
- Track own issues
- Upvote issues (one per issue)
- View payment history

## 📱 Pages & Routes

### Public Routes
- `/` - Home page
- `/all-issues` - All issues page with search and filters
- `/login` - Login page
- `/register` - Registration page

### Private Routes (Citizen)
- `/dashboard/homepage` - Citizen dashboard
- `/dashboard/report-issue` - Report new issue
- `/dashboard/my-issues` - View own issues
- `/dashboard/payment-history` - Payment history
- `/dashboard/myProfile` - Profile management

### Private Routes (Staff)
- `/dashboard/homepage` - Staff dashboard
- `/dashboard/assigned-issues` - View assigned issues
- `/dashboard/myProfile` - Profile management

### Private Routes (Admin)
- `/dashboard/homepage` - Admin dashboard
- `/dashboard/all-issues` - Manage all issues
- `/dashboard/manage-users` - Manage citizens
- `/dashboard/manage-staffs` - Manage staff
- `/dashboard/payments` - View all payments
- `/dashboard/myProfile` - Profile management

## 🔐 Security Features

- Firebase token verification on all protected routes
- Role-based middleware for API endpoints
- Environment variables for sensitive data
- Private routes with persistent authentication
- Blocked user restrictions

## 📊 Issue Workflow

1. **Citizen reports issue** → Status: Pending
2. **Admin assigns staff** → Status: Pending (staff assigned)
3. **Staff starts work** → Status: In-Progress
4. **Staff continues work** → Status: Working
5. **Staff resolves** → Status: Resolved
6. **Staff closes** → Status: Closed

## 💳 Payment System

- **Issue Boost**: ৳100 per issue (increases priority to High)
- **Premium Subscription**: ৳1000 one-time (unlimited issue reporting)
- Stripe Checkout integration
- PDF invoice generation
- Payment history tracking

## 🎨 UI/UX Features

- Modern, clean design
- Smooth animations with Framer Motion
- Responsive across all devices
- Toast notifications for all actions
- Loading states with spinners
- Confirmation dialogs for critical actions
- Color-coded status badges
- Interactive charts and statistics

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

[Mahfuzur Rahman]

## 🙏 Acknowledgments

Built with ❤️ for better city infrastructure management.
