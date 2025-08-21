# RBAC API System

A comprehensive **Role-Based Access Control (RBAC) API** built with Node.js, Express, and MongoDB. This system provides secure user authentication, authorization, and granular permission management for modern web applications.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Granular permission system
- **User Management** - Complete CRUD operations for users
- **Role Management** - Dynamic role creation and assignment
- **Permission System** - Fine-grained access control
- **Input Validation** - Joi schema validation for all endpoints
- **Error Handling** - Centralized error handling with standardized responses
- **Password Security** - bcrypt hashing with salt rounds
- **Database Seeding** - Pre-configured roles and permissions

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.0 or later)
- [MongoDB](https://www.mongodb.com/) (version 4.0 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation

1. **Clone the repository**
   ```
   git clone https://github.com/shehzab/RBAC-system
   cd RBAC-system
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```
   # Database
   MONGODB_URI=mongodb://localhost:27017/rbac_db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # Server
   PORT=5000
   NODE_ENV=development
   ```

4. **Seed the database** (Optional)
   ```
   node seed.js
   ```

5. **Start the server**
   ```
   # Development
   npm run dev
   

The API will be available at `http://localhost:5000`

## 🏗️ Project Structure

```
├── config/
│   └── database.js          # Database connection setup
├── controllers/
│   ├── adminController.js   # Admin operations
│   ├── authController.js    # Authentication logic
│   ├── permissionController.js
│   ├── roleController.js
│   └── userController.js
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   ├── authorize.js        # Permission-based authorization
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Request validation middleware
├── models/
│   ├── User.js            # User schema
│   ├── Role.js            # Role schema
│   ├── Permission.js      # Permission schema
│   └── RolePermissionMap.js
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── users.js           # User management routes
│   ├── roles.js           # Role management routes
│   ├── permissions.js     # Permission management routes
│   └── admin.js           # Admin routes
├── schemas/
│   └── index.js           # Joi validation schemas
├── utils/
│   ├── apiResponse.js     # Standardized API responses
│   └── generateToken.js   # JWT token generation
├── seed.js                # Database seeding script
└── server.js              # Application entry point
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |

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
```
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login
```
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Access protected route
```
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create a new role (Admin only)
```
curl -X POST http://localhost:5000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "moderator",
    "description": "Moderator role with limited admin privileges"
  }'
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/rbac_db` | Yes |
| `JWT_SECRET` | Secret key for JWT token generation | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` | No |
| `PORT` | Server port | `5000` | No |
| `NODE_ENV` | Node environment | `development` | No |


## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Password reset functionality is currently a placeholder implementation
- No rate limiting implemented yet
- Missing unit and integration tests

## 🔮 Future Enhancements

- [ ] Add refresh token mechanism
- [ ] Implement email verification
- [ ] Add API rate limiting
- [ ] Add comprehensive logging
- [ ] Add API documentation with Swagger/OpenAPI
- [ ] Add unit and integration tests
- [ ] Add Docker support
- [ ] Add audit logging for permission changes

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub or contact sinanshehzab@gmail.com / LinkedIn : https://www.linkedin.com/in/shehzab/.

---

**Built with ❤️ using Node.js, Express, and MongoDB**
