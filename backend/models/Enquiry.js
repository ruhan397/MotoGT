
const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Replied', 'Resolved'],
      default: 'New',
    },

    // Admin Email Reply History
    replies: [
      {
        message: {
          type: String,
          required: true,
          trim: true,
        },
        sentTo: {
          type: String,
          required: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
