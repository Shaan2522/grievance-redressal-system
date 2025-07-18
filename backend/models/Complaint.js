const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  citizenInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: 'Phone number must be 10 digits'
      }
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  complaintDetails: {
    department: {
      type: String,
      required: true,
      enum: ['Water Supply', 'Sanitation', 'Road', 'Electricity', 'Health', 'Education', 'Social Welfare', 'Transport', 'Others']
    },
    ward: {
      type: String,
      required: true,
      enum: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10']
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    // Added photo field for image storage
    photo: {
      data: Buffer,
      contentType: String,
      filename: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  },
  status: {
    type: String,
    enum: ['received', 'in_progress', 'resolved'],
    default: 'received'
  },
  timestamps: {
    submitted: {
      type: Date,
      default: Date.now
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['received', 'in_progress', 'resolved']
    },
    updatedBy: {
      type: String,
      default: 'System'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    message: {
      type: String,
      trim: true
    }
  }],
  assignedOfficer: {
    type: String,
    trim: true
  },
  estimatedResolution: {
    type: String,
    default: '7 days'
  }
}, {
  timestamps: true
});

// Index for faster queries
complaintSchema.index({ ticketId: 1 });
complaintSchema.index({ 'complaintDetails.department': 1 });
complaintSchema.index({ 'complaintDetails.ward': 1 });
complaintSchema.index({ status: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
