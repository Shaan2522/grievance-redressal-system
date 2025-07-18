const Admin = require('../models/Admin');
const Complaint = require('../models/Complaint');
const jwt = require('jsonwebtoken');

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ username, isActive: true });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
          permissions: admin.permissions
        }
      }
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    
    // Get admin's complaint statistics
    const adminStats = await Complaint.aggregate([
      {
        $group: {
          _id: null,
          totalComplaints: { $sum: 1 },
          resolvedComplaints: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...admin.toObject(),
        stats: adminStats[0] || { totalComplaints: 0, resolvedComplaints: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Create default admin (for development)
const createDefaultAdmin = async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Default admin already exists'
      });
    }

    const admin = new Admin({
      username: 'admin',
      password: 'password',
      role: 'super_admin',
      permissions: {
        canViewAll: true,
        canEditStatus: true,
        canViewAnalytics: true
      }
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Default admin created successfully',
      data: {
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error creating default admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin',
      error: error.message
    });
  }
};

// Get all admins (for super admin)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admins',
      error: error.message
    });
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  createDefaultAdmin,
  getAllAdmins
};
