const db = require('../config/db');

const getAllSpecialFeatures = async (req, res, next) => {
    try {
        const [result] = await db.query("SELECT * FROM special_feature");
        res.status(200).json({message: 'Success', features: result});
    } catch (err) {
        next(err);
    }
}

const createNewRoomType = async (req, res, next) => {
    const {name, bedType, regularPrice, fullPaymentDiscount, adultOccupation, childOccupation, description, view, bathroomType, televisionType, heatingAvailability, towelAvailability, commonFeaturePrice, specialFeatures, rooms, imageCount} = req.body;

    if(+imageCount !== 6) return res.status(400).json({message: '6 images are required'});

    // validation check
    if(!name || !bedType || +regularPrice <= 0 || +adultOccupation < 0 || +childOccupation < 0 || !description || !view || !bathroomType || !televisionType || !heatingAvailability || !towelAvailability || +commonFeaturePrice <= 0) {
        return res.status(400).json({message: 'Invalid Input Data'});
    }

    if(rooms.length <= 0) {
        return res.status(400).json({message: 'At least one room number is required'});
    }

    // calculate neccesary fields
    const totalRooms = rooms.length;
    let totalPrice = regularPrice + commonFeaturePrice;
    if(specialFeatures.length > 0) {
        const specialFeatureTotalPrice = specialFeatures.reduce((acc, item) => (acc + item.price) , 0)
        totalPrice += +specialFeatureTotalPrice.toFixed(2);
    }
    totalPrice = +totalPrice.toFixed(2);

    try {

        // create new room type record in database
        const [result] = await db.query(`INSERT INTO room_type (name, bedType, description, regularPrice, fullPaymentDiscount, adultOccupation, childOccupation, view, bathroomType, televisionType, heatingAvailability, towelAvailability, commonFeaturePrice, totalRooms, totalPrice) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, bedType, description, +regularPrice, +fullPaymentDiscount, +adultOccupation, +childOccupation, view, bathroomType, televisionType, heatingAvailability, towelAvailability, +commonFeaturePrice, +totalRooms, +totalPrice]);
    
        const roomTypeId = result.insertId;

        if(specialFeatures.length > 0) {
            specialFeatures.forEach(async f => {
                await db.query("INSERT INTO room_type_feature (roomTypeId, featureId) VALUES (?, ?)", [roomTypeId, f.id]);
            })
        }

        // update room_type_room table as well
        rooms.forEach(async r => {
            await db.query("INSERT INTO room_type_room (roomTypeId, roomNo) VALUES (?, ?)", [roomTypeId, +r]);
        })

        res.status(201).json({message: 'New Room type created', id: roomTypeId});

    } catch (err) {
        next(err)    
    }

}

const updateRoomTypeImages = async (req, res, next) => {
    const {imageUrls, id} = req.body;

    if(imageUrls.length !== 6) {
        return res.status(400).json({message: '6 images are requried'});
    }

    try {
        imageUrls.forEach(async item => {
            await db.query("INSERT INTO room_type_image (roomTypeId, imageUrl, fileName) VALUES (?, ?, ?)", [+id, item.url, item.fileName]);
        })

        res.status(200).json({message: 'Room type images updated'});
    } catch (err) {
        next(err);
    }
}

const getAllRoomTypes = async (req, res, next) => {
    try {
        const [result] = await db.query("SELECT * FROM room_type");

        const roomsData = [];

        result.forEach(async roomType => {
            const [rooms] = await db.query("SELECT roomNo FROM room_type_room WHERE roomTypeId = ?", [roomType.id]); 
            const [images] = await db.query("SELECT imageUrl, fileName FROM room_type_image WHERE roomTypeId = ?", [roomType.id]);
            const [features] = await db.query("SELECT * FROM special_feature WHERE id IN (SELECT featureId FROM room_type_feature WHERE roomTypeId = ?)", [roomType.id]);

            
            const proper = {
                ...roomType,
                images,
                rooms,
                specialFeatures: features
            }
           
            roomsData.push(proper);
            if(roomsData.length === result.length) {
                
                res.status(200).json({message: 'Success', rooms: roomsData});
            }
        })
        

    } catch (err) {
        next(err);
    }
}


const getSingleRoomType = async (req, res, next) => {
    const id = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM room_type WHERE id = ?", [id]);

        if(result.length <= 0) {
            return res.status(404).json({message: 'Room type not found'});
        }

        const [rooms] = await db.query("SELECT roomNo FROM room_type_room WHERE roomTypeId = ?", [id]);
        const [images] = await db.query("SELECT imageUrl, fileName FROM room_type_image WHERE roomTypeId = ?", [id]);
        const [features] = await db.query("SELECT id, name, price FROM special_feature WHERE id IN (SELECT featureId FROM room_type_feature WHERE roomTypeId = ?)", [id]);

        const proper = {
            ...result[0],
            images,
            rooms,
            specialFeatures: features
        }
       
        res.status(200).json({message: 'Success', room: proper});

    } catch (err) {
        next(err);
    }
}

/* BOOKING SPECIFIC ROUTES */


const getAvailableRoomsForBooking = async (req, res, next) => {
    const {roomType, checkInDate, checkOutDate} = req.query;

    if(!roomType || !checkInDate || !checkOutDate) {
        return res.status(400).json({message: 'Invalid Inputs'});
    }

    try {
        const [result] = await db.query("SELECT roomNo FROM room_type_room WHERE roomTypeId = ? AND roomNo NOT IN (SELECT roomNo FROM booking_room WHERE bookingId IN (SELECT id FROM booking WHERE checkInDate BETWEEN ? AND ? OR checkOutDate BETWEEN ? AND ? OR ? > checkInDate AND ? < checkOutDate) AND roomTypeId = ?)", [roomType, checkInDate, checkOutDate, checkInDate, checkOutDate, checkInDate, checkOutDate, roomType]);
        console.log([result])
        res.status(200).json({message: 'Success', rooms: result});
    } catch (err) {
        next(err)
    }
}


const createNewBooking = async (req, res, next) => {
    const {checkInDate, checkOutDate, roomType, rooms, paymentType, totalNightsStay, paidTotalPrice, bookingTotalPrice, totalRoomsBooked, isPaid, remainingBalance} = req.body;

    if(!checkInDate || !checkOutDate || !roomType || !Array.isArray(rooms) || rooms.length <= 0 || !paymentType || !totalNightsStay || +paidTotalPrice <= 0 || +bookingTotalPrice <= 0 || +totalRoomsBooked <= 0) {
        return res.status(400).json({message: 'Invalid Inputs'});
    }

    try {
        const [result] = await db.query(`INSERT INTO booking (customerId, customerRole, checkInDate, checkOutDate, totalPrice, totalPaidPrice, remainBalance, paymentType, isPaid, totalNightsStay, totalRoomsBooked) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )`, [req.user.id, req.user.role, checkInDate, checkOutDate, +bookingTotalPrice, +paidTotalPrice, +remainingBalance, paymentType, isPaid, totalNightsStay, totalRoomsBooked]);
    
        const bookingId = result.insertId;
        
        rooms.forEach(async r => {
            await db.query(`INSERT INTO booking_room (bookingId, roomTypeId, roomNo) VALUES (?, ?, ?)`, [bookingId, roomType, r]);
        })

        res.status(200).json({message: 'Booking created'});
    
    } catch (err) {
        next(err);
    }
}

// @desc get all bookings of a customer
// @route GET /api/rooms/bookings/customer/:id
// @access protected (Customer, Employee, Admin)

const getAllBookings = async (req, res, next) => {

    try {
        const [result] = await db.query("SELECT * FROM booking"); 

        res.status(200).json({message: 'Success', bookings: result});
    } catch (err) {
        next(err);
    }
}


// @desc get all bookings of a customer
// @route GET /api/rooms/bookings/customer/:id
// @access protected (Customer, Employee, Admin)

const getAllBookingsOfACustomer = async (req, res, next) => {
    const customerId = req.params.id;
    const role = req.query.role === 'Customer' ? 'Customer' : 'Employee';

    try {
        const [result] = await db.query("SELECT * FROM booking WHERE customerId = ? AND customerRole = ?", [customerId, role]);

        if(result.length === 0) return res.status(200).json({message: 'No Bookings Available', bookings: []});

        res.status(200).json({message: 'Success', bookings: result});

    } catch (err) {
        next(err);
    }
}


// @desc get details about single booking
// @route GET /api/rooms/bookings/:id 
// @access protected (Customer, Employee, Admin)

const getSingleBooking = async (req, res, next) => {
    const bookingId = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM booking WHERE id = ?", [bookingId]);

        if(result.length <= 0) return res.status(404).json({message: 'Booking not found'});

        // for the booking find all rooms booked
        const [rooms] = await db.query("SELECT roomTypeId, roomNo FROM booking_room WHERE bookingId = ?", [bookingId]);

        const [roomTypeDetails] = await db.query("SELECT id, name FROM room_type WHERE id = ?", [rooms[0].roomTypeId]);

        const booking = {
            ...result[0],
            bookedRooms: rooms,
            bookedRoomType: roomTypeDetails[0]
        }

        if(req.user.role === 'Admin' || req.user.role === 'Employee') {
            const q1 = result[0].customerRole === 'Customer' ? "SELECT * FROM customer WHERE id=?" : "SELECT * FROM employee WHERE id=? ";

            const [customerData] = await db.query(q1, [result[0].customerId]);
            booking.customerDetails = customerData[0];
        }

        res.status(200).json({message: 'Success', booking});

    } catch (err) {
        next(err);
    }
}


const updateBookingPaymentStatus = async (req, res, next) => {
    const bookingId = req.params.id;
    console.log(bookingId, req.body.amount);
    try {
        const q1 = "UPDATE booking SET paymentType=?,isPaid=?, totalPaidPrice=?, remainBalance=? WHERE id=?";

        await db.query(q1, ['full','yes',+req.body.amount,0,+bookingId]);

        const [result] = await db.query("SELECT * FROM booking WHERE id = ?", [+bookingId]);

        const [rooms] = await db.query("SELECT roomTypeId, roomNo FROM booking_room WHERE bookingId = ?", [+bookingId]);

        const [roomTypeDetails] = await db.query("SELECT id, name FROM room_type WHERE id = ?", [+rooms[0].roomTypeId]);

        const booking = {
            ...result[0],
            bookedRooms: rooms,
            bookedRoomType: roomTypeDetails[0]
        }

        res.status(201).json({message: 'success', booking});
        // res.status(201).json({message: 'success'});

    } catch (err) {
        next(err);
    }
}


const getMonthlyBookingsReport = async (req, res, next) => {
    try {
        const [result] = await db.query("SELECT month_names.month_name,MONTH(checkInDate) AS month,COUNT(*) AS total_bookings,SUM(totalPrice) AS revenue FROM booking JOIN month_names ON MONTH(checkInDate) = month_names.month_number GROUP BY month_names.month_name, MONTH(checkInDate)");
    
        let months = [
            {num: 1, name: 'Jan'},
            {num: 2, name: 'Feb'},
            {num: 3, name: 'March'},
            {num: 4, name: 'April'},
            {num: 5, name: 'May'},
            {num: 6, name: 'June'},
            {num: 7, name: 'July'},
            {num: 8, name: 'Aug'},
            {num: 9, name: 'Sep'},
            {num: 10, name: 'Oct'},
            {num: 11, name: 'Nov'},
            {num: 12, name: 'Dec'},
        ];
        let report = [];

        months.forEach(month => {
            const found = result.find(item => item.month === month.num);
        
            if(found) {
                report.push({
                    month: found.month,
                    monthName: month.name,
                    revenue: found.revenue,
                    totalBookings: found.total_bookings
                });
            } else {
                report.push({
                    month: month.num,
                    monthName: month.name,
                    revenue: 0,
                    totalBookings: 0
                });
            }
        });
        
        res.status(200).json({message: 'success', data: report});
    } catch (err) {
        next(err);
    }
}

const deleteCorder = async (req, res, next) => {
    const id = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM booking WHERE id = ?", [id]);

        if(result.length === 0) return res.status(404).json({message: 'Order not found'});

        // delete customer
        await db.query("DELETE FROM booking WHERE id = ?", [id]);

        res.status(200).json({message: 'order Removed'});
    } catch (err) {
        next(err);
        
    }
}


module.exports = {
    getAllSpecialFeatures,
    createNewRoomType,
    updateRoomTypeImages,
    getAllRoomTypes,
    getSingleRoomType,

    getAvailableRoomsForBooking,
    createNewBooking,
    getAllBookingsOfACustomer,
    getSingleBooking,
    getAllBookings,
    updateBookingPaymentStatus,

    getMonthlyBookingsReport,
    deleteCorder,
}