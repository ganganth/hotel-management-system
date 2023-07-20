const express = require('express');
const router = express.Router();

const {auth, isAdmin} = require('../middleware/auth');

const employeeControllers = require('../controllers/employeeControllers');

router.use(auth, isAdmin);

router.route('/')
    .get(employeeControllers.getAllEmployees) // only for admins
    .post(employeeControllers.createNewEmployee) // only for admins
    .put(employeeControllers.updateEmployee) // only for admins
    
router.route('/:id')
    .get(employeeControllers.getEmployee) // only for admins
    .delete(employeeControllers.deleteEmployee) // only for admins
  
module.exports = router;