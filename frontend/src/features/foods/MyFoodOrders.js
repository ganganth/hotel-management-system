import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../app/auth/authSlice';
import { Alert, Table } from 'react-bootstrap';
import moment from 'moment';

const MyFoodOrders = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const authUser = useSelector(selectAuthUser);

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getAllFoodOrders = async () => {
            try {
                const response = await axiosPrivate.get(`/api/foods/order/${authUser.id}`);
                console.log(response);
                setOrders(response.data.orders);
            } catch (err) {
                console.log(err);
            }
        }
        getAllFoodOrders();
        // eslint-disable-next-line
    }, [axiosPrivate]);



    return (
        <>
            <div className='d-flex align-items-center justify-content-between'>
                <h1>My Food Orders</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)} >Go Back</button>
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
                            <th>Actions</th>
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
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert>No Food Orders</Alert>
            )}
        </>
    );
}

export default MyFoodOrders;