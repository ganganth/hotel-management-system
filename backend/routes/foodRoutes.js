const express = require('express');
const router = express.Router();

const {auth, isEmployee} = require('../middleware/auth');

router.use(auth);

const {createNewMenu, getAllMenus, deleteMenu, getSingleMenu, updateSingleMeal, getSingleMenuUser, createNewOrder, getPopularCategories, getAllOrdersOfACustomer, getAllFoodOrders, getSingleOrderDetails,deleteCorder} = require('../controllers/foodControllers');

router.route('/')
    .get(getAllMenus)
    .post(isEmployee, createNewMenu)

router.route('/order')
    .get(isEmployee, getAllFoodOrders)
    .post(createNewOrder) // place a new food order

router.route('/order/:id')
    .delete(deleteCorder) // Both employees and admins can access

router.route('/order/single/:id')
    .get(getSingleOrderDetails) // get more details about a single order

router.route('/order/:customerId')
    .get(getAllOrdersOfACustomer) // get all food orders of a customer

router.route('/popular-categories')
    .get(isEmployee, getPopularCategories)

router.route('/user/:menuId')
    .get(getSingleMenuUser)

router.route('/:menuId')
    .get(getSingleMenu)
    .delete(isEmployee, deleteMenu)



router.route('/meal/update')
    .put(isEmployee, updateSingleMeal)


module.exports = router;