import { Link } from "react-router-dom";
import {useSelector} from 'react-redux';
import {MdAddShoppingCart} from 'react-icons/md';

const EventCart = () => {

    const {items} = useSelector(state => state.eventCart);

    return (
        <Link to='/dash/events/cart' className='d-flex align-items-center gap-2 shadow btn btn-white position-relative' style={{textDecoration: 'none', padding: '10px 20px', borderRadius: '30px'}}>
            {items.length > 0 && (
                <span className='position-absolute bg-danger text-white d-flex align-items-center justify-content-center' style={{top: '0', right: '10px', width: '20px', height: '20px', borderRadius: '50%', fontSize: '12px', fontWeight: 500}}>{items.length}</span>
            )}
            <span className='text-dark'>Event Cart</span>
            
            <MdAddShoppingCart style={{width: '25px', height: '25px'}} />
        </Link>
    );
}

export default EventCart;