import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';


const CartBadge = () => {

    const cartItems = useSelector(state => state.foodCart.items);

    return (
        <Link to='/dash/food-reservation/cart' className='d-flex align-items-center gap-2 shadow btn btn-white position-relative' style={{textDecoration: 'none', padding: '10px 20px', borderRadius: '30px'}}>
            {cartItems.length > 0 && (
                <span className='position-absolute bg-danger text-white d-flex align-items-center justify-content-center' style={{top: '0', right: '10px', width: '20px', height: '20px', borderRadius: '50%', fontSize: '12px', fontWeight: 500}}>{cartItems.length}</span>
            )}
            <span className='text-dark'>Food Cart</span>
            <img src="/images/icons/grocery-cart.png" alt="Food-cart" style={{width: '25px', height: '25px'}} />
        </Link>
    );
}

export default CartBadge;