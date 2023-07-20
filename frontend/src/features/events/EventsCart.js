import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from "react-router-dom";
import EventCart from "./components/EventCart";

import {Row, Col, Image, Alert} from 'react-bootstrap';
import { MdDeleteForever } from 'react-icons/md';
import { removeEventFromCart, resetCart } from '../../app/eventCart/eventSlice';
import { toast } from 'react-toastify';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { selectAuthUser } from '../../app/auth/authSlice';

const EventsCart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();

    const {items} = useSelector(state => state.eventCart)
    const user = useSelector(selectAuthUser);

    const [isButtonLoading, setIsButtonLoading] = useState(true);

    const handleRemoveCartItem = event => {
        dispatch(removeEventFromCart(event));
        toast.success(`Event ${event.name} removed from cart`);
    }

    const handlePaymentSuccess = async details => {

        // create a new event order

        // we need items, and also the total
        const data = {
            events: items,
            total: +details.purchase_units[0].amount.value
        }

        try {
            await axiosPrivate.post('/api/events/order', JSON.stringify(data));

            toast.success('Payment success');
            // clear the cart
            dispatch(resetCart());
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <>
            
            <div className="d-flex align-items-center justify-content-between">
                <h2>Event Cart</h2>
                <EventCart />
            </div>
            <hr></hr>

            <button className="btn btn-primary mb-4" onClick={() => navigate(-1)}>Go Back</button>

            {user?.role !== 'Customer' && (<Alert variant='danger' className='mt-4'>Sorry, to order events you have to logged in as a customer</Alert>)}

            {items.length === 0 && <p className='text-center my-3'>No events in the cart</p>}

            {items.length > 0 && (
                <Row className="mb-5">
                    <Col md={8}>
                        <div>
                            <h4 className='mb-4'>Cart Items</h4>
                            {items.map(e => (
                                <div className='shadow p-3 mb-4 d-flex align-items-center gap-5' key={e.id}>
                                    <Image src={e.image} width={100} />
                                    <div className='d-flex flex-column gap-2' style={{flex: 1}}>
                                        <span style={{fontSize: '12px', fontWeight: 500}}>Event</span>
                                        <span style={{fontSize: '14px'}}>{e.name}</span>
                                    </div>
                                    <div className='d-flex flex-column gap-2' style={{flex: 1}}>
                                        <span style={{fontSize: '12px', fontWeight: 500}}>People</span>
                                        <span style={{fontSize: '14px'}}>{e.people}</span>
                                    </div>
                                    <div className='d-flex flex-column gap-2' style={{flex: 1}}>
                                        <span style={{fontSize: '12px', fontWeight: 500}}>Price</span>
                                        <span style={{fontSize: '14px'}}>${e.price}</span>
                                    </div>
                                    <div className='d-flex flex-column gap-2' style={{flex: 1}}>
                                        <span style={{fontSize: '12px', fontWeight: 500}}>Total</span>
                                        <span style={{fontSize: '14px'}}>${(+e.price * +e.people).toFixed(2)}</span>
                                    </div>
                                    <div style={{flex: .5}} className='text-center'>
                                        <button className='btn text-danger' style={{flex: 1}} onClick={() => handleRemoveCartItem(e)}><MdDeleteForever size={30} /></button>
                                    </div>
                                </div> 
                            ))}
                        </div>
                    </Col>
                    {user?.role === 'Customer' && (
                        <Col md={4}>
                            <h4 className='mb-4'>Description</h4>
                            <div className="shadow p-4 rounded">
                                <ul className='m-0 p-0' style={{listStyle: 'none'}}>
                                    <li className='d-flex align-items-center justify-content-between mb-4' >
                                        <span style={{flex: 1, fontSize: '14px', fontWeight: 500}}>Event</span>
                                        <span style={{flex: 1, fontSize: '14px', fontWeight: 500, textAlign: 'center'}}>People</span>
                                        <span style={{flex: 1, fontSize: '14px', fontWeight: 500, textAlign: 'end'}}>Total</span>
                                    </li>
                                    {items.map(e => (
                                        <li key={e.id} className='d-flex align-items-center justify-content-between border-bottom pb-3 mt-3' >
                                            <span style={{flex: 1}}>{e.name}</span>
                                            <span style={{flex: 1, textAlign: 'center'}}>{e.people}</span>
                                            <span style={{flex: 1, textAlign: 'end'}}>${(+e.price * +e.people).toFixed(2)}</span>
                                        </li>
                                    ))}
                                    <li className='d-flex align-items-center justify-content-between border-bottom pb-3 mt-3'>
                                        <span style={{fontSize: '20px', fontWeight: 500}}>Total</span>
                                        <span style={{fontSize: '20px', fontWeight: 500}}>${items.reduce((acc, item) => acc + (+item.price * +item.people), 0).toFixed(2)}</span>
                                    </li>

                                    <li className='mt-3'>
                                        <p className='text-center m-0 mb-2' style={{fontSize: '20px', fontWeight: 700}}>Reserve Now</p>
                                        <PayPalScriptProvider 
                                            options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID , components: "buttons", currency: "USD"}}
                                            
                                        >
                                            
                                                <PayPalButtons 
                                                    style={{ layout: "horizontal" }}
                                                    // forceReRender={[selectedPickupMethod, selectedPaymentType]}
                                                    // onClick={handlePreRequesits}
                                                    onInit={() => setIsButtonLoading(false)}
                                                    disabled={isButtonLoading}
                                                    createOrder={(data, actions) => {

                                                        return actions.order.create({
                                                            purchase_units: [
                                                                {
                                                                    amount: {
                                                                        value: items.reduce((acc, item) => acc + (+item.price * +item.people), 0),
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
                                    </li>

                                </ul>
                            </div>
                        </Col>
                    )}
                </Row>
            )}
        </>
    );
}

export default EventsCart;