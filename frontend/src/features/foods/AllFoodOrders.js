import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {Alert, Table} from 'react-bootstrap';
import moment from 'moment';
import { toast } from 'react-toastify';

const AllFoodOrders = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getAllFoodOrders = async () => {
            try {
                const response = await axiosPrivate.get('/api/foods/order');
                console.log(response.data);
                setOrders(response.data.orders);
            } catch (err) {
                console.log(err);
            }
        }
        getAllFoodOrders();
    }, [axiosPrivate]);

    const handleFoodBookingDelete = async id => {
        const isConfirmed = window.confirm('Are you sure that you want to delete this Order ?');
       
        if(isConfirmed) {
            // delete food
            try {
                await axiosPrivate.delete(`/api/foods/order/${id}`);
                setOrders(orders.filter(c => c.id !== id));
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
                <h1>All Food Orders</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go back</button>
            </div>
            <hr></hr>

            {orders.length > 0 ? (
                <Table>
                    <thead>
                        <tr>
                            <th>#Order ID</th>
                            <th>Customer ID</th>
                            <th>Order Price</th>
                            <th>Total Items Ordered</th>
                            <th>Order Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td>{o.id}</td>
                                <td>{o.customerId}</td>
                                <td>${o.totalPrice}</td>
                                <td>{o.totalItems}</td>
                                <td>{moment(o.createdAt).utc().format('YYYY-MM-DD')}</td>
                                <td>
                                    <div>
                                        <button className='btn btn-primary btn-sm' onClick={() => navigate(`/dash/foods/orders/${o.id}`)} >View More</button>
                                    </div>
                                </td>
                                <td>
                                <div className='d-flex align-items-center justify-content-center'>
                                        <button className='btn btn-sm btn-danger'onClick={() => handleFoodBookingDelete(o.id)} >Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant='info'>No food orders available</Alert>
            )}
        </>
    );
}

export default AllFoodOrders;