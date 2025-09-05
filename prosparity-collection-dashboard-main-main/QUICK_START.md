# Quick Start Guide

## Step 1: Start Backend (Terminal 1)

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source env/bin/activate

# Create admin user
python create_admin_user.py

# Create test users
python create_test_users.py

# Start backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Step 2: Start Frontend (Terminal 2)

```bash
# Open a NEW terminal window/tab
# Navigate to frontend directory
cd Front-end

# Install dependencies (if not already done)
npm install
# or
bun install

# Start frontend server
npm run dev
# or
bun run dev
```

## Step 3: Test Authentication

1. Open browser and go to the frontend URL (usually `http://localhost:5173`)
2. You'll be redirected to `/login`
3. Use these credentials:

**Admin Login:**
- Email: `admin@prosparity.com`
- Password: `Admin@123`

**RM Login:**
- Email: `rm@prosparity.com`
- Password: `password`

**TL Login:**
- Email: `tl@prosparity.com`
- Password: `password`

## Common Issues & Solutions

### Issue: "source: no such file or directory: env/bin/activate"
**Solution:** Make sure you're in the `backend` directory, not the root project directory.

```bash
# Check current directory
pwd

# If you see "prosparity-collection-dashboard-main-main-6", run:
cd backend

# Then activate virtual environment
source env/bin/activate
```

### Issue: Frontend shows blank white screen
**Solution:** The `client` export issue has been fixed. Make sure both backend and frontend are running.

### Issue: Login fails
**Solution:** Make sure you've created the users first:
```bash
cd backend
source env/bin/activate
python create_admin_user.py
python create_test_users.py
```

## Directory Structure
```
prosparity-collection-dashboard-main-main-6/
├── backend/           # Run backend commands here
│   ├── env/          # Virtual environment
│   ├── app/          # Backend code
│   └── ...
└── Front-end/        # Run frontend commands here
    ├── src/          # Frontend code
    └── ...
```

## Success Indicators

✅ **Backend Running:**
- Terminal shows "Uvicorn running on http://0.0.0.0:8000"
- No error messages

✅ **Frontend Running:**
- Terminal shows localhost URL (e.g., "http://localhost:5173")
- Browser shows login page at `/login`

✅ **Authentication Working:**
- Can log in with test credentials
- Redirected to dashboard after login
- User role displayed in header
- Pending Approvals only visible for admin users
