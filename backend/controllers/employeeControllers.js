const db = require('../config/db');
const bcrypt = require('bcryptjs');


// @desc get all employees
// @route GET /api/employees
// @access Private (Admins)

const getAllEmployees = async (req, res, next) => {

    try {
        const [result] = await db.query("SELECT id, username, role, firstName, lastName, address, street, city, age, email, salary, phone, gender, avatar FROM employee");

        res.status(200).json({message: 'Success', employees: result})
    } catch (err) {
        next(err);
    }

}


// @desc create new employee
// @route POST /api/employees
// @access Private (Admin)

const createNewEmployee = async (req, res, next) => {
    const {username, password, role, firstName, lastName, address, street, city, age, email, salary, gender, avatar, phone} = req.body;

    if(!username || !password || !role || !firstName || !lastName || !address || !street || !city || +age <= 0 || !email || +salary <= 0 || !gender || !phone) {
        return res.status(400).json({message: 'Invalid Input Data'});
    }

    try {
        // check already existing user with the given username
        const [duplicate] = await db.query("SELECT * FROM employee WHERE username = ?", [username]);

        if(duplicate.length > 0) {
            // status 409 - stands for conflict
            return res.status(400).json({message: 'Username already exists'});
        }

        // no existing user found, so hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        let picUrl;
        if(avatar) {
            picUrl = avatar;
        } else {
            // default profile image
            picUrl = gender === 'male' ? 'https://firebasestorage.googleapis.com/v0/b/hotelmanagement-2553b.appspot.com/o/avatars%2Fmale1.png?alt=media&token=5a720f92-e2db-45b1-8499-9a95fc688358' : 'https://firebasestorage.googleapis.com/v0/b/hotelmanagement-2553b.appspot.com/o/avatars%2Ffemale.png?alt=media&token=d6519f65-40a9-4e9b-b801-ec1a6037bf93';
        }

        // insert new employee record
        await db.query(
            `INSERT INTO employee (username, password, role, firstName, lastName, address, street, city, age, email, salary, gender, avatar, phone)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
             [username, hashedPassword, role, firstName, lastName, address, street, city, +age, email, +salary, gender, picUrl, phone]
        )

        res.status(201).json({message: 'Employee Added'});
    } catch (err) {
        next(err);
    }

}


// @desc update employee
// @route PUT /api/employees
// @access Private (Admin)

const updateEmployee = async (req, res, next) => {

    console.log(req.body);

    const {id, username, password, role, firstName, lastName, address, street, city, age, email, salary, gender, avatar, phone} = req.body;

    // data check
    if(!id || !username || !role || !firstName || !lastName || !address || !street || !city || +age <= 0 || !email || +salary <= 0 || !gender || !avatar || !phone) {
        return res.status(400).json({message: 'Invalid Input Data'});
    }

    try {
        // find the existing user
        const [result] = await db.query("SELECT * FROM employee WHERE id = ?", [+id]);
        const employee = result[0];

        if(!employee) {
            return res.status(404).json({message: 'User not found'});
        }

        if(employee.username !== username) {
            // employee username needs to be updated, so check wether there is a user already exist with the new username
            const [duplicate] = await db.query("SELECT * FROM employee WHERE username = ?", [username]);

            if(duplicate.length > 0) {
                // username already taken, cannot update
                return res.status(400).json({message: `username ${username} is already taken`});
            }
        }

        let query, params;

        if(password) {
            // update the password also 
            // hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `UPDATE employee SET 
                username = ?, password = ?, role = ?, firstName = ?, lastName = ?, address = ?, street = ?, city = ?,
                age = ?, email = ?, salary = ?, gender = ?, avatar = ?, phone = ? WHERE id = ?
            `;
            
            params = [username, hashedPassword, role, firstName, lastName, address, street, city, +age, email, +salary, gender, avatar, phone, id];

        } else {
            query = `UPDATE employee SET 
                username = ?, role = ?, firstName = ?, lastName = ?, address = ?, street = ?, city = ?,
                age = ?, email = ?, salary = ?, gender = ?, avatar = ?, phone = ? WHERE id = ?
            `;
            params = [username, role, firstName, lastName, address, street, city, +age, email, +salary, gender, avatar, phone, id];
        }

        // update employee
        await db.query(query, params);

        res.status(200).json({message: 'Employee Updated'});

    } catch(err) {
        next(err);
    }

}

// @desc get single employee
// @route GET /api/employees/:id
// @access Private (Admins)

const getEmployee = async (req, res, next) => {
    const {id} = req.params;

    try {
        const [result] = await db.query("SELECT id, username, role, firstName, lastName, address, street, city, age, email, salary, gender, phone, avatar FROM employee WHERE id = ? ", [id]);

        if(result.length === 0) {
            return res.status(404).json({message: 'Employee not found'});
        }

        res.status(200).json({message: 'Success', employee: result[0]});
    } catch (err) {
        next(err);
    }
}


// @desc delete employee
// @route DELETE /api/employees/:id
// @access Private (Admins)

const deleteEmployee = async (req, res) => {
    const {id} = req.params;

    console.log(id);

    if(!id) {
        return res.status(400).json({message: 'User id is required'});
    }

    try {

        // find the employee
        const [result] = await db.query("SELECT * FROM employee WHERE id = ? ", [id]);
        
        if(result.length === 0) return res.status(404).json({message: 'Employee not found'});

        // delete the employee
        await db.query("DELETE FROM employee WHERE id = ? ", [id]);

        res.status(200).json({message: 'Employee Removed'});
        
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    getEmployee,
    deleteEmployee
}

