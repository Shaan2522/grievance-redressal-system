const Complaint = require('../models/Complaint');
const { generateTicketId, getStatusLabel } = require('../utils/ticketGenerator');

// Submit new complaint with optional photo
const submitComplaint = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      ward,
      department,
      complaintType,
      description,
      address,
      priority
    } = req.body;

    // Generate unique ticket ID
    const ticketId = generateTicketId();

    // Prepare complaint data
    const complaintData = {
      ticketId,
      citizenInfo: {
        name,
        phone,
        email
      },
      complaintDetails: {
        department,
        ward,
        type: complaintType,
        description,
        address,
        priority: priority || 'medium'
      },
      statusHistory: [{
        status: 'received',
        updatedBy: 'System',
        message: 'Complaint received and assigned ticket number',
        timestamp: new Date()
      }]
    };

    // Add photo data if uploaded
    if (req.file) {
      complaintData.complaintDetails.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
        uploadedAt: new Date()
      };
    }

    // Create complaint
    const complaint = new Complaint(complaintData);
    await complaint.save();

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: {
        ticketId: complaint.ticketId,
        status: getStatusLabel(complaint.status),
        estimatedResolution: complaint.estimatedResolution,
        submittedAt: complaint.timestamps.submitted,
        hasPhoto: !!req.file
      }
    });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting complaint',
      error: error.message
    });
  }
};

// Get complaint photo
const getComplaintPhoto = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const complaint = await Complaint.findOne({ ticketId });

    if (!complaint || !complaint.complaintDetails.photo || !complaint.complaintDetails.photo.data) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found for this complaint'
      });
    }

    const photo = complaint.complaintDetails.photo;
    
    res.set({
      'Content-Type': photo.contentType,
      'Content-Disposition': `inline; filename="${photo.filename}"`
    });
    
    res.send(photo.data);
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching photo',
      error: error.message
    });
  }
};

// Track complaint by ticket ID
const trackComplaint = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const complaint = await Complaint.findOne({ ticketId });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found with this ticket ID'
      });
    }

    const responseData = {
      id: complaint.ticketId,
      name: complaint.citizenInfo.name,
      phone: complaint.citizenInfo.phone,
      email: complaint.citizenInfo.email,
      department: complaint.complaintDetails.department,
      ward: complaint.complaintDetails.ward,
      complaintType: complaint.complaintDetails.type,
      description: complaint.complaintDetails.description,
      address: complaint.complaintDetails.address,
      priority: complaint.complaintDetails.priority,
      status: complaint.status,
      submittedAt: complaint.timestamps.submitted,
      estimatedResolution: complaint.estimatedResolution,
      hasPhoto: !!(complaint.complaintDetails.photo && complaint.complaintDetails.photo.data),
      updates: complaint.statusHistory.map(update => ({
        date: update.timestamp,
        status: update.status,
        message: update.message,
        officer: update.updatedBy
      }))
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error tracking complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking complaint',
      error: error.message
    });
  }
};

// Get all complaints with filters and pagination
const getAllComplaints = async (req, res) => {
  try {
    const { 
      status, 
      department, 
      ward, 
      priority, 
      page = 1, 
      limit = 10,
      sortBy = 'timestamps.submitted',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (department && department !== 'all') filter['complaintDetails.department'] = department;
    if (ward && ward !== 'all') filter['complaintDetails.ward'] = ward;
    if (priority && priority !== 'all') filter['complaintDetails.priority'] = priority;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const complaints = await Complaint.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const total = await Complaint.countDocuments(filter);

    // Transform data for frontend
    const transformedComplaints = complaints.map(complaint => ({
      id: complaint._id,
      ticketId: complaint.ticketId,
      name: complaint.citizenInfo.name,
      phone: complaint.citizenInfo.phone,
      department: complaint.complaintDetails.department,
      ward: complaint.complaintDetails.ward,
      complaintType: complaint.complaintDetails.type,
      description: complaint.complaintDetails.description,
      priority: complaint.complaintDetails.priority,
      status: complaint.status,
      submittedAt: complaint.timestamps.submitted,
      assignedOfficer: complaint.assignedOfficer || 'Not Assigned',
      hasPhoto: !!(complaint.complaintDetails.photo && complaint.complaintDetails.photo.data)
    }));

    res.json({
      success: true,
      data: transformedComplaints,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints',
      error: error.message
    });
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Update status and add to history
    complaint.status = status;
    complaint.timestamps.lastUpdated = new Date();
    complaint.statusHistory.push({
      status,
      updatedBy: req.admin?.username || 'Admin',
      message: message || `Status updated to ${getStatusLabel(status)}`,
      timestamp: new Date()
    });

    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: {
        id: complaint._id,
        ticketId: complaint.ticketId,
        status: complaint.status,
        lastUpdated: complaint.timestamps.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating complaint status',
      error: error.message
    });
  }
};

// Get complaint by ID (for admin detail view)
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const responseData = {
      ...complaint.toObject(),
      hasPhoto: !!(complaint.complaintDetails.photo && complaint.complaintDetails.photo.data)
    };

    // Remove binary photo data from response (use separate endpoint for photo)
    if (responseData.complaintDetails.photo) {
      delete responseData.complaintDetails.photo.data;
    }

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching complaint',
      error: error.message
    });
  }
};

module.exports = {
  submitComplaint,
  trackComplaint,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintById,
  getComplaintPhoto
};
