import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

import {Table, Badge, Alert} from 'react-bootstrap';
import { toast } from 'react-toastify'

const AllRentals = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        const getAllRentals = async () => {
            try {
                const response = await axiosPrivate.get('/api/vehicles/rental');
                setRentals(response.data.rentals);
            } catch (err) {
                console.log(err);
            }            
        }
        getAllRentals();
    }, [axiosPrivate]);

    const handleVehicleBookingDelete = async id => {
        const isConfirmed = window.confirm('Are you sure that you want to delete this Order ?');
       
        if(isConfirmed) {
            // delete room booking
            try {
                await axiosPrivate.delete(`/api/vehicles/rental/${id}`);
                setRentals(rentals.filter(c => c.id !== id));
                toast.success('Order Deleted');
            } catch (err) {
                console.log(err);
                toast.error(err.response.data?.message);
            }
        }
    }

    return (
        <>
            <div className='d-flex align-items-center justify-content-between'>
                <h1>All Rentals</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            </div>
            <hr></hr>

            {rentals.length > 0 ? (
                <Table>
                    <thead>
                        <tr>
                            <th>#Rental ID</th>
                            <th>Pick Up Date</th>
                            <th>Drop Off Date</th>
                            <th>Rented Date</th>
                            <th>Payment Status</th>
                            <th>Payment Type</th>
                            <th>Remaining Balance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.map(r => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td><span style={{fontSize: '14px'}}>{new Date(r.pickupDate).toLocaleString()}</span></td>
                                <td><span style={{fontSize: '14px'}}>{new Date(r.dropoffDate).toLocaleString()}</span></td>
                                
                                <td><span style={{fontSize: '14px'}}>{new Date(r.createdAt).toLocaleString()}</span></td>
                                <td>{r.isFullyPaid === 'yes' ? <Badge bg='success'>Paid</Badge> : <Badge bg='warning'>Pending</Badge>}</td>
                                <td>{r.paymentType === 'half' ? <span className='bg-info px-3 py-1 text-white rounded' style={{fontSize: '12px'}}>Half Payment</span> : <span className='bg-info px-3 py-1 text-white rounded' style={{fontSize: '12px'}}>Full Payment</span>}</td>
                                <td>
                                    {r.isFullyPaid === 'yes' ? (<span>No remaining balance</span>) : (<span>$ {(+r.totalPrice - +r.totalPaid).toFixed(2)}</span>)}
                                </td>
                                <td>
                                    <div>
                                        <button className='btn btn-primary btn-sm' onClick={() => navigate(`/dash/rentals/${r.id}?isEmployeeView=true`)} >View more</button>
                                    </div>
                                </td>
                                <td>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <button className='btn btn-sm btn-danger'onClick={() => handleVehicleBookingDelete(r.id)} >Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant='info'>No Rentals Available</Alert>
            )}


        </>
    );
}


export default AllRentals;