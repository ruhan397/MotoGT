
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    customerName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    vehicleModel: {
      type: String,
      required: true
    },

    service: {
      type: String,
      required: true
    },

    problemDescription: {
      type: String,
      trim: true,
      default: ''
    },

    preferredStartDate: {
      type: String,
      required: true
    },

    durationDays: {
      type: Number,
      enum: [2, 3, 4],
      default: null
    },

    endDate: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Approved',
        'Rejected',
        'Completed',
        'Cancelled'
      ],
      default: 'Pending'
    },

    adminNote: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
