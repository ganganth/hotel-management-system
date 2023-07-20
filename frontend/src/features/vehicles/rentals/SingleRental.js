import {useState, useEffect} from 'react';
import {useParams, useNavigate, useSearchParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../../app/auth/authSlice';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


import VehicleCard from '../../../components/VehicleCard';

import {Row, Col} from 'react-bootstrap';

import {Spinner, Badge} from 'react-bootstrap';
import {toast} from 'react-toastify';

const SingleRental = () => {

    const {rentalId} = useParams();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const user = useSelector(selectAuthUser);
    const [searchParams] = useSearchParams();

    const [rental, setRental] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({
        isError: false,
        errorMessage: ''
    });
    const [isButtonLoading, setIsButtonLoading] = useState(true);

    useEffect(() => {
        if(rentalId) {
            const getRentalDetails = async () => {
                try {
                    const response = await axiosPrivate.get(`/api/vehicles/rental/${rentalId}`);
                    console.log(response);
                    setRental(response.data.rental);
                    setLoading(false);
                } catch (err) {
                    console.log(err);
                    toast.error(err.response.data?.message || 'Internal server error');
                    setError({isError: true, errorMessage: err.response.data?.message});
                    setLoading(false);
                }
            }
            getRentalDetails();
        }
    }, [rentalId, axiosPrivate])

    const handlePaymentSuccess = async details => {
        // update the rental record
        try {
            const data = {
                rentalId: rental.id,
                isFullyPaid: 'yes',
                totalPaid: +rental.totalPaid + (+details.purchase_units[0].amount.value)
            }
            
            await axiosPrivate.put('/api/vehicles/rental/payment', JSON.stringify(data));
            toast.success('Balance paid, payment success');
            // update the current state
            setRental(prev => ({...prev, isFullyPaid: 'yes', totalPaid: +prev.totalPaid + (+details.purchase_units[0].amount.value)}))
        } catch (err) {
            console.log(err);
        }
    }

    return (
        loading ? (
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
        ) : !error.isError ? (
            <>
                <div className='d-flex align-items-center justify-content-end'>
                    <button className='btn btn-primary mb-3' onClick={() => navigate(searchParams.get('isEmployeeView') === 'true' ? '/dash/employee/vehicle-management/rentals' : '/dash/rentals/my')}>View All Rentals</button>
                </div>
                <h4 className='alert alert-info'>Rental ID : {rentalId} Details</h4>
                <hr></hr>

                <h3 className='my-3' style={{fontSize: '20px', fontWeight: 900}}>Vehicle Rented</h3>
                <VehicleCard vehicle={rental.vehicleData} isEditable={false} isRentalBtnVisible={false} />

                

                <Row className='mb-5'>

                    <Col md={7}>
                        <h3 className='my-3' style={{fontSize: '20px', fontWeight: 900}}>Rental Details</h3>
                        <div className="p-3 shadow rounded">
                           

                            <div className="mb-4">
                                <p className="m-0" style={{fontSize: '18px', fontWeight: 500}}>Fuel Policy</p>
                                <hr className="my-1"></hr>
                                <p style={{fontSize: '14px'}}>
                                    This vehicle has {rental.vehicleData?.fuelPolicy === 'full-to-full' ? (<strong>Full to Full</strong>) : rental.vehicleData?.fuelPolicy === 'full-to-empty' ? (<strong>Full to empty</strong>) : (<strong>Same to Same</strong>)} fuel policy.
                                    {`${rental.vehicleData?.fuelPolicy === 'full-to-full' ? ' Customer is required to return the vehicle with a full tank of fuel, and they are charged for the fuel they use during their rental period. This means that the customer is responsible for refilling the fuel tank before returning the rental car.' : rental.vehicleData?.fuelPolicy === 'full-to-empty' ? ' Customer is provided with a full tank of fuel when they pick up the rental car, but they are not required to return the car with a full tank of fuel.' : ' Customer is required to return the vehicle with the same amount of fuel in the tank as when they picked it up. This means that the customer must refuel the car before returning it to the rental company to ensure that the fuel level is the same as when they received it.'}`}
                                
                                    
                                </p>    
                            </div>
                            <div className="mb-4">
                                <p className="m-0" style={{fontSize: '18px', fontWeight: 500}}>Overdue Policy</p>
                                <hr className="my-1"></hr>
                                <p style={{fontSize: '14px'}}>
                                    This vehicle has <strong>${rental.vehicleData?.overduePrice}</strong> overdue cost <strong>per hour</strong>. If you drop off the vehicle 
                                    late, then for each additional hour you have to pay the overdue cost.
                                    
                                </p>
                            </div>
                            <div className="mb-4">
                                <p className="m-0" style={{fontSize: '18px', fontWeight: 500}}>Pick Up Location</p>
                                <hr className="my-1"></hr>
                                <p style={{fontSize: '14px'}}>
                                    {rental.pickupLocation === 'on-hotel-premise' ? 'On Hotel Premise' : rental.pickupLocation}
                                </p>
                            </div>
                            <div className="mb-4">
                                <p className="m-0" style={{fontSize: '18px', fontWeight: 500}}>Renting Dates</p>
                                <hr className="my-1"></hr>
                                <div className="mb-2">
                                    <label className="text-muted" style={{fontSize: '12px', fontWeight: 500}}>Pick Up Date</label>
                                    <p style={{fontSize: '14px'}} className='m-0' >{new Date(rental.pickupDate).toLocaleString()}</p>
                                </div>
                                <div className="mb-2">
                                    <label className="text-muted" style={{fontSize: '12px', fontWeight: 500}}>Drop Off Date</label>
                                    <p style={{fontSize: '14px'}} className='m-0' >{new Date(rental.dropoffDate).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="m-0" style={{fontSize: '18px', fontWeight: 500}}>Total Hours</p>
                                <hr className="my-1"></hr>
                                <p style={{fontSize: '14px'}}>
                                    {rental.totalHours} hours
                                </p>
                            </div>
                        </div>
                    </Col>

                    <Col md={5} className='px-5'>
                        <h3 className='my-3' style={{fontSize: '20px', fontWeight: 900}}>Payment Details</h3>

                        <div className="p-3 shadow rounded">
                            <div className="mb-2">
                                <label className="text-dark" style={{fontSize: '14px', fontWeight: 500}}>Total Price (USD)</label>
                                <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' >$ {rental.totalPrice}</p>
                            </div>
                            <hr className='my-2'></hr>
                            <div className="mb-2">
                                <label className="text-dark" style={{fontSize: '14px', fontWeight: 500}}>Total Paid (USD)</label>
                                <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' >$ {rental.totalPaid}</p>
                            </div>
                            <hr className='my-2'></hr>
                            <div className="mb-2">
                                <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Payment Type</label>
                                <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' >{rental.paymentType === 'half' ? <span className='bg-info px-3 py-1 text-white rounded' style={{fontSize: '12px'}}>Half Payment</span> : <span className='bg-info px-3 py-1 text-white rounded' style={{fontSize: '12px'}}>Full Payment</span>}</p>
                            </div>
                            <hr className='my-2'></hr>
                            <div className="mb-2">
                                <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Payment Status</label>
                                <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' >{rental.isFullyPaid === 'yes' ? <Badge bg='success'>Paid</Badge> : <Badge bg='warning'>Pending</Badge>}</p>
                            </div>
                        </div>

                        {user.role !== 'Customer' && (
                            <>
                                <h3 className='my-3' style={{fontSize: '20px', fontWeight: 900}}>Customer Details</h3>
                                <div className='p-3 shadow'>
                                    <div className='mb-3'>
                                        <img src={rental.customerData?.avatar} alt='avatar' style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%'}} />
                                    </div>
                                    <div className='mb-3'>
                                        <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer ID</label>
                                        <p><span className='bg-dark text-white px-3 py-1 rounded' style={{fontWeight: 500}}>{rental.customerData?.id}</span></p>
                                    </div>
                                    <div className='mb-3'>
                                        <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer Name</label>
                                        <p>{`${rental.customerData?.firstName} ${rental.customerData?.lastName}`}</p>
                                    </div>
                                    <div className='mb-3'>
                                        <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer Phone</label>
                                        <p>{rental.customerData?.phone}</p>
                                    </div>
                                    <div className='mb-3'>
                                        <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer Email</label>
                                        <p>{rental.customerData?.email}</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {rental.isFullyPaid === 'no' && ((rental.customerRole === 'Customer' && user.role === 'Customer' && rental.customerId.toString() === user.id.toString()) || (rental.customerRole === 'Employee' && (user.role === 'Employee' || user.role === 'Admin') && user.id.toString() === rental.customerId.toString())) && (
                            <>
                                <h3 className='my-3' style={{fontSize: '20px', fontWeight: 900}}>Pay Now</h3>

                                <div className='p-3 shadow'>
                                    <small className='mb-3 d-block' style={{lineHeight: '18px'}}>Your having a pending balance for the rental. You can pay it now</small>
                                    <div className="mb-2">
                                        <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Remaining balance (USD)</label>
                                        <p style={{fontSize: '18px', fontWeight: 700}} className='m-0'>${(rental.totalPrice - rental.totalPaid).toFixed(2)}</p>
                                    </div>
                                    <hr className='my-2'></hr>
                                    <div>
                                
                                        <PayPalScriptProvider 
                                            options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID , components: "buttons", currency: "USD"}}
                                            
                                        >
                                            <PayPalButtons 
                                                style={{ layout: "horizontal" }}
                                                onInit={() => setIsButtonLoading(false)}
                                                disabled={isButtonLoading}

                                                createOrder={(data, actions) => {

                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: rental.totalPrice - rental.totalPaid,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order.capture().then((details) => {
                                                        handlePaymentSuccess(details);
                                                    });
                                                }}
                                                
                                            />

                                        </PayPalScriptProvider>
                            
                                    </div>
                                </div>
                                
                            </>
                        )}

                        {/* {user.role !== 'Customer' && (rental.customerRole === 'Customer' || (rental.customerRole === 'Employee' && rental.customerId.toString() !== user.id.toString())) && ( */}
                            
                                                {/* && (rental.customerRole === 'Customer' || (rental.customerRole === 'Employee' && +rental.customerId !== +user.id ) */}

                            
                            
                        

                    </Col>

                </Row>
            </>
        ) : (
            <p className='alert alert-danger'>{error.errorMessage}</p>
        )
    );
}

export default SingleRental;