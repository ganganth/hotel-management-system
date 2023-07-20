const db = require('../config/db');



const getAllCustomers = async (req, res, next) => {
    try {
        const [result] = await db.query("SELECT id, username, role, firstName, lastName, address, street, city, email, phone, gender, avatar FROM customer WHERE isActive = ? ", ["yes"]);
        res.status(200).json({message: 'Success', customers: result});
        
    } catch (err) {
        next(err);
    }
}


const deleteCustomer = async (req, res, next) => {
    const id = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM customer WHERE id = ?", [id]);

        if(result.length === 0) return res.status(404).json({message: 'Customer not found'});

        // delete customer
        await db.query("DELETE FROM customer WHERE id = ?", [id]);

        res.status(200).json({message: 'Customer Removed'});
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllCustomers,
    deleteCustomer
}