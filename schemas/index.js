const Joi = require('joi');
const objectId = () => Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId');
// Auth schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
  userId: Joi.string().required()
});

const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required()
});



const updateProfileSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional()
}).min(1);


const roleSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
});

// Permission schemas
const permissionSchema = Joi.object({
  name: Joi.string().required(),
  action: Joi.string().valid('create', 'read', 'update', 'delete', 'manage').required(),
  resource: Joi.string().required(),
  description: Joi.string().required()
});


const assignRoleSchema = Joi.object({
  roleId: objectId().required()
});

const assignPermissionSchema = Joi.object({
  permissionId: objectId().required()
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  roleSchema,
  permissionSchema,
  assignRoleSchema,
  assignPermissionSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  resendVerificationSchema
};