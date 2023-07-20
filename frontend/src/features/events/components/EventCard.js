import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Card, Button} from 'react-bootstrap';
import { addEventToCart } from '../../../app/eventCart/eventSlice';

import {toast} from 'react-toastify';

const EventCard = ({event}) => {

    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);

    const decreaseQty = () => {
        if(qty === 1) return;
        setQty(prev => prev-1);
    }

    const increaseQty = () => {
        setQty(prev => prev+1);
    }

    const handleAddEventToCart = () => {
        const e = {
            id: event.id,
            image: event.image,
            people: qty,
            name: event.name,
            type: event.type,
            price: event.price
        }

        dispatch(addEventToCart(e));
        toast.success(`Event ${event.name} added to the cart`);
    }

    return (
        <div className="p-3 rounded">
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={event.image} />
                <Card.Body>
                    <Card.Title className='mb-4'>{event.name}</Card.Title>
                    <div className='d-flex flex-column mb-3'>
                        <label style={{fontSize: '14px', fontWeight: 500}}>Price (per person)</label>
                        <span style={{fontSize: '22px', fontWeight: 500}}>${event.price}</span>
                    </div>
                    <p className='m-0 mb-1' style={{fontSize: '14px'}}>Total People</p>
                    <div style={{flex: 1, fontSize: '14px'}} className="d-flex align-items-center" >
                        <button style={{padding: '5px 10px', border: '1px solid #333'}} onClick={decreaseQty} disabled={qty===1} >-</button>
                        <span style={{padding: '5px 10px', borderTop: '1px solid #333', borderBottom: '1px solid #333'}}>{qty}</span>
                        <button style={{padding: '5px 10px', border: '1px solid #333'}} onClick={increaseQty}>+</button>
                    </div>
                    <Button variant="primary" className='mt-3' onClick={handleAddEventToCart} >Add to event cart</Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default EventCard;