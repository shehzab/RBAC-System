# RBAC API System

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18%2B-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5%2B-green)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-blue)](https://swagger.io/)
[![Redis](https://img.shields.io/badge/Redis-Rate%20Limiting-red)](https://redis.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive **Role-Based Access Control (RBAC) API** built with Node.js, Express, and MongoDB. This system provides secure user authentication, authorization, and granular permission management for modern web applications.

## 🚀 Features

- **🔐 JWT Authentication** - Secure token-based authentication with refresh tokens
- **🔄 Refresh Token Mechanism** - Redis-based token rotation for secure sessions
- **📧 Email Verification** - Mandatory email confirmation with Nodemailer integration
- **🛡️ API Rate Limiting** - Redis-based rate limiting to prevent abuse
- **📊 Comprehensive Logging** - Winston logging with daily file rotation
- **📖 API Documentation** - Interactive Swagger/OpenAPI documentation
- **👥 Role-Based Access Control** - Granular permission system
- **👤 User Management** - Complete CRUD operations for users
- **🎯 Role Management** - Dynamic role creation and assignment
- **🔑 Permission System** - Fine-grained access control
- **✅ Input Validation** - Joi schema validation for all endpoints
- **⚡ Error Handling** - Centralized error handling with standardized responses
- **🔒 Password Security** - bcrypt hashing with 12 salt rounds
- **🌱 Database Seeding** - Pre-configured roles and permissions

## ⚡ Quick Start

```bash
# Clone and setup
git clone https://github.com/shehzab/RBAC-system
cd RBAC-system

# Install dependencies
npm install

# Setup environment (copy and edit with your values)
cp .env.example .env

# Start development server with auto-reload
npm run dev
```

The API will be available at `http://localhost:5000` with docs at `http://localhost:5000/api-docs`

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.0 or later)
- [MongoDB](https://www.mongodb.com/) (version 5.0 or later)
- [Redis](https://redis.io/) (version 6.0 or later - for rate limiting)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shehzab/RBAC-system
   cd RBAC-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/rbac_db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-refresh-token-secret-here
   JWT_REFRESH_EXPIRES_IN=7d
   REFRESH_TOKEN_EXPIRY_DAYS=7
   
   # Email Service (for verification)
   EMAIL_SERVICE=gmail
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@yourapp.com
   EMAIL_VERIFICATION_EXPIRY_HOURS=24
   
   # Redis (for rate limiting)
   REDIS_URL=redis://localhost:6379

   LOG_LEVEL=info
   

   ```

4. **Start required services**
   ```bash
   # Start MongoDB (varies by OS)
   sudo systemctl start mongod
   
   # Start Redis
   sudo systemctl start redis
   ```

5. **Seed the database** (Optional - creates default roles and permissions)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development with auto-reload
   npm run dev
   
   # Production
   npm start
   ```



## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Interactive Documentation
- **Swagger UI**: `http://localhost:5000/api-docs`


### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/refresh-token` | Refresh access token | No |
| POST | `/auth/logout` | Logout user (invalidate token) | No |
| POST | `/auth/logout-all` | Logout from all devices | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |
| POST | `/auth/verify-email` | Verify email address | No |
| POST | `/auth/resend-verification` | Resend verification email | No |

### User Endpoints

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|-------------------|
| GET | `/users` | Get all users | `manage_users` |
| GET | `/users/profile` | Get current user profile | Authenticated |
| PUT | `/users/profile` | Update current user profile | Authenticated |
| PUT | `/users/:id` | Update any user | `manage_users` |
| DELETE | `/users/:id` | Delete user | `manage_users` |

### Role Endpoints

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|-------------------|
| GET | `/roles` | Get all roles | Authenticated |
| POST | `/roles` | Create new role | `manage_roles` |
| PUT | `/roles/:id` | Update role | `manage_roles` |
| DELETE | `/roles/:id` | Delete role | `manage_roles` |

### Permission Endpoints

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|-------------------|
| GET | `/permissions` | Get all permissions | Authenticated |
| POST | `/permissions` | Create new permission | `manage_permissions` |
| PUT | `/permissions/:id` | Update permission | `manage_permissions` |
| DELETE | `/permissions/:id` | Delete permission | `manage_permissions` |

### Admin Endpoints

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|-------------------|
| PATCH | `/admin/users/:userId/role` | Assign role to user | `manage_users` |
| POST | `/admin/roles/:roleId/permissions` | Assign permission to role | `manage_users` |
| DELETE | `/admin/roles/:roleId/permissions/:permissionId` | Remove permission from role | `manage_users` |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | System health check |
| GET | `/api-docs` | Interactive API documentation |
| GET | `/api-docs.json` | Raw OpenAPI specification |

## 📋 API Response Examples

### Successful Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "68a855d74f95995c82ee1832",
      "email": "user@example.com",
      "role": "user",
      "isEmailVerified": true
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email must be a valid email address",
    "Password must be at least 6 characters"
  ]
}
```

## 🔐 Default Roles & Permissions

### Roles
- **admin** - Administrator with full permissions
- **user** - Regular user with basic permissions

### Permissions
- **view_profile** - Can view user profile
- **edit_profile** - Can edit own profile  
- **manage_users** - Can manage all users
- **manage_roles** - Can manage roles
- **manage_permissions** - Can manage permissions

## 🧪 Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login and get tokens
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Access protected route
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Refresh access token
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### Create a new role (Admin only)
```bash
curl -X POST http://localhost:5000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "moderator",
    "description": "Moderator role with limited admin privileges"
  }'
```

## 🛠️ Development Scripts

```bash
npm run dev      # Start development server with auto-reload
npm run seed     # Seed database with default roles/permissions
npm start        # Start production server
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/rbac_db` | Yes |
| `JWT_SECRET` | Secret key for JWT token generation | - | Yes |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration time | `7d` | No |
| `PORT` | Server port | `5000` | No |
| `NODE_ENV` | Node environment | `development` | No |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` | Yes |
| `EMAIL_SERVICE` | Email service provider | - | No |
| `EMAIL_USER` | Email service username | - | No |
| `EMAIL_PASS` | Email service password | - | No |

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contributing Guidelines
- Ensure all endpoints have proper Swagger documentation
- Add unit tests for new features
- Follow the existing code style
- Update the README with new features
- Test all authentication flows

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Email service configuration required for verification emails
- Redis required for production rate limiting

## 🔮 Future Enhancements

- [ ] Add unit and integration tests
- [ ] Add Docker support
- [ ] Add audit logging for permission changes
- [ ] Add two-factor authentication (2FA)
- [ ] Add social login (OAuth2)
- [ ] Add API client SDKs
- [ ] Add admin dashboard UI

## 🆘 Support

For support and questions:

- 📧 **Email**: sinanshehzab@gmail.com
- 💼 **LinkedIn**: [Shehzab](https://www.linkedin.com/in/shehzab/)
- 🐛 **Create an Issue**: [GitHub Issues](https://github.com/shehzab/RBAC-system/issues)
- 💬 **Discussion Forum**: [GitHub Discussions](https://github.com/shehzab/RBAC-system/discussions)

---

**Built with ❤️ using Node.js, Express, MongoDB, Redis, and Swagger**
