const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Admin Schema (copy from your Admin.js model)
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['super_admin', 'department_admin', 'ward_admin'],
    default: 'department_admin'
  },
  permissions: {
    canViewAll: {
      type: Boolean,
      default: false
    },
    canEditStatus: {
      type: Boolean,
      default: true
    },
    canViewAnalytics: {
      type: Boolean,
      default: true
    }
  },
  assignedDepartments: [{
    type: String,
    enum: ['Water Supply', 'Sanitation', 'Road', 'Electricity', 'Health', 'Education', 'Social Welfare', 'Transport', 'Others']
  }],
  assignedWards: [{
    type: String,
    enum: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10']
  }],
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

// Function to hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Function to create admin manually
async function createAdmin(username, password, role = 'super_admin') {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`❌ Admin with username '${username}' already exists`);
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create admin document
    const admin = new Admin({
      username,
      password: hashedPassword,
      role,
      permissions: {
        canViewAll: true,
        canEditStatus: true,
        canViewAnalytics: true
      },
      assignedDepartments: role === 'super_admin' ? [] : ['Water Supply', 'Sanitation', 'Road'],
      assignedWards: role === 'super_admin' ? [] : ['Ward 1', 'Ward 2'],
      isActive: true
    });

    await admin.save();
    console.log(`✅ Admin created successfully:`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}`);
    console.log(`   Hashed Password: ${hashedPassword}`);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
}

// Function to just hash a password (for manual updates)
async function justHashPassword(password) {
  try {
    const hashedPassword = await hashPassword(password);
    console.log(`✅ Password hashed successfully:`);
    console.log(`   Original: ${password}`);
    console.log(`   Hashed: ${hashedPassword}`);
    console.log(`\n📝 Copy this hashed password to update your MongoDB document manually.`);
    return hashedPassword;
  } catch (error) {
    console.error('❌ Error hashing password:', error);
  }
}

// Main function to run the script
async function main() {
  await connectDB();
  
  // Choose one of these options:
  
  // OPTION 1: Create complete admin documents
  await createAdmin('admin', 'password', 'super_admin');
  await createAdmin('ward_admin', 'ward123', 'ward_admin');
  await createAdmin('dept_admin', 'dept123', 'department_admin');
  
  // OPTION 2: Just hash passwords for manual update
  // await justHashPassword('password');
  // await justHashPassword('newpassword123');
  
  // Close connection
  await mongoose.connection.close();
  console.log('\n🔐 Admin management completed. MongoDB connection closed.');
}

// Run the script
main().catch(console.error);
