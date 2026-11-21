
const Appointment = require('../models/Appointment');
const WorkshopSettings = require('../models/WorkshopSettings');
const User = require('../models/User');

// Friday is the weekly workshop holiday
const isFriday = (dateString) => {
  const date = new Date(`${dateString}T12:00:00`);
  return date.getDay() === 5;
};

// Get or create workshop settings
const getWorkshopSettings = async () => {
  let settings = await WorkshopSettings.findOne();

  if (!settings) {
    settings = await WorkshopSettings.create({
      maxVehicles: 5,
      dailyWorkCapacity: 2,
      approvalLock: 0
    });
  }

  return settings;
};

// Format date as YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// Add one calendar day
const addCalendarDay = (dateString) => {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + 1);
  return formatDate(date);
};

// Return working dates, including the starting date.
// Fridays are skipped and are not counted as workdays.
const getWorkingDates = (startDate, durationDays) => {
  const workingDates = [];
  let currentDate = startDate;

  while (workingDates.length < durationDays) {
    if (!isFriday(currentDate)) {
      workingDates.push(currentDate);
    }

    currentDate = addCalendarDay(currentDate);
  }

  return workingDates;
};

// Add working days and return the final working date
const addWorkingDays = (startDate, durationDays) => {
  const dates = getWorkingDates(startDate, durationDays);
  return dates[dates.length - 1];
};

// Check workshop capacity on every working day
const checkCapacity = async (
  startDate,
  durationDays,
  settings,
  excludeId = null
) => {
  if (isFriday(startDate)) {
    return {
      available: false,
      message: 'MotoGT Workshop is closed on Fridays.'
    };
  }

  const workingDates = getWorkingDates(startDate, durationDays);

  for (const currentDate of workingDates) {
    const dateFilter = {
      status: 'Approved',
      preferredStartDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    };

    if (excludeId) {
      dateFilter._id = { $ne: excludeId };
    }

    const activeAppointments = await Appointment.find(dateFilter);

    const vehicleCount = activeAppointments.length;
    const activeWorkCount = activeAppointments.length;

    if (vehicleCount >= settings.maxVehicles) {
      return {
        available: false,
        message: `${currentDate}: Workshop vehicle capacity is full.`
      };
    }

    if (activeWorkCount >= settings.dailyWorkCapacity) {
      return {
        available: false,
        message: `${currentDate}: Daily work capacity is full.`
      };
    }
  }

  return { available: true };
};

// Customer: Create appointment request (logged-in or guest)
const createAppointment = async (req, res) => {
  try {
    const {
      customerName: guestName,
      email: guestEmail,
      phone,
      vehicleModel,
      service,
      problemDescription,
      preferredStartDate
    } = req.body;

    if (
      !phone?.trim() ||
      !vehicleModel?.trim() ||
      !service ||
      !preferredStartDate
    ) {
      return res.status(400).json({
        message: 'Please complete all required fields.'
      });
    }

    let user = null;
    let customerName = guestName;
    let email = guestEmail;

    // Logged-in customer
    if (req.user?.id) {
      user = await User.findById(req.user.id).select(
        'fullName email phone'
      );

      if (!user) {
        return res.status(404).json({
          message: 'Customer account not found. Please login again.'
        });
      }

      customerName = user.fullName;
      email = user.email;
    } else {
      // Guest customer
      if (!customerName?.trim() || !email?.trim()) {
        return res.status(400).json({
          message: 'Please provide your name and email address.'
        });
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email.trim())) {
        return res.status(400).json({
          message: 'Please provide a valid email address.'
        });
      }
    }

    const selectedDate = new Date(`${preferredStartDate}T12:00:00`);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      formatDate(selectedDate) !== preferredStartDate
    ) {
      return res.status(400).json({
        message: 'Please select a valid appointment date.'
      });
    }

    const today = formatDate(new Date());

    if (preferredStartDate < today) {
      return res.status(400).json({
        message: 'Past dates cannot be selected.'
      });
    }

    if (isFriday(preferredStartDate)) {
      return res.status(400).json({
        message: 'MotoGT Workshop is closed on Fridays. Please select another date.'
      });
    }

    const settings = await getWorkshopSettings();

    const capacity = await checkCapacity(
      preferredStartDate,
      1,
      settings
    );

    if (!capacity.available) {
      return res.status(409).json({
        message: capacity.message
      });
    }

    const appointment = await Appointment.create({
      ...(user ? { userId: user._id } : {}),
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      vehicleModel: vehicleModel.trim(),
      service,
      problemDescription: problemDescription || '',
      preferredStartDate,
      status: 'Pending'
    });

    return res.status(201).json({
      message: 'Appointment request submitted successfully.',
      appointment
    });

  } catch (error) {
    console.error('Create Appointment Error:', error);

    return res.status(500).json({
      message: 'Unable to submit appointment request.'
    });
  }
};

// Customer: View own appointments
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json(appointments);

  } catch (error) {
    console.error('Get My Appointments Error:', error);

    return res.status(500).json({
      message: 'Unable to fetch your appointments.'
    });
  }
};

// Customer: Get available start dates
const getAvailableDates = async (req, res) => {
  try {
    const settings = await getWorkshopSettings();
    const today = new Date();
    const availableDates = [];

    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dateString = formatDate(date);

      // Skip Fridays
      if (isFriday(dateString)) {
        continue;
      }

      const result = await checkCapacity(
        dateString,
        1,
        settings
      );

      if (result.available) {
        availableDates.push(dateString);
      }
    }

    return res.status(200).json(availableDates);

  } catch (error) {
    console.error('Get Available Dates Error:', error);

    return res.status(500).json({
      message: 'Unable to fetch available dates.'
    });
  }
};

