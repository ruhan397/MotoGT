
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

// Admin sends an email reply to a customer
exports.sendEnquiryReply = async (req, res) => {
  try {
    const { replyMessage } = req.body || {};

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({
        message: 'Please write a reply before sending.',
      });
    }

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        message: 'Enquiry not found.',
      });
    }

    const {
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      EMAILJS_PUBLIC_KEY,
    } = process.env;

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      return res.status(500).json({
        message: 'EmailJS configuration is incomplete.',
      });
    }

    const emailResponse = await fetch(
      'https://api.emailjs.com/api/v1.0/email/send',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: enquiry.email,
            customer_name: enquiry.fullName,
            subject: enquiry.subject,
            reply_message: replyMessage.trim(),
          },
        }),
      }
    );

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();

      console.error('EmailJS Error:', errorText);

      return res.status(502).json({
        message: 'Email could not be sent. Please try again.',
      });
    }

    enquiry.replies.push({
      message: replyMessage.trim(),
      sentTo: enquiry.email,
      sentAt: new Date(),
    });

    enquiry.status = 'Replied';

    await enquiry.save();

    return res.status(200).json({
      message: 'Reply sent successfully.',
      enquiry,
    });
  } catch (error) {
    console.error('Send Enquiry Reply Error:', error.message);

    return res.status(500).json({
      message: 'Could not send the reply. Please try again.',
    });
  }
};
