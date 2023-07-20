const express = require('express');
const router = express.Router();

const {auth, isEmployee} = require('../middleware/auth');

const roomControllers = require('../controllers/roomControllers');

router.use(auth);

router.route('/')
    .get(roomControllers.getAllRoomTypes)
    .post(isEmployee, roomControllers.createNewRoomType)

router.route('/images')
    .put(isEmployee, roomControllers.updateRoomTypeImages)

router.route('/special-features')
    .get(roomControllers.getAllSpecialFeatures)


router.route('/bookings')
    .post(roomControllers.createNewBooking) // create a new booking record

router.route('/bookings/all/:id')
.delete(roomControllers.deleteCorder) // Both employees and admins can access

router.route('/bookings/monthly-report')
    .get(isEmployee, roomControllers.getMonthlyBookingsReport)

router.route('/:id')
    .get(roomControllers.getSingleRoomType)

router.route('/bookings/available-rooms')
    .get(roomControllers.getAvailableRoomsForBooking)

router.route('/bookings/all')
    .get(isEmployee, roomControllers.getAllBookings) // get all bookings (Admin, Employee)
    

router.route('/bookings/:id')
    .get(roomControllers.getSingleBooking) // get details about single booking
    .put(roomControllers.updateBookingPaymentStatus) // update booking payment status

router.route('/bookings/customer/:id')
    .get(roomControllers.getAllBookingsOfACustomer) // get all the bookings of a customer





module.exports = router;