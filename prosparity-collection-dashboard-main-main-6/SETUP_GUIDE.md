# Setup Guide for Role-Based Authentication System

## Overview

This guide will help you set up the complete role-based authentication system for the Prosparity Collection Dashboard. The system includes three user roles: Admin, RM (Relationship Manager), and TL (Team Lead).

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ or Bun installed
- Backend server running on port 8000
- Frontend development server

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Activate Virtual Environment
```bash
source env/bin/activate  # On macOS/Linux
# or
env\Scripts\activate     # On Windows
```

**Important**: Make sure you're in the `backend` directory, not the root project directory!

### 3. Create Admin User
```bash
python create_admin_user.py
```
This will create an admin user with:
- Email: `admin@prosparity.com`
- Password: `Admin@123`
- Role: `admin`

### 4. Create Test Users
```bash
python create_test_users.py
```
This will create test users for RM and TL roles:
- RM: `rm@prosparity.com` / `password`
- TL: `tl@prosparity.com` / `password`

### 5. Start Backend Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend Setup

### 1. Open a NEW Terminal Window/Tab
Keep the backend running in the first terminal.

### 2. Navigate to Frontend Directory
```bash
cd Front-end
```

### 3. Install Dependencies
```bash
npm install
# or
bun install
```

### 4. Start Development Server
```bash
npm run dev
# or
bun run dev
```

### 5. Access the Application
Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Testing the Authentication System

### 1. Access Login Page
- Navigate to `/login` in your browser
- You should see the login form

### 2. Test Admin Login
- Email: `admin@prosparity.com`
- Password: `Admin@123`
- Click "Sign In"
- You should be redirected to the dashboard
- You should see the "Pending Approvals" component (admin only)

### 3. Test RM Login
- Logout and go back to `/login`
- Email: `rm@prosparity.com`
- Password: `password`
- Click "Sign In"
- You should be redirected to the dashboard
- You should NOT see the "Pending Approvals" component

### 4. Test TL Login
- Logout and go back to `/login`
- Email: `tl@prosparity.com`
- Password: `password`
- Click "Sign In"
- You should be redirected to the dashboard
- You should NOT see the "Pending Approvals" component

## Role-Based Access Control

### Admin Role
- ✅ Full access to all features
- ✅ Can view and manage pending status approvals
- ✅ Can access admin settings
- ✅ Can manage users and roles

### RM Role
- ✅ Can access dashboard features
- ✅ Can view applications, analytics, and reports
- ❌ Cannot view pending status approvals
- ❌ Cannot access admin settings

### TL Role
- ✅ Can access dashboard features
- ✅ Can view applications, analytics, and reports
- ❌ Cannot view pending status approvals
- ❌ Cannot access admin settings

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure backend server is running on port 8000
   - Check if virtual environment is activated
   - Verify database connection

2. **Login Fails**
   - Ensure users are created in the database
   - Check email and password are correct
   - Verify backend authentication endpoints are working

3. **Role Access Issues**
   - Ensure users have correct roles assigned
   - Check role names match exactly: `admin`, `RM`, `TL`
   - Verify frontend role checking logic

4. **Frontend Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check TypeScript compilation errors
   - Verify all import paths are correct

5. **Virtual Environment Not Found**
   - Make sure you're in the `backend` directory
   - Run `ls` to see if `env` folder exists
   - If `env` doesn't exist, run the setup script first

### Debug Steps

1. **Check Backend Logs**
   - Look for authentication errors in backend console
   - Verify user creation was successful

2. **Check Frontend Console**
   - Open browser developer tools
   - Look for authentication-related errors
   - Check network requests to backend

3. **Verify Database**
   - Check if users exist in the database
   - Verify role assignments are correct

4. **Check Directory Structure**
   - Ensure you're in the correct directory
   - Backend commands should be run from `backend/` folder
   - Frontend commands should be run from `Front-end/` folder

## API Endpoints

The following endpoints should be working:

- `POST /api/v1/users/login` - User authentication
- `GET /api/v1/users/me` - Get current user info
- `POST /api/v1/users/logout` - User logout

## Security Notes

- JWT tokens are stored in localStorage
- Tokens expire after 30 minutes (configurable)
- All API requests include authentication headers
- Role validation happens on both client and server side

## Next Steps

After successful setup:

1. **Customize User Roles**: Modify role permissions as needed
2. **Add More Users**: Create additional users with appropriate roles
3. **Enhance Security**: Implement additional security measures
4. **User Management**: Build user management interface for admins

## Support

If you encounter issues:

1. Check this setup guide
2. Review the authentication README
3. Check backend and frontend console logs
4. Verify all prerequisites are met
5. Ensure database is properly configured
6. **Make sure you're in the correct directory for each command**
