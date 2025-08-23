# 🎓 Student Freelancer Workplace

A full-stack web application that connects student freelancers with potential clients, allowing them to showcase their skills, build portfolios, and find opportunities while pursuing their education.

## ✨ Features

- **User Registration & Authentication**: Complete user registration with profile picture upload
- **Email Confirmation**: Automatic email notifications using Nodemailer
- **Profile Management**: CRUD operations on user profiles with image handling
- **Search & Discovery**: Find freelancers by skills, name, or expertise
- **Responsive Design**: Modern UI built with TailwindCSS
- **RESTful API**: Complete backend API with Express.js
- **Database Management**: MySQL database with proper indexing and relationships
- **File Upload**: Profile picture handling with Multer middleware
- **Security**: Input validation, error handling, and secure file operations

## 🛠️ Technology Stack

- **Frontend**: HTML5, TailwindCSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **File Upload**: Multer
- **Email Service**: Nodemailer
- **Authentication**: JWT
- **Validation**: Express-validator
- **Development**: Nodemon

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **Git** (for version control)
- **Postman** or **Thunder Client** (for API testing)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd student-freelancer-workplace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

1. Copy the environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=student_freelancer_db
   DB_PORT=3306

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=your_email@gmail.com

   # JWT Secret
   JWT_SECRET=your_secure_jwt_secret_key_here

   # File Upload
   UPLOAD_PATH=./uploads/profile-pictures
   MAX_FILE_SIZE=5242880
   ```

### 4. Database Setup

1. **Start MySQL service**
2. **Create database and tables**:
   ```bash
   mysql -u root -p < database/init.sql
   ```
   
   Or manually run the SQL commands in your MySQL client.

### 5. Email Configuration (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use the generated password** in your `.env` file

### 6. Create Upload Directory

```bash
mkdir -p uploads/profile-pictures
```

## 🏃‍♂️ Running the Application

### Development Mode (with Nodemon)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The application will be available at: `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### POST `/auth/login`
User login endpoint.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful! Welcome back! 🎉",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### GET `/auth/profile`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### User Management Endpoints

#### POST `/users/register`
Register a new user with profile picture.

**Request Body:** (multipart/form-data)
- `name`: Full name (required)
- `email`: Email address (required)
- `phone`: Phone number (required)
- `profile_picture`: Image file (required, max 5MB)
- `skills`: Skills description (optional)
- `bio`: Bio description (optional)
- `hourly_rate`: Hourly rate in USD (optional)

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully! Welcome to Student Freelancer Workplace! 🎉",
  "data": { ... }
}
```

#### GET `/users`
Get all users with pagination and search.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for name, email, or skills

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [ ... ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_users": 50,
      "limit": 10
    }
  }
}
```

#### GET `/users/:id`
Get user by ID.

#### PUT `/users/:id`
Update user profile (requires authentication).

#### DELETE `/users/:id`
Delete user (requires authentication).

## 🧪 Testing with Postman/Thunder Client

### 1. User Registration Test

**Request:**
- Method: `POST`
- URL: `http://localhost:3000/api/users/register`
- Body: `form-data`
- Fields:
  - `name`: "Test User"
  - `email`: "test@example.com"
  - `phone`: "+1234567890"
  - `profile_picture`: [Select image file]
  - `skills`: "Web Development, JavaScript"
  - `bio`: "A passionate developer"
  - `hourly_rate`: "25.00"

### 2. User Login Test

**Request:**
- Method: `POST`
- URL: `http://localhost:3000/api/auth/login`
- Body: `raw` (JSON)
- Content:
  ```json
  {
    "email": "test@example.com",
    "password": "temp"
  }
  ```

### 3. Get Users Test

**Request:**
- Method: `GET`
- URL: `http://localhost:3000/api/users?page=1&limit=5&search=developer`

## 📁 Project Structure

```
student-freelancer-workplace/
├── config/
│   ├── database.js          # Database configuration
│   └── emailService.js      # Email service setup
├── database/
│   └── init.sql             # Database initialization script
├── middleware/
│   └── upload.js            # File upload middleware
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   └── userRoutes.js        # User management routes
├── public/
│   ├── index.html           # Main application page
│   └── js/
│       └── app.js           # Frontend JavaScript
├── uploads/
│   └── profile-pictures/    # Profile picture storage
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── package.json             # Dependencies and scripts
├── server.js                # Main server file
└── README.md                # This file
```

## 🌐 Deployment

### Heroku Deployment

1. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

2. **Add MySQL addon:**
   ```bash
   heroku addons:create jawsdb:kitefin
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_production_jwt_secret
   heroku config:set EMAIL_USER=your_email@gmail.com
   heroku config:set EMAIL_PASS=your_app_password
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

### Render Deployment

1. **Connect your GitHub repository**
2. **Set environment variables** in Render dashboard
3. **Deploy automatically** on push to main branch

## 🔧 Development

### Adding New Features

1. **Create new route files** in `routes/` directory
2. **Add middleware** in `middleware/` directory
3. **Update database schema** in `database/init.sql`
4. **Test with Postman/Thunder Client**

### Code Style

- Use ES6+ features
- Follow Express.js best practices
- Implement proper error handling
- Add input validation for all endpoints
- Use async/await for database operations

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Email Not Sending:**
   - Verify Gmail app password
   - Check 2FA is enabled
   - Verify email configuration in `.env`

3. **File Upload Issues:**
   - Check upload directory permissions
   - Verify file size limits
   - Ensure proper file types

4. **Port Already in Use:**
   - Change PORT in `.env`
   - Kill existing process: `npx kill-port 3000`

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 🎯 Future Enhancements

- [ ] Project posting and bidding system
- [ ] Real-time chat between clients and freelancers
- [ ] Payment integration (Stripe/PayPal)
- [ ] Portfolio showcase with multiple images
- [ ] Review and rating system
- [ ] Advanced search and filtering
- [ ] Mobile app development
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Multi-language support

---

**Happy Coding! 🚀**

Built with ❤️ for student freelancers worldwide.
