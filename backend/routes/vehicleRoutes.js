const express = require('express');
const router = express.Router();

const {auth, isEmployee} = require('../middleware/auth');

router.use(auth);

const {createNewVehicle, updateVehicleImages, getAllVehicles, deleteVehicle, updateVehicle, getSingleVehicle, searchRentalVehicles, createNewRental, getSingleRental, updateRentalPayment, getAllRentalsOfPerson, getAllRentals,deleteCorder} = require('../controllers/vehicleControllers');

router.route('/')
    .post(isEmployee, createNewVehicle) // create a new vehicle (employees & admins)
    .get(isEmployee, getAllVehicles) // get all vehicle data (employees & admins)
    .put(isEmployee, updateVehicle) // update vehicle details (employees & admins)

router.route('/images')
    .put(isEmployee, updateVehicleImages) // update vehicle images after creation of a vehicle (employee, admin)

router.route('/rental')
    .get(isEmployee, getAllRentals) // get all rentals (Admin, Employee)
    .post(createNewRental) // create a new rental record

router.route('/:vehicleId')
    .get(getSingleVehicle) // get single vehicle details
    .delete(isEmployee, deleteVehicle) // delete a vehicle (employees & admins)

router.route('/rental/search')
    .get(searchRentalVehicles) // get available vehicles in between a selected pickupDate & dropoffDate

router.route('/rental/payment')
    .put(updateRentalPayment) // update the rental pending payment

router.route('/rental/my')
    .get(getAllRentalsOfPerson) // get all rental of a person

router.route('/rental/:rentalId')
    .get(getSingleRental) // get details about a single rental
    
router.route('/rental/:id')
    .delete(deleteCorder) // Both employees and admins can access

module.exports = router;