# 🚀 Quick Start Guide

Get the Student Freelancer Workplace application running in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy environment file
cp env.example .env

# Edit .env with your settings
# At minimum, set your MySQL password and Gmail app password
```

### 3. Setup Database
```bash
# Start MySQL service first, then:
mysql -u root -p < database/init.sql
```

### 4. Create Upload Directory
```bash
mkdir -p uploads/profile-pictures
```

### 5. Start Development Server
```bash
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **API Base**: http://localhost:3000/api
- **Uploads**: http://localhost:3000/uploads

## 🧪 Test the API

### Import Postman Collection
1. Open Postman
2. Import `postman/Student_Freelancer_Workplace.postman_collection.json`
3. Set `base_url` variable to `http://localhost:3000`

### Quick Test Flow
1. **Register User** → POST `/api/users/register`
2. **Login** → POST `/api/auth/login` (copy token)
3. **Set auth_token** variable in Postman
4. **Get Profile** → GET `/api/auth/profile`
5. **Browse Users** → GET `/api/users`

## 🔑 Required Environment Variables

```env
# Minimum required:
DB_PASSWORD=your_mysql_password
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=any_random_string_here
```

## 🐛 Common Issues

- **Port 3000 in use**: Change PORT in .env or kill process
- **Database connection failed**: Check MySQL is running
- **Email not sending**: Verify Gmail app password and 2FA

## 📚 Next Steps

- Read the full [README.md](README.md)
- Explore the API endpoints
- Customize the frontend
- Add new features

---

**Need help?** Check the [README.md](README.md) for detailed instructions!

