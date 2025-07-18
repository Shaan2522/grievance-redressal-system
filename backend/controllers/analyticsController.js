const Complaint = require('../models/Complaint');

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    // Get total counts by status
    const statusCounts = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get counts by department
    const departmentCounts = await Complaint.aggregate([
      {
        $group: {
          _id: '$complaintDetails.department',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get counts by ward
    const wardCounts = await Complaint.aggregate([
      {
        $group: {
          _id: '$complaintDetails.ward',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get counts by priority
    const priorityCounts = await Complaint.aggregate([
      {
        $group: {
          _id: '$complaintDetails.priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total complaints
    const totalComplaints = await Complaint.countDocuments();

    // Format status counts
    const statusStats = {
      total: totalComplaints,
      received: 0,
      in_progress: 0,
      resolved: 0
    };

    statusCounts.forEach(item => {
      if (item._id) {
        statusStats[item._id] = item.count;
      }
    });

    // Format department counts
    const byDepartment = {};
    departmentCounts.forEach(item => {
      if (item._id) {
        byDepartment[item._id] = item.count;
      }
    });

    // Format ward counts
    const byWard = {};
    wardCounts.forEach(item => {
      if (item._id) {
        byWard[item._id] = item.count;
      }
    });

    // Format priority counts
    const byPriority = {};
    priorityCounts.forEach(item => {
      if (item._id) {
        byPriority[item._id] = item.count;
      }
    });

    // Get recent complaints (last 5)
    const recentComplaints = await Complaint.find()
      .sort({ 'timestamps.submitted': -1 })
      .limit(5)
      .select('ticketId citizenInfo.name complaintDetails.department status timestamps.submitted')
      .lean();

    res.json({
      success: true,
      data: {
        ...statusStats,
        byDepartment,
        byWard,
        byPriority,
        recentComplaints: recentComplaints.map(complaint => ({
          ticketId: complaint.ticketId,
          name: complaint.citizenInfo.name,
          department: complaint.complaintDetails.department,
          status: complaint.status,
          submittedAt: complaint.timestamps.submitted
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// Get trends data
const getTrends = async (req, res) => {
  try {
    const { period = '7' } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const trends = await Complaint.aggregate([
      {
        $match: {
          'timestamps.submitted': { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamps.submitted'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trends',
      error: error.message
    });
  }
};

// Get department-wise performance
const getDepartmentPerformance = async (req, res) => {
  try {
    const performance = await Complaint.aggregate([
      {
        $group: {
          _id: '$complaintDetails.department',
          total: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
            }
          },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'resolved'] },
                {
                  $divide: [
                    { $subtract: ['$timestamps.lastUpdated', '$timestamps.submitted'] },
                    1000 * 60 * 60 * 24 // Convert to days
                  ]
                },
                null
              ]
            }
          }
        }
      },
      {
        $addFields: {
          resolutionRate: {
            $multiply: [
              { $divide: ['$resolved', '$total'] },
              100
            ]
          }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    console.error('Error fetching department performance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching department performance',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getTrends,
  getDepartmentPerformance
};
