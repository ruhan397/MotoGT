
const mongoose = require('mongoose');

const workshopSettingsSchema = new mongoose.Schema(
  {
    maxVehicles: {
      type: Number,
      default: 5,
      min: 1
    },

    dailyWorkCapacity: {
      type: Number,
      default: 2,
      min: 1
    },

    approvalLock: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'WorkshopSettings',
  workshopSettingsSchema
);
