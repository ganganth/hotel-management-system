import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/auth/authSlice';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {Table, Badge, Alert} from 'react-bootstrap';
import moment from 'moment';

const MyBookings = () => {

    const [myBookings, setMyBookings] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const {id, role} = useSelector(selectAuthUser);
    const navigate = useNavigate();

    useEffect(() => {
        const getMyBookings = async () => {
            try {
                const response = await axiosPrivate.get(`/api/rooms/bookings/customer/${id}?role=${role}`);
                setMyBookings(response.data.bookings);
            } catch (err) {
                console.log(err);              
            }
        }
        getMyBookings();
    }, [axiosPrivate, id, role])

    return (
        <div>
            <h1>My Bookings</h1>

            <hr></hr>

            {myBookings.length > 0 ? (
                <Table>
                    <thead>
                        <tr>
                            <th>#Booking ID</th>
                            <th>Check In Date</th>
                            <th>Check Out Date</th>
                            <th>Booked Date</th>
                            <th>Payment Status</th>
                            <th>Payment Type</th>
                            <th>Remaining Balance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myBookings.map(booking => (
                            <tr key={booking.id}>
                                <td>{booking.id}</td>
                                <td>{moment(booking.checkInDate).utc().format('YYYY-MM-DD')}</td>
                                <td>{moment(booking.checkOutDate).utc().format('YYYY-MM-DD')}</td>
                                <td>{moment(booking.createdAt).utc().format('YYYY-MM-DD')}</td>
                                <td>
                                    <div className='d-flex align-items-center justify-content-center'>{booking.isPaid === 'yes' ? (<Badge bg='success'>paid</Badge>) : (<Badge bg='warning'>not completed</Badge>)}</div>
                                </td>
                                <td>
                                    <div className='d-flex align-items-center justify-content-center'><Badge bg='dark'>{booking.paymentType === 'full' ? 'Full' : 'Half'}</Badge></div>
                                </td>
                                <td>{booking.isPaid === 'yes' ? 'No remaining balance' : `$${booking.remainBalance.toFixed(2)}`}</td>
                                <td>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <button className='btn btn-primary btn-sm' onClick={() => navigate(`/dash/bookings/${booking.id}`)} >view more</button>
                                    </div>
                                </td>
                                
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant='info'>No bookings yet</Alert>
            )}
        </div>
    );
}

export default MyBookings;