import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from './models/Role.js';
import Permission from './models/Permission.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Clear existing data
    await Role.deleteMany({});
    await Permission.deleteMany({});
    console.log('Cleared existing data');

    // Create default roles
    const roles = await Role.create([
      {
        name: 'user',
        description: 'Regular user with basic permissions'
      },
      {
        name: 'admin',
        description: 'Administrator with full permissions'
      }
    ]);
    console.log('Created default roles');

    // Create basic permissions
    const permissions = await Permission.create([
      {
        name: 'view_profile',
        action: 'read',
        resource: 'profile',
        description: 'Can view user profile'
      },
      {
        name: 'edit_profile', 
        action: 'update',
        resource: 'profile',
        description: 'Can edit own profile'
      },
      {
        name: 'manage_users',
        action: 'manage',
        resource: 'users',
        description: 'Can manage all users'
      },
      {
        name: 'manage_roles',
        action: 'manage', 
        resource: 'roles',
        description: 'Can manage roles'
      },
      {
        name: 'manage_permissions',
        action: 'manage',
        resource: 'permissions', 
        description: 'Can manage permissions'
      }
    ]);
    console.log('Created default permissions');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();