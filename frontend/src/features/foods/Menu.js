import {useState, useEffect} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useParams, useNavigate} from 'react-router-dom';

import {Spinner} from 'react-bootstrap';
import MenuMeal from './components/MenuMeal';
import CartBadge from './components/CartBadge';

const Menu = () => {

    const [menu, setMenu] = useState({});
    const [loading, setLoading] = useState(true);

    const axiosPrivate = useAxiosPrivate();
    const {menuId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getMenuData = async () => {

            try {
                const response = await axiosPrivate.get(`/api/foods/user/${menuId}`);
                setMenu(response.data.menu);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        getMenuData();
    }, [axiosPrivate, menuId]);


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
                        
                        style={{marginTop: '280px'}}
                    />
                    <small>loading...</small>
                </div>
            )}

            {!loading && menu.id && (
                <>
                    <div className='d-flex align-items-center justify-content-between'>
                        <h1>{menu.name} Menu</h1>
                        <CartBadge />
                    </div>
                    <hr></hr>

                    <button className='btn btn-primary btn-sm' onClick={() => navigate(-1)}>Go Back</button>

                    <h1 className='text-center'>
                        {menu.name}
                    </h1>

                    <div className='mt-4 mb-5'>
                        <img src={menu.image} alt={menu.name} className="rounded" width="100%" height="400px" style={{objectFit: 'cover'}} />
                    </div>

                    <div className='d-flex flex-wrap justify-content-between'>
                        {menu.categories.map(cat => (
                            <div key={cat.id} className='px-4 py-3 shadow mb-4' style={{minWidth: '48%'}} >
                                <p className='text-center' style={{fontWeight: 500}}>{cat.categoryName === 'no-category' ? 'Meals' : `${cat.categoryName}`}</p>
                                <div className='d-flex gap-3 align-items-center justify-content-center'>
                                    <span style={{flex: 1, fontSize: '12px', fontWeight: 500}}>Meal</span>
                                    <span style={{flex: 1, fontSize: '12px', fontWeight: 500}}>Price($ pre unit)</span>
                                    <span style={{flex: 1, fontSize: '12px', fontWeight: 500}}>Quantity</span>
                                    <span style={{flex: 1, fontSize: '12px', fontWeight: 500}}>Add to food cart</span>
                                </div>
                                <hr></hr>
                                {cat.meals.map(meal => (<MenuMeal key={`${cat.id}-${meal.mealName}`} meal={meal} />))}
                            </div>
                        ))}
                    </div>

                </>
            )}

        </>
        
    );
}

export default Menu;