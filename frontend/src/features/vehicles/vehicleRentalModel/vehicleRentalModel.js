import {useState, useRef, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import VehicleCard from "../../../components/VehicleCard";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

import {Row, Col} from 'react-bootstrap';

import moment from "moment";
import {toast} from 'react-toastify';

import {MdClose} from 'react-icons/md';

function getHours(date1, date2) {
    const millieSeconds = Math.abs(date2 - date1);
    return millieSeconds / (1000 * 60 * 60);
}



const VehicleRentalModel = ({vehicle, handleModelClose, pickupDate, dropoffDate}) => {

    const address1Ref = useRef();
    const address2Ref = useRef();
    const cityRef = useRef();

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [selectedPaymentType, setSelectedPaymentType] = useState('full');
    const [selectedPickupMethod, setSelectedPickupMethod] = useState('on-hotel-premise');
    const [pickupLocation, setPickupLocation] = useState({
        address1: '',
        address2: '',
        city: ''
    });
    const [isButtonLoading, setIsButtonLoading] = useState(true);

    useEffect(() => {
        setIsButtonLoading(true);
    }, [selectedPaymentType, selectedPickupMethod])

    const pickupDateString = moment(pickupDate).toDate();
    const dropoffDateString = moment(dropoffDate).toDate();

    const formattedPickupDate = `${pickupDateString.getFullYear()}-${pickupDateString.getMonth() + 1}-${pickupDateString.getDate()} ${pickupDateString.getHours()}:00:00`;
    const formattedDropoffDate = `${dropoffDateString.getFullYear()}-${dropoffDateString.getMonth() + 1}-${dropoffDateString.getDate()} ${dropoffDateString.getHours()}:00:00`;
    

    const calculatePayablePrice = () => {
        let total = calculateTotalPrice();

        if(selectedPaymentType === 'full') {
            return total;
        } else {
            return (total / 2).toFixed(2);
        }
    }

    function calculateTotalPrice() {
        let total;
        if(vehicle.discount > 0) {
            // apply discount
            total = +vehicle.price * +getHours(new Date(formattedPickupDate), new Date(formattedDropoffDate));
            total -= (total / 100) * +vehicle.discount;
        } else {
            // without discount
            total = +vehicle.price * +getHours(new Date(formattedPickupDate), new Date(formattedDropoffDate));
        }
        return total.toFixed(2);
    }

    const handlePreRequesits = () => {

        if(vehicle.pickupPolicy === 'delivery' && (!address1Ref.current.value.trim() || !address2Ref.current.value.trim() || !cityRef.current.value.trim())) {
            toast.error('Delivery location details required');
            return false;
        }

       

        if(vehicle.pickupPolicy === 'both' && selectedPickupMethod === 'delivery' && (!address1Ref.current.value.trim() || !address2Ref.current.value.trim() || !cityRef.current.value.trim())) {
            
            toast.error('Delivery location details required');
            return false;
        }
        return true;
    }

    const handlePaymentSuccess = async details => {

        const rentalData = {
            vehicleId: vehicle.id,
            pickupDate: formattedPickupDate,
            dropoffDate: formattedDropoffDate,
            totalHours: +getHours(new Date(formattedPickupDate), new Date(formattedDropoffDate)),
            totalPrice: +calculateTotalPrice(),
            paymentType: selectedPaymentType,
            totalPaid: +details.purchase_units[0].amount.value,
            isFullyPaid: +calculateTotalPrice() === +details.purchase_units[0].amount.value ? 'yes' : 'no',
            pickupLocation: vehicle.pickupPolicy === 'on-hotel-premise' ? 'on-hotel-premise' : vehicle.pickupPolicy === 'delivery' ? `${address1Ref.current.value}, ${address2Ref.current.value}, ${cityRef.current.value}` : selectedPickupMethod === 'delivery' ? `${address1Ref.current.value}, ${address2Ref.current.value}, ${cityRef.current.value}` : 'on-hotel-premise'
        }

        try {
            const response = await axiosPrivate.post('/api/vehicles/rental', JSON.stringify(rentalData));
            console.log(response);
            // navigate to single rental details page
            toast.success('Payment successful');
            navigate(`/dash/rentals/${response.data.rentalId}`);
            
        } catch (err) {
            toast.error(err.response.data?.message || 'Internal server error');
        }
    }

    return (
        <div className="position-fixed top-50 start-50 bg-white rounded shadow px-3 py-5" style={{width: '1000px', height: '700px', zIndex: 2500, transform: 'translate(-50%, -50%)'}}>
            <button className="border-0 bg-white text-danger position-absolute top-0 end-0" style={{outline: 'none'}}  onClick={handleModelClose}><MdClose fontSize={25} /></button>
            <div style={{height: '100%', overflowY: 'scroll'}} className='hide-scrollbar p-3'>
                <p className="text-center text-dark mb-3" style={{fontSize: '30px', fontWeight: 900}}>Rent Vehicle Now</p>
                <VehicleCard isEditable={false} isRentalBtnVisible={false} vehicle={vehicle} />
                
                <Row>

                    <Col md={7}>
                        <div className="p-3 shadow">
                            <div className="mb-4">
                                <p className="m-0" style={{fontSize: '18px', fontWeight: 500}}>Fuel Policy</p>
                                <hr className="my-1"></hr>
                                <p style={{fontSize: '14px'}}>
                                    This vehicle has {vehicle.fuelPolicy === 'full-to-full' ? (<strong>Full to Full</strong>) : vehicle.fuelPolicy === 'full-to-empty' ? (<strong>Full to empty</strong>) : (<strong>Same to Same</strong>)} fuel policy.
                                    {`${vehicle.fuelPolicy === 'full-to-full' ? ' Customer is required to return the vehicle with a full tank of fuel, and they are charged for the fuel they use during their rental period. This means that the customer is responsible for refilling the fuel tank before returning the rental car.' : vehicle.fuelPolicy === 'full-to-empty' ? ' Customer is provided with a full tank of fuel when they pick up the rental car, but they are not required to return the car with a full tank of fuel.' : ' Customer is required to return the vehicle with the same amount of fuel in the tank as when they picked it up. This means that the customer must refuel the car before returning it to the rental company to ensure that the fuel level is the same as when they received it.'}`}
                                    
                                </p>
                            </div>
                            <div className="mb-4">
                                <p className="m-0" style={{fontSize: '18px', fontWeight: 500}}>Overdue Policy</p>
                                <hr className="my-1"></hr>
                                <p style={{fontSize: '14px'}}>
                                    This vehicle has <strong>${vehicle.overduePrice}</strong> overdue cost <strong>per hour</strong>. If you drop off the vehicle 
                                    late, then for each additional hour you have to pay the overdue cost.
                                    
                                </p>
                            </div>
                            <div className="mb-4">
                                <p className="m-0" style={{fontSize: '18px', fontWeight: 500}}>Pick Up Policy</p>
                                <hr className="my-1"></hr>
                                <p style={{fontSize: '14px'}}>
                                    {vehicle.pickupPolicy === 'delivery' && ("This vehicle will only be delivered to a specified location. Please enter the location address below.")}
                                    {vehicle.pickupPolicy === 'on-hotel-premise' && ("This vehicle can only be picked up at the hotel premise.")}
                                    {vehicle.pickupPolicy === 'both' && ("This vehicle can be picked up at hotel premise or will be delivered to a specified location. Please select which option you prefer.")}
                                </p>
                                {vehicle.pickupPolicy === 'delivery' && (
                                    <div>
                                        <div className="form-group mb-2">
                                            <label className="form-label mb-0" style={{fontSize: '13px'}}>Address Line 1</label>
                                            <input type='text' className="form-control" ref={address1Ref} value={pickupLocation.address1} onChange={e => setPickupLocation(prev => ({...prev, address1: e.target.value}))} />
                                        </div>
                                        <div className="form-group mb-2">
                                            <label className="form-label mb-0" style={{fontSize: '13px'}}>Address Line 2</label>
                                            <input type='text' className="form-control" ref={address2Ref} value={pickupLocation.address2} onChange={e => setPickupLocation(prev => ({...prev, address2: e.target.value}))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label mb-0" style={{fontSize: '13px'}}>City</label>
                                            <input type='text' className="form-control" ref={cityRef} value={pickupLocation.city} onChange={e => setPickupLocation(prev => ({...prev, city: e.target.value}))} />
                                        </div>
                                    </div>
                                )}

                                {vehicle.pickupPolicy === 'both' && (
                                    <>
                                        <div className='d-flex align-items-center gap-5'>
                                            <div className="d-flex align-items-center gap-2">
                                                <input type='radio' name='pickupMethod' value='on-hotel-premise' checked={selectedPickupMethod === 'on-hotel-premise'} onChange={e => setSelectedPickupMethod(e.target.value)} />
                                                <span style={{fontSize: '14px'}}>Pick Up at hotel premises</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <input type='radio' name='pickupMethod' value='delivery' checked={selectedPickupMethod === 'delivery'} onChange={e => setSelectedPickupMethod(e.target.value)} />
                                                <span style={{fontSize: '14px'}}>Pick Up at a delivery location</span>
                                            </div>
                                        </div>
                                        {selectedPickupMethod === 'delivery' && (
                                            <div className='mt-3'>
                                                <div className="form-group mb-2">
                                                    <label className="form-label mb-0" style={{fontSize: '13px'}}>Address Line 1</label>
                                                    <input type='text' className="form-control" ref={address1Ref} value={pickupLocation.address1} onChange={e => setPickupLocation(prev => ({...prev, address1: e.target.value}))} />
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label className="form-label mb-0" style={{fontSize: '13px'}}>Address Line 2</label>
                                                    <input type='text' className="form-control" ref={address2Ref} value={pickupLocation.address2} onChange={e => setPickupLocation(prev => ({...prev, address2: e.target.value}))} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label mb-0" style={{fontSize: '13px'}}>City</label>
                                                    <input type='text' className="form-control" ref={cityRef} value={pickupLocation.city} onChange={e => setPickupLocation(prev => ({...prev, city: e.target.value}))} />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </Col>

                    <Col md={5}>
                        <div className="p-3 shadow rounded">
                            <p className="m-0" style={{fontSize: '20px', fontWeight: 500}}>Rental Details</p>
                            <hr className="mt-1 mb-2"></hr>
                            <div className="mb-2">
                                <label className="text-muted" style={{fontSize: '14px', fontWeight: 500}}>Pick Up Date</label>
                                <p style={{fontSize: '14px'}} className='m-0' >{new Date(formattedPickupDate).toLocaleString()}</p>
                            </div>
                            <div className="mb-2">
                                <label className="text-muted" style={{fontSize: '14px', fontWeight: 500}}>Drop Off Date</label>
                                <p style={{fontSize: '14px'}} className='m-0' >{new Date(formattedDropoffDate).toLocaleString()}</p>
                            </div>
                            <div className="mb-2">
                                <label className="text-muted" style={{fontSize: '14px', fontWeight: 500}}>Total Hours</label>
                                <p style={{fontSize: '14px'}} className='m-0' >{getHours(new Date(formattedPickupDate), new Date(formattedDropoffDate))}</p>
                            </div>
                            <hr className="mb-2"></hr>
                            <div className="mb-2">
                                <label className="text-dark" style={{fontSize: '14px', fontWeight: 500}}>Total Price (USD)</label>
                                <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' >$ {calculateTotalPrice()}</p>
                            </div>
                        </div>

                        <div className="p-3 shadow mt-3">
                            <p className="m-0" style={{fontSize: '20px', fontWeight: 500}}>Pay Now</p>
                            <hr className="my-2"></hr>
                            {vehicle.paymentType === 'half' && (
                                <div>
                                    <label className="text-muted mb-3 d-flex flex-column" style={{fontSize: '14px', fontWeight: 500}}>Select payment type <small>(you can pay half now or full payment now)</small></label>
                                    <div className="d-flex align-items-center gap-5">
                                        <div className="d-flex align-items-center gap-2">
                                            <input type='radio' name='paymentType' value='full' checked={selectedPaymentType === 'full'} onChange={e => setSelectedPaymentType(e.target.value)} />
                                            <span style={{fontSize: '14px'}}>Full Payment</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <input type='radio' name='paymentType' value='half' checked={selectedPaymentType === 'half'} onChange={e => setSelectedPaymentType(e.target.value)} />
                                            <span style={{fontSize: '14px'}}>Half Payment</span>
                                        </div>
                                    </div>
                                    <hr></hr>
                                </div>
                            )}
                            <div className="mb-2">
                                <label className="text-dark" style={{fontSize: '14px', fontWeight: 500}}>Total Payable Price (USD)</label>
                                <p style={{fontSize: '18px', fontWeight: 700}} className='m-0' >$ {calculatePayablePrice()}</p>
                            </div>
                            <hr></hr>
                            <div>
                                
                                    <PayPalScriptProvider 
                                        options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID , components: "buttons", currency: "USD"}}
                                        
                                    >
                                        
                                            <PayPalButtons 
                                                style={{ layout: "horizontal" }}
                                                forceReRender={[selectedPickupMethod, selectedPaymentType]}
                                                onClick={handlePreRequesits}
                                                onInit={() => setIsButtonLoading(false)}
                                                disabled={isButtonLoading}
                                                createOrder={(data, actions) => {

                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: calculatePayablePrice(),
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
                    </Col>
                </Row>

            </div>
        </div>
    );
}

export default VehicleRentalModel;