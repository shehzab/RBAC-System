const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'read', 'update', 'delete', 'manage']
  },
  resource: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Virtual for full permission name (action + resource)
permissionSchema.virtual('fullPermission').get(function() {
  return `${this.action}_${this.resource}`;
});

module.exports = mongoose.model('Permission', permissionSchema);