// Admin: View all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 });

    return res.status(200).json(appointments);

  } catch (error) {
    console.error('Get All Appointments Error:', error);

    return res.status(500).json({
      message: 'Unable to fetch appointments.'
    });
  }
};

// Admin: Approve appointment and reserve capacity
const approveAppointment = async (req, res) => {
  let lockAcquired = false;
  let settings = null;

  try {
    const { durationDays, adminNote } = req.body;

    if (![2, 3, 4].includes(Number(durationDays))) {
      return res.status(400).json({
        message: 'Duration must be 2, 3, or 4 working days.'
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.'
      });
    }

    if (appointment.status !== 'Pending') {
      return res.status(400).json({
        message: 'Only pending appointments can be approved.'
      });
    }

    if (isFriday(appointment.preferredStartDate)) {
      return res.status(400).json({
        message: 'Appointments cannot start on Friday.'
      });
    }

    settings = await getWorkshopSettings();

    const lock = await WorkshopSettings.findOneAndUpdate(
      {
        _id: settings._id,
        approvalLock: 0
      },
      {
        $set: { approvalLock: 1 }
      },
      { new: true }
    );

    if (!lock) {
      return res.status(409).json({
        message: 'Another approval is in progress. Please try again.'
      });
    }

    lockAcquired = true;

    const currentAppointment = await Appointment.findOne({
      _id: appointment._id,
      status: 'Pending'
    });

    if (!currentAppointment) {
      return res.status(409).json({
        message: 'This appointment has already been processed.'
      });
    }

    const capacity = await checkCapacity(
      currentAppointment.preferredStartDate,
      Number(durationDays),
      settings
    );

    if (!capacity.available) {
      return res.status(409).json({
        message: capacity.message
      });
    }

    currentAppointment.durationDays = Number(durationDays);

    currentAppointment.endDate = addWorkingDays(
      currentAppointment.preferredStartDate,
      Number(durationDays)
    );

    currentAppointment.status = 'Approved';
    currentAppointment.adminNote = adminNote || '';

    await currentAppointment.save();

    return res.status(200).json({
      message: 'Appointment approved and workshop capacity reserved.',
      appointment: currentAppointment
    });

  } catch (error) {
    console.error('Approve Appointment Error:', error);

    return res.status(500).json({
      message: 'Unable to approve appointment.'
    });

  } finally {
    if (lockAcquired && settings) {
      await WorkshopSettings.updateOne(
        {
          _id: settings._id,
          approvalLock: 1
        },
        {
          $set: { approvalLock: 0 }
        }
      );
    }
  }
};

// Admin: Reject appointment
const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.'
      });
    }

    if (appointment.status !== 'Pending') {
      return res.status(400).json({
        message: 'Only pending appointments can be rejected.'
      });
    }

    appointment.status = 'Rejected';
    appointment.adminNote = req.body.adminNote || '';

    await appointment.save();

    return res.status(200).json({
      message: 'Appointment rejected.',
      appointment
    });

  } catch (error) {
    console.error('Reject Appointment Error:', error);

    return res.status(500).json({
      message: 'Unable to reject appointment.'
    });
  }
};

// Admin: Complete appointment and release capacity
const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.'
      });
    }

    if (appointment.status !== 'Approved') {
      return res.status(400).json({
        message: 'Only approved appointments can be completed.'
      });
    }

    appointment.status = 'Completed';

    await appointment.save();

    return res.status(200).json({
      message: 'Appointment completed. Workshop capacity released.',
      appointment
    });

  } catch (error) {
    console.error('Complete Appointment Error:', error);

    return res.status(500).json({
      message: 'Unable to complete appointment.'
    });
  }
};

// Admin: Update workshop capacity settings
const updateWorkshopSettings = async (req, res) => {
  try {
    const { maxVehicles, dailyWorkCapacity } = req.body;

    if (
      !Number.isInteger(Number(maxVehicles)) ||
      !Number.isInteger(Number(dailyWorkCapacity)) ||
      Number(maxVehicles) < 1 ||
      Number(dailyWorkCapacity) < 1 ||
      Number(dailyWorkCapacity) > Number(maxVehicles)
    ) {
      return res.status(400).json({
        message: 'Please provide valid workshop capacity values.'
      });
    }

    const settings = await getWorkshopSettings();

    const updatedSettings = await WorkshopSettings.findByIdAndUpdate(
      settings._id,
      {
        $set: {
          maxVehicles: Number(maxVehicles),
          dailyWorkCapacity: Number(dailyWorkCapacity)
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      message: 'Workshop settings updated successfully.',
      settings: updatedSettings
    });

  } catch (error) {
    console.error('Update Workshop Settings Error:', error);

    return res.status(500).json({
      message: 'Unable to update workshop settings.'
    });
  }
};

// Admin: View workshop settings
const getWorkshopSettingsForAdmin = async (req, res) => {
  try {
    const settings = await getWorkshopSettings();

    return res.status(200).json(settings);

  } catch (error) {
    console.error('Get Workshop Settings Error:', error);

    return res.status(500).json({
      message: 'Unable to fetch workshop settings.'
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAvailableDates,
  getAllAppointments,
  approveAppointment,
  rejectAppointment,
  completeAppointment,
  updateWorkshopSettings,
  getWorkshopSettingsForAdmin
};