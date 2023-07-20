import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

import {Table, Spinner, Badge} from 'react-bootstrap';

const MyRentals = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [loading, setLoading] = useState(true);
    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        const getMyRentals = async () => {
            try {
                const response = await axiosPrivate.get('/api/vehicles/rental/my');
                console.log(response);
                setRentals(response.data.rentals);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        }
        getMyRentals();
    }, [axiosPrivate]);

    return (
        <div>
            <h1>My Rentals</h1>

            <hr></hr>

            {loading && (
                <div className='d-flex flex-column gap-2 justify-content-center align-items-center'>
                    <Spinner
                        as="span"
                        animation="grow"
                        size="xl"
                        role="status"
                        aria-hidden="true"
                        
                        style={{marginTop: '250px'}}
                    />
                    <small>loading...</small>
                </div>
            )}

            {!loading && rentals.length > 0 && (
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
                                        <button className='btn btn-primary btn-sm' onClick={() => navigate(`/dash/rentals/${r.id}`)} >View more</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            
            {!loading && rentals.length === 0 && (<p className='alert alert-warning'>No rentals</p>)}    
            
        </div>
    );
}

export default MyRentals;