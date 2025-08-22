const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  refreshTokens: [{
    token: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date();
  expires.setHours(expires.getHours() + parseInt(process.env.EMAIL_VERIFICATION_EXPIRY_HOURS) || 24);
  
  this.emailVerificationToken = token;
  this.emailVerificationExpires = expires;
  
  return this.save();
};

// Mark email as verified
userSchema.methods.verifyEmail = function() {
  this.isEmailVerified = true;
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
  return this.save();
};

// Compare entered password with stored hash
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add refresh token and clean up expired ones
userSchema.methods.addRefreshToken = function(token, expiresAt) {
  this.refreshTokens = this.refreshTokens.filter(t => t.expiresAt > new Date());
  this.refreshTokens.push({ token, expiresAt });

  // Keep only last 5 tokens (limit devices)
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
  
  return this.save();
};

// Remove specific refresh token
userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
  return this.save();
};

// Check if refresh token is valid
userSchema.methods.isValidRefreshToken = function(token) {
  const tokenData = this.refreshTokens.find(t => t.token === token);
  return tokenData && tokenData.expiresAt > new Date();
};

module.exports = mongoose.model('User', userSchema);
