import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {useSelector} from 'react-redux';
import { selectAuthUser } from '../../app/auth/authSlice';

import{Row, Col, ListGroup, Alert, Badge} from 'react-bootstrap';
import moment from 'moment';
import {toast} from 'react-toastify';

const SingleBookingView = () => {

    const [booking, setBooking] = useState({});
    const navigate = useNavigate();
    const {bookingId} = useParams();
    const axiosPrivate = useAxiosPrivate();

    const authUser = useSelector(selectAuthUser);
   

    useEffect(() => {
        const getSingleBooking = async () => {
            try {
                const response = await axiosPrivate.get(`/api/rooms/bookings/${bookingId}`);
                setBooking(response.data.booking);
            } catch (err) {
                console.log(err);
                navigate('/dash/my-bookings');
            }
        }
        getSingleBooking();
    }, [axiosPrivate, bookingId, navigate]);

    const updatePaymentStatus = async (details) => {

        try {
            console.log(details);
            const response = await axiosPrivate.put(`/api/rooms/bookings/${booking.id}`, JSON.stringify({amount: +booking.totalPrice}));

            toast.success('Payment status updated');

            setBooking(response.data.booking);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Row>
                <Col md={12} className='d-flex justify-content-end'>
                    <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
                </Col>
            </Row>

            <hr></hr>

            <Row>
                <Col md={12}>
                    <Alert variant='info'>Booking No.{booking?.id} Details</Alert>
                </Col>
            </Row>

            {booking?.id && (
                <Row>

                    <Col md={7}>
                        <ListGroup>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>#Booking ID</Col>
                                    <Col md={6}>{booking.id}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Booked Date</Col>
                                    <Col md={6}>{new Date(booking.createdAt).toLocaleString()}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Check In Date</Col>
                                    <Col md={6}><Badge bg='success'>{moment(booking.checkInDate).utc().format('DD MMMM YYYY')}</Badge></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Check Out Date</Col>
                                    <Col md={6}><Badge bg='success'>{moment(booking.checkOutDate).utc().format('DD MMMM YYYY')}</Badge></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Total nights to stay</Col>
                                    <Col md={6}><Badge bg='primary'>{booking.totalNightsStay}</Badge></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Total rooms booked</Col>
                                    <Col md={6}><Badge bg='dark'>{booking.totalRoomsBooked}</Badge></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Payment Type</Col>
                                    <Col md={6}><Badge bg={booking.paymentType === 'full' ? 'success' : 'warning'}>{booking.paymentType}</Badge></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Payment Completion Status</Col>
                                    <Col md={6}><Badge bg={booking.isPaid === 'yes' ? 'success' : 'warning'}>{booking.isPaid === 'yes' ? 'completed' : 'partially completed'}</Badge></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Total booking price</Col>
                                    <Col md={6}>${booking.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Total paid amount</Col>
                                    <Col md={6}>${booking.totalPaidPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {booking.paymentType === 'half' && booking.remainBalance > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={6}>Remaining Balance</Col>
                                        <Col md={6}><Badge bg='warning'>${booking.remainBalance}</Badge></Col>
                                    </Row>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Col>

                    <Col md={5}>
                        <ListGroup>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={12}><h4>Room Details</h4></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Room Type</Col>
                                    <Col md={6}>{booking.bookedRoomType.name}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>Room No's</Col>
                                    <Col md={6} className='d-flex flex-wrap align-items-center gap-2'>
                                        {booking.bookedRooms.map(item => (
                                            <Badge key={item.roomNo} bg='info'>{item.roomNo}</Badge>
                                        ))}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col md={12} className='d-flex align-items-center justify-content-center'><button className='btn btn-primary' onClick={() => navigate(`/dash/rooms/${booking.bookedRoomType.id}`)}>See more about room</button></Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>

                        {/* Employee, Admin can see customer details as well */}
                        {console.log(booking?.customerDetails)}
                        {(authUser?.role === 'Admin' || authUser?.role === 'Employee') && (
                             <ListGroup className='mt-3'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={12}><h4>Customer Details</h4></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={6}>ID</Col>
                                        <Col md={6}><Badge bg='dark'>{booking?.customerDetails?.id}</Badge></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={6}>Name</Col>
                                        <Col md={6}>{`${booking?.customerDetails?.firstName} ${booking?.customerDetails?.lastName}`}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={6}>Role</Col>
                                        <Col md={6} className='d-flex flex-wrap align-items-center gap-2'>
                                                <Badge bg='info'>{booking?.customerDetails?.role}</Badge>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                    
                                        <Col md={6}>Phone</Col>
                                        <Col md={6}>{booking?.customerDetails?.phone}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                    
                                        <Col md={6}>Email</Col>
                                        <Col md={6}>{booking?.customerDetails?.email}</Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        )}

                        {booking?.paymentType === 'half' && booking?.remainBalance > 0 && ((authUser?.role === 'Customer' && booking?.customerRole === 'Customer' && +booking?.customerId === +authUser?.id) || ((authUser?.role === 'Employee' || authUser?.role === 'Admin') && booking?.customerRole === 'Employee' && +authUser?.id === +booking?.customerId )) && (
                            <Row className='mt-3'>
                                <Col md={12}>
                                    <ListGroup>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col md={12}><h4>Pay Balance</h4></Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col md={12}>
                                                    <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID}}>
                                                        <PayPalButtons 
                                                            style={{ layout: "horizontal" }}
                                                            createOrder={(data, actions) => {
                                                                
                                                                return actions.order.create({
                                                                    purchase_units: [
                                                                        {
                                                                            amount: {
                                                                                value: booking.remainBalance
                                                                            },
                                                                        },
                                                                    ],
                                                                });
                                                            }}
                                                            onApprove={(data, actions) => {
                                                                return actions.order.capture().then((details) => {
                                                                    updatePaymentStatus(details);
                                                                });
                                                            }}
                                                        />
                                                    </PayPalScriptProvider>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        )}

                    </Col>

                </Row>
            )}
        </>
    );
}

export default SingleBookingView;