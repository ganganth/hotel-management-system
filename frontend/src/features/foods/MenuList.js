import {useState, useEffect} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useNavigate} from 'react-router-dom';
import {Spinner, Card, Button} from 'react-bootstrap';
import CartBadge from './components/CartBadge';

const MenuList = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAllMenus = async () => {
            try {
                const response = await axiosPrivate.get('/api/foods');
                console.log(response);
                setMenus(response.data.menus);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        getAllMenus();
    }, [axiosPrivate])

    return (
        <>
            <div className='d-flex align-items-center justify-content-between'>
                <h1>Menus</h1>
                <CartBadge />
            </div>
            <hr></hr>

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

            {!loading && menus.length > 0 && (
                <div className='d-flex flex-wrap gap-5'>
                    {menus.map(menu => (
                        <Card style={{ width: '20rem' }} key={menu.id} >
                            <Card.Img variant="top" src={menu.image} width={200} height={200} />
                            <Card.Body className='d-flex flex-column position-relative' style={{paddingBottom: '60px'}}>
                                <Card.Title className="text-center mb-3" style={{fontSize: '25px', fontWeight: 700}}>{menu.name}</Card.Title>

                                <div>
                                    <p style={{fontSize: '16px', fontWeight: 500, textDecoration: 'underline'}}>Categories</p>

                                    {menu.categories.map((cat, index) => (
                                        <div key={`${menu.id}-${cat.id}`}>
                                            <div key={index} className='d-flex align-items-center justify-content-between mb-2' >
                                                <span>{cat.categoryName === 'no-category' ? 'No special category' : cat.categoryName}</span>
                                                <span className='d-flex align-items-center justify-content-center' style={{width: '20px', height: '20px', borderRadius: '50%', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 500}}>{cat.totalMeals}</span>
                                            </div>
                                            <hr></hr>
                                        </div>
                                    ))}
                                </div>
                                
                                
                                <Button 
                                    variant="primary" 
                                    className='mt-3 position-absolute left-0 btn-sm d-block' 
                                    style={{top: 'auto',
                                    bottom: '10px', // Adjust the value as needed
                                    width: '90%',
                                    transform: 'translateX(-50%)', // Center horizontally
                                    left: '50%'}} 
                                    onClick={() => navigate(`/dash/food-reservation/menu/${menu.id}`)}
                                >
                                    View Menu
                                </Button>
                            </Card.Body>
                        </Card>
                        
                    ))}
                </div>
            )}


        </>
    );
}

export default MenuList;