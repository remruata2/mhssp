import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function createAdmin() {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    await User.create({
      username: 'admin@gmail.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin',
    });

    console.log('Admin user created successfully');
    console.log('\nPlease change the password after first login');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
