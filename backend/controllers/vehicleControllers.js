const db = require('../config/db');

const createNewVehicle = async (req, res, next) => {

    const {
        name, 
        type, 
        condition, 
        commonFeatures: {seats, bags, doors, isAirConditioned, isAuto, fuelType, isDriverFree}, 
        additionalFeatures,
        quantity,
        policies: {fuelPolicy, pickupPolicy},
        paymentInfo: {price, overduePrice, paymentType, discount}
    } = req.body;
 
  
   
    const query = `INSERT INTO vehicle 
        (name, type, vehicleCondition, seats, bags, doors, isAirConditioned, isAuto, fuelType, isDriverFree, fuelPolicy, pickupPolicy, price, overduePrice, paymentType, discount,quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?
            
            )`;
     
    try {
        const [result] = await db.query(query, [name, type, condition, seats, bags, doors, isAirConditioned, isAuto, fuelType, isDriverFree, fuelPolicy, pickupPolicy, price, overduePrice, paymentType, discount,quantity]);
        const vehicleId = result.insertId;
        
        if(additionalFeatures.length > 0) {
            additionalFeatures.forEach(async feature => {
                const query = `INSERT INTO vehicle_feature (vehicleId, feature) VALUES (?, ?)`;
                await db.query(query, [vehicleId, feature]);
            });
        }

        res.status(201).json({message: 'vehicle created successfully', id: vehicleId});
    
    } catch (err) {
        next(err);  
       
    }

}

const updateVehicleImages = async (req, res, next) => {
    const {images, id} = req.body;

    if(!id || !Array.isArray(images) || images.length !== 4) return res.status(400).json({message: 'Invalid Images Data'});

    try {
        images.forEach( async img => {
            await db.query(`INSERT INTO vehicle_image (vehicleId, url, fileName) VALUES (?, ?, ?)`, [+id, img.url, img.fileName]);
        })
        res.status(201).json({message: 'Images updated successfully'});
    } catch (err) {
        next(err);
    }
}


const getAllVehicles = async (req, res, next) => {

    try {
        const [results] = await db.query('SELECT * FROM vehicle');
        const vehiclesData = [];

        results.forEach(async result => {
            const [imagesData] = await db.query('SELECT url, fileName FROM vehicle_image WHERE vehicleId = ?', [result.id]);
            const [featuresData] = await db.query('SELECT feature FROM vehicle_feature WHERE vehicleId = ?', [result.id]);
            vehiclesData.push({
                ...result,
                additionalFeatures: featuresData.map(f => f.feature),
                images: imagesData
            });

            if(vehiclesData.length === results.length) {
                res.status(200).json({message: 'success', data: vehiclesData});
            }
        })

    } catch (err) {
        next(err);
    }

}

// GET SINGLE VEHICLE DATA
const getSingleVehicle = async (req, res, next) => {
    const {vehicleId} = req.params;

    try {
        const [result] = await db.query("SELECT * FROM vehicle WHERE id=?", [+vehicleId]);
        const [images] = await db.query("SELECT url, fileName FROM vehicle_image WHERE vehicleId=?", [+vehicleId]);
        const [features] = await db.query("SELECT feature FROM vehicle_feature WHERE vehicleId=?", [+vehicleId]);

        res.status(200).json({message: 'success', vehicle: {...result[0], images, additionalFeatures: features.map(f => f.feature)}});

    } catch (err) {
        
    }
}

// UPDATE A VEHICLE
const updateVehicle = async (req, res, next) => {
    const {
        vehicleId,
        name, 
        type, 
        condition, 
        commonFeatures: {seats, bags, doors, isAirConditioned, isAuto, fuelType, isDriverFree}, 
        additionalFeatures,
        policies: {fuelPolicy, pickupPolicy},
        paymentInfo: {price, overduePrice, paymentType, discount}
    } = req.body;

    const query = `UPDATE vehicle SET name=?, type=?, vehicleCondition=?, seats=?, bags=?, doors=?, isAirConditioned=?, isAuto=?, fuelType=?, isDriverFree=?, fuelPolicy=?, pickupPolicy=?, price=?, overduePrice=?, paymentType=?, discount=? quantity=? WHERE id = ?`;

    try {
        const [result] = await db.query(query, [name, type, condition, seats, bags, doors, isAirConditioned, isAuto, fuelType, isDriverFree, fuelPolicy, pickupPolicy, price, overduePrice, paymentType, discount, +vehicleId, quantity]);
    
        // update vehicle_feature table
        await db.query("DELETE FROM vehicle_feature WHERE vehicleId=?", [+vehicleId]);
        if(additionalFeatures.length > 0) {
            additionalFeatures.forEach(async feature => {
                const query = `INSERT INTO vehicle_feature (vehicleId, feature) VALUES (?, ?)`;
                await db.query(query, [+vehicleId, feature]);
            });
        }

        res.status(200).json({message: 'Vehicle updated successfully'});

    } catch (err) {
        next(err);
    }

}


// DELETE A VEHICLE
const deleteVehicle = async (req, res, next) => {
    try {
        const {vehicleId} = req.params;

        console.log(vehicleId);

        await db.query("DELETE FROM vehicle WHERE id = ?", [+vehicleId]);

        res.status(200).json({message: 'Vehicle removed successfully'});

    } catch (err) {
        next(err);
    }
}


//// VEHICLE RENTAL CONTROLLERS /////

const getAllRentals = async (req, res, next) => {

    try {
        const [result] = await db.query("SELECT * FROM vehicle_rental");
        res.status(200).json({message: 'success', rentals: result});
    } catch (err) {
        next(err);
    }
}

