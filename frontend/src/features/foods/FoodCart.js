import { useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import CartBadge from "./components/CartBadge";
import {removeItemFromFoodCart, clearCart} from '../../app/foodCart/foodCartSlice';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { selectAuthUser } from '../../app/auth/authSlice';

import {Row, Col, Alert} from 'react-bootstrap';
import {MdDeleteForever} from 'react-icons/md';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const FoodCart = () => {

    const items = useSelector(state => state.foodCart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const user = useSelector(selectAuthUser);

    const [isButtonLoading, setIsButtonLoading] = useState(true);

    const handleRemoveCartItem = item => {
        dispatch(removeItemFromFoodCart({menuId: item.menuId, categoryId: item.categoryId, mealName: item.mealName}));

        toast.success(`${item.mealName} is removed`);
    }

    const handlePaymentSuccess = async details => {
        console.log(details);
        // payment successful, place the order
        const orderData = {
            totalPrice: details.purchase_units[0].amount.value,
            totalItems: items.length,
            orderItems: items.map(i => ({
                ...i,
                totalPrice: +i.quantity * +i.price
            }))
        }

        try {
            const response = await axiosPrivate.post('/api/foods/order', JSON.stringify(orderData));
            console.log(response);
            toast.success('Order paid successfully');

            // clear the cart
            dispatch(clearCart());
        } catch (err) {
            console.log(err);
            toast.error(err.response.data?.message || 'Internal server error');
        }
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h1>Food Cart</h1>
                <CartBadge />
            </div>
            <hr></hr>

            <button className='btn btn-primary btn-sm' onClick={() => navigate(-1)}>Go Back</button>

            {user?.role !== 'Customer' && (<Alert variant='danger' className='mt-4'>Sorry, to order food you have to logged in as a customer</Alert>)}

            {items.length === 0 && <p className='text-center my-3'>No foods in the cart</p>}

            {items.length > 0 && (
                <Row className="my-5">
                    <Col md={8}>
                        <div>
                            <h4 className='mb-4'>Cart Items</h4>
                            {items.map(item => (
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

                                    <div style={{flex: .5}} className='text-center'>
                                        <button className='btn text-danger' style={{flex: 1}} onClick={() => handleRemoveCartItem(item)}><MdDeleteForever size={30} /></button>
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
                                        <span style={{flex: 1, fontSize: '14px', fontWeight: 500}}>Meal</span>
                                        <span style={{flex: 1, fontSize: '14px', fontWeight: 500, textAlign: 'center'}}>Quantity</span>
                                        <span style={{flex: 1, fontSize: '14px', fontWeight: 500, textAlign: 'end'}}>Total</span>
                                    </li>
                                    {items.map(item => (
                                        <li key={`${item.menuId}-${item.categoryId}-${item.mealName}`} className='d-flex align-items-center justify-content-between border-bottom pb-3 mt-3' >
                                            <span style={{flex: 1}}>{item.mealName}</span>
                                            <span style={{flex: 1, textAlign: 'center'}}>{item.quantity}</span>
                                            <span style={{flex: 1, textAlign: 'end'}}>${(+item.quantity * +item.price).toFixed(2)}</span>
                                        </li>
                                        
                                    ))}
                                    <li className='d-flex align-items-center justify-content-between border-bottom pb-3 mt-3'>
                                        <span style={{fontSize: '20px', fontWeight: 500}}>Total</span>
                                        <span style={{fontSize: '20px', fontWeight: 500}}>${items.reduce((acc, item) => acc + (+item.price * +item.quantity), 0).toFixed(2)}</span>
                                    </li>
                                    <li className='mt-3'>
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
                                                                        value: items.reduce((acc, item) => acc + (+item.price * +item.quantity), 0),
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

export default FoodCart;
