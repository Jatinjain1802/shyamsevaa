import * as BookingModel from "../models/booking.model.js";

export const createBookings = async (req, res) => {
  const { order_id, pooja_date, devotee_name, gotra, mobile } = req.body;

  await BookingModel.createBookingsFromOrder({
    order_id,
    pooja_date,
    devotee_name,
    gotra,
    mobile,
  });

  res.json({ success: true, message: "Bookings created" });
};

export const getUserBookings = async (req, res) => {
  const data = await BookingModel.getBookingsByUser(req.user.id);
  res.json({ success: true, data });
};

/* ADMIN */

export const getAllBookings = async (req, res) => {
  const data = await BookingModel.getAllBookings();
  res.json({ success: true, data });
};

export const updateBookingStatus = async (req, res) => {
  await BookingModel.updateBookingStatus(
    req.params.bookingId,
    req.body.status
  );
  res.json({ success: true });
};
