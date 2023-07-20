import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {addItemToFoodCart} from '../../../app/foodCart/foodCartSlice';

import {toast} from 'react-toastify';
import {MdOutlineAddCircleOutline} from 'react-icons/md';

const MenuMeal = ({meal}) => {

    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);

    const decreaseQty = () => {
        if(qty === 1) return;
        setQty(prev => prev-1);
    }

    const increaseQty = () => {
        setQty(prev => prev+1);
    }

    const addMealToFoodCart = () => {
        if(qty <= 0) return;

        const data = {
            ...meal,
            quantity: qty
        }

        // dispatch action to update food cart state
        dispatch(addItemToFoodCart(data));

        toast.success(`${meal.mealName} added to the cart`);
        setQty(1);
    }

    return (
        <>
            <div className="w-100 d-flex align-items-center justify-content-between gap-3">
                <span style={{flex: 1, fontSize: '14px'}}>{meal.mealName}</span>
                <span style={{flex: 1, fontSize: '14px'}}>${meal.price}</span>
                <div style={{flex: 1, fontSize: '14px'}} className="d-flex align-items-center" >
                    <button style={{padding: '5px 10px', border: '1px solid #333'}} onClick={decreaseQty} disabled={qty===1} >-</button>
                    <span style={{padding: '5px 10px', borderTop: '1px solid #333', borderBottom: '1px solid #333'}}>{qty}</span>
                    <button style={{padding: '5px 10px', border: '1px solid #333'}} onClick={increaseQty}>+</button>
                </div>
                <button 
                    className="btn btn-primary btn-sm" 
                    style={{flex: 1, fontSize: '14px'}}
                    onClick={addMealToFoodCart}
                >
                    <MdOutlineAddCircleOutline size={20} />
                </button>
            </div>
            <hr></hr>
        </>
    );  
}

export default MenuMeal;