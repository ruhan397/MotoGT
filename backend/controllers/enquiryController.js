
const Enquiry = require('../models/Enquiry');

const validStatuses = ['New', 'Replied', 'Resolved'];

// Customer submits an enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body || {};

    const enquiryData = {
      fullName: fullName?.trim(),
      email: email?.trim().toLowerCase(),
      phone: phone?.trim(),
      subject: subject?.trim(),
      message: message?.trim(),
    };

    if (Object.values(enquiryData).some((value) => !value)) {
      return res.status(400).json({
        message: 'Please complete all fields.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(enquiryData.email)) {
      return res.status(400).json({
        message: 'Please enter a valid email address.',
      });
    }

    const enquiry = await Enquiry.create(enquiryData);

    return res.status(201).json({
      message: 'Your enquiry has been submitted successfully.',
      enquiry,
    });
  } catch (error) {
    console.error('Create Enquiry Error:', error.message);

    return res.status(500).json({
      message: 'Could not submit your enquiry. Please try again.',
    });
  }
};

// Admin gets all enquiries
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return res.status(200).json(enquiries);
  } catch (error) {
    console.error('Get Enquiries Error:', error.message);

    return res.status(500).json({
      message: 'Could not load enquiries.',
    });
  }
};

// Admin updates enquiry status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body || {};

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid enquiry status.',
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        message: 'Enquiry not found.',
      });
    }

    return res.status(200).json({
      message: 'Enquiry status updated.',
      enquiry,
    });
  } catch (error) {
    console.error('Update Enquiry Error:', error.message);

    return res.status(500).json({
      message: 'Could not update enquiry status.',
    });
  }
};
