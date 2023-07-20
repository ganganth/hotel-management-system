import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {Table, Badge, Alert} from 'react-bootstrap';
import moment from 'moment';
import { toast } from 'react-toastify';

const AllBookings = () => {

    const [bookings, setBookings] = useState([]);

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getAllBookings = async () => {
            try {
                const response = await axiosPrivate.get('/api/rooms/bookings/all');
                setBookings(response.data.bookings);
            } catch (err) {
                console.log(err);
            }
        }
        getAllBookings();
    }, [axiosPrivate]);

    const handleRoomBookingDelete = async id => {
        const isConfirmed = window.confirm('Are you sure that you want to delete this Order ?');
       
        if(isConfirmed) {
            // delete room booking
            try {
                await axiosPrivate.delete(`/api/rooms/bookings/all/${id}`);
                setBookings(bookings.filter(c => c.id !== id));
                toast.success('Order Deleted');
            } catch (err) {
                console.log(err);
                toast.error(err.response.data?.message);
            }
        }
    }

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h1>All Bookings</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)} >Go Back</button>
            </div>
            <hr></hr>

            {bookings.length > 0 ? (
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
                        {bookings.map(booking => (
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
                                <td>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <button className='btn btn-sm btn-danger'onClick={() => handleRoomBookingDelete(booking.id)} >Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant='info'>No bookings available</Alert>
            )}
        </>
    );
}

export default AllBookings;