const express = require('express');
const router = express.Router();

const {auth, isEmployee} = require('../middleware/auth');

const { createNewEvent, getAllEvents, deleteEvent, getAllCommonEvents, getAllSpecialEvents, getOverallEventsData, createEventOrder, getAllEventOrdersOfCustomer, getAllEventOrders,deleteCorder } = require('../controllers/eventControllers');

router.use(auth);

router.route('/')
    .post(isEmployee, createNewEvent) // create a new event
    .get(getAllEvents) // get all events

router.route('/order')
    .get(getAllEventOrders) // get all event orders
    .post(createEventOrder) // create a new order

router.route('/order/:id')
    .delete(deleteCorder) // Both employees and admins can access

router.route('/order/customer')
    .get(getAllEventOrdersOfCustomer); // get all event orders of a customer

router.route('/common')
    .get(getAllCommonEvents) // get all common events

router.route('/special')
    .get(getAllSpecialEvents) // get all special events

router.route('/overall')
    .get(getOverallEventsData) // get overall events data

router.route('/:eventId')
    .delete(deleteEvent) // delete an event




module.exports = router;