const mongoose = require('mongoose');
const User = require('./src/models/UserModel');
const authService = require('./src/services/auth.services');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/pui')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

async function createAdminUser() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Username: admin');
            console.log('You can use this account to login');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await authService.hashPassword('admin123');

        // Create admin user
        const admin = await User.create({
            username: 'admin',
            email: 'admin@pui.com',
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Email: admin@pui.com');
        console.log('\nYou can now login with these credentials.');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
        process.exit(1);
    }
}

createAdminUser();
