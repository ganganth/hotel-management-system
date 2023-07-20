import {useState} from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import {Row, Col, ListGroup, Badge} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import {MdClose, MdOutlineDateRange} from 'react-icons/md';

import {toast} from 'react-toastify';

import '../styles/roomBookingModel.css';
import "react-datepicker/dist/react-datepicker.css";


const RoomBookingModel = ({room, handleBookingModelClose}) => {

    const axiosPrivate = useAxiosPrivate();

    const [nextStep, setNextStep] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [rooms, setRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [paymentType, setPaymentType] = useState('full');

    const handleBookingSuccess = async (details) => {
        // paypal payment details

        const booking = {
            checkInDate: convertDate(startDate),
            checkOutDate: convertDate(endDate),
            roomType: room.id,
            rooms: selectedRooms,
            paymentType,
            totalNightsStay: calculateTotalNights(),
            paidTotalPrice: details.purchase_units[0].amount.value, // paid total price
            bookingTotalPrice: paymentType === 'full' ? calculateTotalPrice() : (+calculateTotalPrice() + +calculateRemainPrice()),
            totalRoomsBooked: selectedRooms.length,
            isPaid: paymentType === 'full' ? "yes" : "no",
            remainingBalance: paymentType === 'half' ? calculateRemainPrice() : 0.00
        }

        
        // create a new booking here
        try {
            await axiosPrivate.post('/api/rooms/bookings', JSON.stringify(booking));
            toast.success('Booking Successful');
            handleBookingModelClose();
        } catch (err) {
            console.log(err);
            toast.error(err.response.data?.message);
        }

    }

    
    const convertDate = (date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    const calculateTotalNights = () => {
        const date1 = startDate.getTime();
        const date2 = endDate.getTime();

        const totalNights = Math.ceil(((date2 - date1) / (24 * 60 * 60 * 1000))) + 1;
        return totalNights;
    }

    const onChange = async (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        setSelectedRooms([]);
        setPaymentType('full');
        
        if((start && end)) {
            try {
                const response = await axiosPrivate.get(`/api/rooms/bookings/available-rooms?roomType=${room.id}&checkInDate=${convertDate(start)}&checkOutDate=${convertDate(end)}`);
                console.log(response.data);
                setRooms(response.data.rooms);
            } catch (err) {
                console.log(err);
            }
        }
        
    };

    const handleRoomSelect = e => {
        if(e.target.checked) {
            setSelectedRooms(prev => ([...prev, +e.target.value]));
        } else {
            setSelectedRooms(prev => prev.filter(n => n !== +e.target.value))
        }
    }

    // const handleDateMouseEnter = e => {
    //     console.log(e);
    // }

    const calculatePricePerNight = () => {
        if(paymentType === 'half' || paymentType === '') {
            return room.totalPrice;
        }

        if(paymentType === 'full') {
            const discount = (room.totalPrice / 100) * room.fullPaymentDiscount;
            return (room.totalPrice - discount).toFixed(2);
        }
    }

    const calculateTotalRoomPrice = () => {
        if(paymentType === 'half' || paymentType === '') {
            return +calculateTotalNights() * room.totalPrice;
        }

        if(paymentType === 'full') {
            const total = +calculateTotalNights() * room.totalPrice;
            const discount = (total / 100) * room.fullPaymentDiscount;
            return (total - discount).toFixed(2);
        }
    }

    const calculateTotalPrice = () => {
        let total = room.totalPrice * selectedRooms.length * +calculateTotalNights();
        const discount = (total / 100) * room.fullPaymentDiscount;
        if(paymentType === 'full') {
            total = (total - discount).toFixed(2);
        } else {
            total = (total / 2).toFixed(2);
        }
        return total;
    }

    const calculateRemainPrice = () => {
        let total = room.totalPrice * selectedRooms.length * +calculateTotalNights();
        return (total - +(total / 2).toFixed(2));
    }


    return (
        <div className="roomBookingModel">
            <button className='roomBookingModel-close-btn' onClick={handleBookingModelClose}><MdClose /></button>

            <h1 className='text-center'>Book Now</h1>

            <Row className='my-4 justify-content-center'>

                {!nextStep && (
                    <>
                        <Col md={6}>
                            <p className='text-muted roomBookingModel-left-title'><MdOutlineDateRange /> Select the check in date & check out date</p>
                            <div className='d-flex align-items-center justify-content-center mt-4 w-100'>
                                <DatePicker
                                    selected={startDate}
                                    onChange={onChange}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                    inline
                                    minDate={new Date()}
                                    
                                    // onDayMouseEnter={handleDateMouseEnter}
                                />
                            </div>
                        </Col>

                        <Col md={6}>
                            {startDate && endDate && (
                                <div className="roomBookingModel-selected-dates-details mt-3 p-3 border">
                                    <p className='alert alert-success'>Check In Date : {convertDate(startDate)}</p>
                                    <p className='alert alert-success'>Check Out Date : {convertDate(endDate)}</p>
                                    <p className='alert alert-dark'>Total Nights Stay : {calculateTotalNights()}</p>
                                    <div>
                                        <label className='mb-2'>Available Rooms</label>
                                        {rooms.length === 0 && (<span className='text-danger'>Sorry! No rooms are available within the specified date range</span>)}
                                        {rooms.length > 0 && (
                                            <div className='d-flex aling-items-center gap-3 p-3 border'>
                                                {rooms.map(r => (
                                                    <div key={r.roomNo} className='d-flex flex-wrap align-items-center gap-2'>
                                                        <input type='checkbox' value={r.roomNo} checked={selectedRooms.indexOf(r.roomNo) !== -1} onChange={handleRoomSelect} />
                                                        <span>{r.roomNo}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                    </div>
                                </div>
                            )}

                            {selectedRooms.length > 0 && (
                                <button className='btn btn-primary my-3' onClick={() => setNextStep(true)}>Reserve Now</button>
                            )}
                        </Col>

                    </>
                )}
                
                {nextStep && (
                    <Col md={10}>
                        <button className='btn btn-primary mb-3' onClick={() => setNextStep(false)}>Back</button>
                        <div className='shadow pt-3 pb-5 px-5'>
                            <h1 className='text-center display-6 mb-3'>Payment Details</h1>
                            <ListGroup>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Room Type</Col>
                                        <Col>{room.name}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Bed Type</Col>
                                        <Col>{room.bedType}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Payment Type</Col>
                                        <Col>
                                            <div className='d-flex align-items-center gap-3 mb-2'>
                                                <input type='radio' value='full' name='payment-type' checked={paymentType === 'full'} onChange={e => setPaymentType(e.target.value)} />
                                                <span>Full Payment ({room.fullPaymentDiscount}% Discount will be applied)</span> 
                                            </div>
                                            <div className='d-flex align-items-center gap-3'>
                                                <input type='radio' value='half' name='payment-type' checked={paymentType === 'half'} onChange={e => setPaymentType(e.target.value)} />
                                                <span>Half Payment (No Discount will be applied)</span> 
                                            </div>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col className='d-flex align-item-center justify-content-center'><span className='fw-bold'>Room No.</span></Col>
                                        <Col className='d-flex align-item-center justify-content-center'><span className='fw-bold'>Adult Capacity</span></Col>
                                        <Col className='d-flex align-item-center justify-content-center'><span className='fw-bold'>Child Capacity</span></Col>
                                        <Col className='d-flex align-item-center justify-content-center'><span className='fw-bold'>Price Per Night</span></Col>
                                        <Col className='d-flex align-item-center justify-content-center'><span className='fw-bold'>Nights Stay</span></Col>
                                        <Col className='d-flex align-item-center justify-content-center'><span className='fw-bold'>Total Price</span></Col>
                                    </Row>
                                </ListGroup.Item>

                                {selectedRooms.map(r => (
                                    <ListGroup.Item key={r}>
                                        <Row>
                                            <Col className='d-flex align-item-center justify-content-center'><Badge bg="success">{r}</Badge></Col>
                                            <Col className='d-flex align-item-center justify-content-center'>{room.adultOccupation}</Col>
                                            <Col className='d-flex align-item-center justify-content-center'>{room.childOccupation}</Col>
                                            <Col className='d-flex align-item-center justify-content-center'>${calculatePricePerNight()}</Col>
                                            <Col className='d-flex align-item-center justify-content-center'><Badge bg="dark">{calculateTotalNights()}</Badge></Col>
                                            <Col className='d-flex align-item-center justify-content-center'>${calculateTotalRoomPrice()}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}

                                {paymentType === 'half' && (
                                    <ListGroup.Item>
                                        <Row className='justify-content-center'>
                                            <Col md={6}>
                                                <h5 className='text-center fw-bold my-2 text-muted'>Remain Balance : ${calculateRemainPrice()}</h5>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroup.Item>
                                    <Row className='justify-content-center'>
                                        <Col md={10}>
                                            <h1 className='text-center fs-2 mt-4 mb-2'>Pay Now : ${calculateTotalPrice()}</h1>
                                            <small className='text-center d-block mb-2'>(Once the payment is made you cannot cancel booking, and no money refunded)</small>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row className='justify-content-center'>
                                        <Col md={6}>
                                            <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
                                                {paymentType === 'full' && (
                                                    <PayPalButtons 
                                                        style={{ layout: "horizontal" }}
                                                        createOrder={(data, actions) => {
                                                            
                                                            return actions.order.create({
                                                                purchase_units: [
                                                                    {
                                                                        amount: {
                                                                            value: calculateTotalPrice(),
                                                                        },
                                                                    },
                                                                ],
                                                            });
                                                        }}
                                                        onApprove={(data, actions) => {
                                                            return actions.order.capture().then((details) => {
                                                                handleBookingSuccess(details);
                                                            });
                                                        }}
                                                        
                                                    />
                                                )} 

                                                {paymentType === 'half' && (
                                                    <PayPalButtons 
                                                        style={{ layout: "horizontal" }}
                                                        createOrder={(data, actions) => {
                                                            
                                                            return actions.order.create({
                                                                purchase_units: [
                                                                    {
                                                                        amount: {
                                                                            value: calculateTotalPrice(),
                                                                        },
                                                                    },
                                                                ],
                                                            });
                                                        }}
                                                        onApprove={(data, actions) => {
                                                            return actions.order.capture().then((details) => {
                                                                handleBookingSuccess(details);
                                                            });
                                                        }}
                                                        
                                                    />
                                                )}
                                                
                                            </PayPalScriptProvider>
                                        </Col>
                                    </Row>
                                    
                                </ListGroup.Item>

                            </ListGroup>
                        </div>
                    </Col>
                )}
                 
            </Row>

        </div>
    );
}

export default RoomBookingModel;