const getAllRentalsOfPerson = async (req, res, next) => {
    const userId = req.user.id;

    let rentals;
    try {
        if(req.user.role === 'Customer') {
            [rentals] = await db.query("SELECT * FROM vehicle_rental WHERE customerId=? AND customerRole=?", [userId, 'Customer']);
        } else {
            [rentals] = await db.query("SELECT * FROM vehicle_rental WHERE customerId=? AND customerRole=?", [userId, 'Employee']);
        }
        res.status(200).json({message: 'success', rentals});
    } catch (err) {
        next(err);
    }
}

const searchRentalVehicles = async (req, res, next) => {
    const {pickupDate, dropoffDate} = req.query;

    try {
        const query = `SELECT * FROM vehicle WHERE id NOT IN(SELECT DISTINCT vehicleId FROM vehicle_rental WHERE (? >= pickupDate AND ? <= pickupDate) OR (? >= dropoffDate AND ? <= dropoffDate) OR (? >= pickupDate AND ? <= dropoffDate))`;

        const [result] = await db.query(query, [dropoffDate, pickupDate, dropoffDate, pickupDate, pickupDate, dropoffDate]);

        const imagesPromises = result.map(result => {
            return db.query("SELECT url, fileName FROM vehicle_image WHERE vehicleId=?", [+result.id]);
        })

        const featuresPromises = result.map(result => {
            return db.query("SELECT feature FROM vehicle_feature WHERE vehicleId=?", [+result.id]);
        })

        const allImages = await Promise.all(imagesPromises);
        const allFeatures = await Promise.all(featuresPromises);

        const finalResult = result.map((r, index) => {
            return {
                ...r,
                images: allImages[index][0],
                additionalFeatures: allFeatures[index][0].map(f => f.feature)
            }
        })

        res.status(200).json({message: 'success', vehicles: finalResult});

    } catch (err) {
        next(err);
    }
}

const createNewRental = async (req, res, next) => {

    const {
        vehicleId,
        pickupDate,
        dropoffDate,
        totalHours,
        totalPrice,
        paymentType,
        totalPaid,
        isFullyPaid,
        pickupLocation
    } = req.body;

    const customerId = req.user?.id;
    const customerRole = req.user?.role === 'Customer' ? 'Customer' : 'Employee';

    // perform validation

    // insert new rental record
    const query = `INSERT INTO vehicle_rental(customerId, vehicleId, pickupDate, dropoffDate, totalHours, totalPrice, paymentType, totalPaid, isFullyPaid, pickupLocation, customerRole) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await db.query(query, [customerId, vehicleId, pickupDate, dropoffDate, totalHours, totalPrice, paymentType, totalPaid, isFullyPaid, pickupLocation, customerRole]);

        res.status(201).json({message: 'vehicle rental was created', rentalId: result.insertId});
    } catch (err) {
        next(err);
    }
}


// get a single rental details

const getSingleRental = async (req, res, next) => {
    const {rentalId} = req.params;

    try {
        const [result] = await db.query("SELECT * FROM vehicle_rental WHERE id=?", [+rentalId]);

        if(req.user.role === 'Customer' && result[0].customerId.toString() !== req.user.id.toString()) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        let rental;

        // populate vehicle data
        const [vehicleData] = await db.query("SELECT * FROM vehicle WHERE id = ?", [result[0].vehicleId]);

        const q1 = db.query("SELECT url, fileName FROM vehicle_image WHERE vehicleId=?", [+vehicleData[0].id]);
        const q2 = db.query("SELECT feature FROM vehicle_feature WHERE vehicleId=?", [+vehicleData[0].id]);

        const promiseResult = await Promise.all([q1, q2]);

        rental = {
            ...result[0],
            vehicleData: {...vehicleData[0], images: promiseResult[0][0], additionalFeatures: promiseResult[1][0].map(f => f.feature)}
        }

        if(req.user.role !== 'Customer') {
            // populate customer data
            const q3 = result[0].customerRole === 'Employee' ? "SELECT id, username, firstName, lastName, avatar, phone, email FROM employee WHERE id=?" : "SELECT id, username, firstName, lastName, avatar, phone, email FROM customer WHERE id=?";
            const [customer] = await db.query(q3, [result[0].customerId]);
            rental.customerData = customer[0];
        }

        res.status(200).json({message: 'success', rental});

    } catch (err) {
        next(err);
    }
}

const updateRentalPayment = async (req, res, next) => {
    const {rentalId, isFullyPaid, totalPaid} = req.body;

    console.log(req.body);

    try {
        const query = "UPDATE vehicle_rental SET paymentType=?,isFullyPaid=?, totalPaid=? WHERE id=?";
        await db.query(query, ['full',isFullyPaid, +totalPaid, +rentalId]);

        res.status(200).json({message: 'payment details updated'});
    } catch (err) {
        next(err);
    }
}

const deleteCorder = async (req, res, next) => {
    const id = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM vehicle_rental WHERE id = ?", [id]);

        if(result.length === 0) return res.status(404).json({message: 'Order not found'});

        // delete customer
        await db.query("DELETE FROM vehicle_rental WHERE id = ?", [id]);

        res.status(200).json({message: 'order Removed'});
    } catch (err) {
        next(err);
        
    }
}



module.exports = {
    createNewVehicle,
    updateVehicleImages,
    getAllVehicles,
    getSingleVehicle,
    deleteVehicle,
    updateVehicle,

    getAllRentals,
    getAllRentalsOfPerson,
    searchRentalVehicles,
    createNewRental,
    getSingleRental,
    updateRentalPayment,
    deleteCorder
}