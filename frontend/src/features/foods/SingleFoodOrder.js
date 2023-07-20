import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/auth/authSlice';

import {Spinner, Alert, Row, Col, Badge} from 'react-bootstrap';

const SingleFoodOrder = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const {id} = useParams();
    const user = useSelector(selectAuthUser);
    

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState({});

    useEffect(() => {
        const getOrderDetails = async () => {
            try {
                const response = await axiosPrivate.get(`/api/foods/order/single/${id}`);
                setOrder(response.data.order);
            } catch (err) {
                console.log(err);
                setLoading(false);
                navigate('/dash/foods/my-orders');
            } finally {
                setLoading(false);
            }
        }
        getOrderDetails();
    }, [axiosPrivate, id, navigate]);



    return (
        <>
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

            {!loading && order?.id && (
                <>
                    <div className='d-flex align-items-center justify-content-between'>
                        <Alert variant='info'>Food Order {order.id} Details</Alert>
                        <button className='btn btn-primary' onClick={() => navigate(-1)} >Go Back</button>
                    </div>
                    <hr></hr>

                    <Row className="my-5">
                        <Col md={8}>
                            <div>
                                <h4 className='mb-4'>Order Items</h4>
                                {order?.orderItems.map(item => (
                                    <div className='shadow p-3 d-flex align-items-center mb-4 rounded' key={`${item.menuId}-${item.categoryId}-${item.mealName}`}>
                                        <div className='d-flex flex-column gap-2' style={{flex: 1}}>
                                            <span style={{fontSize: '12px', fontWeight: 500}}>Meal</span>
                                            <span style={{fontSize: '14px'}}>{item.mealName}</span>
                                        </div>
                                        <div className='d-flex flex-column gap-2' style={{flex: 1}}>
                                            <span style={{fontSize: '12px', fontWeight: 500}}>Price ($ unit price)</span>
                                            <span style={{fontSize: '14px'}}>${item.price}</span>
                                        </div>
                                        <div className='d-flex flex-column gap-2 align-items-center' style={{flex: 1}}>
                                            <span style={{fontSize: '12px', fontWeight: 500}}>Quantity</span>
                                            <span style={{fontSize: '14px'}}>{item.quantity}</span>
                                        </div>
                                        <div className='d-flex flex-column gap-2 align-items-center' style={{flex: 1}}>
                                            <span style={{fontSize: '12px', fontWeight: 500}}>Total</span>
                                            <span style={{fontSize: '14px'}}>${(+item.quantity * +item.price).toFixed(2)}</span>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </Col>

                        <Col md={4}>
                            <h4 className='mb-4'>Order Description</h4>
                            <div className="shadow p-4 rounded">
                                
                                <div className="mb-2">
                                    <label className="text-dark" style={{fontSize: '14px', fontWeight: 500}}>#Order ID</label>
                                    <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' >{order.id}</p>
                                </div>
                                <hr className='my-2'></hr>
                                <div className="mb-2">
                                    <label className="text-dark" style={{fontSize: '14px', fontWeight: 500}}>Customer ID</label>
                                    <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' >{order.customerId}</p>
                                </div>
                                <hr className='my-2'></hr>
                                <div className="mb-2">
                                    <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Total Items Ordered</label>
                                    <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' >{order?.totalItems}</p>
                                </div>
                                <hr className='my-2'></hr>
                                <div className="mb-2">
                                    <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Total</label>
                                    <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' >${order?.totalPrice}</p>
                                </div>
                                <hr className='my-2'></hr>
                                <div className="mb-2">
                                    <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Ordered Date</label>
                                    <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' >{new Date(order?.createdAt).toLocaleDateString()}</p>
                                </div>
                                <hr className='my-2'></hr>
                                <div className="mb-2">
                                    <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Payment Status</label>
                                    <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' ><Badge bg='success'>Paid</Badge></p>
                                </div>
                            
                            </div>

                            {user.role !== 'Customer' && (

                                <Row>
                                    <Col md={12}>
                                        <>
                                            <h3 className='my-3' style={{fontSize: '20px', fontWeight: 900}}>Customer Details</h3>
                                            <div className='p-3 shadow'>
                                                <div className='mb-3'>
                                                    <img src={order.customerDetails?.avatar} alt='avatar' style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%'}} />
                                                </div>
                                                <div className='mb-3'>
                                                    <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer ID</label>
                                                    <p><span className='bg-dark text-white px-3 py-1 rounded' style={{fontWeight: 500}}>{order.customerDetails?.id}</span></p>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer Name</label>
                                                    <p>{order.customerDetails?.name}</p>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer Phone</label>
                                                    <p>{order.customerDetails?.phone}</p>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer Email</label>
                                                    <p>{order.customerDetails?.email}</p>
                                                </div>
                                            </div>
                                        </>
                                    </Col>
                                </Row>

                            )}

                        </Col>

                    </Row>
                </>
            )}
            
        </>
    );
}

export default SingleFoodOrder;