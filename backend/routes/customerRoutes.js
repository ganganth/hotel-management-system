const express = require('express');
const router = express.Router();

const {auth, isEmployee} = require('../middleware/auth');

const customerControllers = require('../controllers/customerControllers');

router.use(auth, isEmployee);

router.route('/')
    .get(customerControllers.getAllCustomers) // Both employees and admins can access

router.route('/:id')
    .delete(customerControllers.deleteCustomer) // Both employees and admins can access


module.exports = router;