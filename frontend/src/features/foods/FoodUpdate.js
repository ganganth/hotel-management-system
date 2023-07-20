import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {Spinner, Badge, Table} from 'react-bootstrap';

import MenuMealRow from './components/MenuMealRow';

import {MdSort} from 'react-icons/md';

const FoodUpdate = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();
    const id = searchParams.get('id');

    const [loading, setLoading] = useState(true);

    const [menu, setMenu] = useState({});
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [meals, setMeals] = useState([]);

    // const [mealName, setMealName] = useState('');
    // const [mealPrice, setMealPrice] = useState(1);
    // const [mealCategory, setMealCategory] = useState('');

    useEffect(() => {
        const getSingleMenu = async () => {
            try {
                const response = await axiosPrivate.get(`/api/foods/${id}`);
                const menu = response.data.menu;
                setMenu(menu);
                setName(menu.name);
                setCategories(menu.categories.map(c => ({id: c.id, name: c.categoryName})));
                let meals = [];
                for(let key in menu.meals) {
                    const catMeals = menu.meals[key].map(m => ({catId: m.categoryId, category: key, name: m.mealName, price: m.price}));
                    meals = [...meals, ...catMeals]
                }
                setMeals(meals);
                // setMealCategory(menu.categories[0].id);
                setLoading(false);
            } catch (err) {
                console.log(err.response.data?.message);
                setLoading(false);
                navigate('/dash/employee/food-management');
            }
        }
        getSingleMenu();
    }, [navigate, axiosPrivate, id])

    const handleMealSort = () => {
        
        const sortedMeals = meals.sort(function (a, b) {
            if (a.category < b.category) {
              return -1;
            }
            if (a.category > b.category) {
              return 1;
            }
            return 0;
        });
        
        setMeals([...sortedMeals])
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
                    
                    style={{marginTop: '300px'}}
                />
                <small>loading...</small>
            </div>
        ) : (
            <>

                <div className='d-flex align-items-center justify-content-between'>
                    <h1>Update {name} Food Menu</h1>
                    <button className='btn btn-primary' onClick={() => navigate(-1)} >Go Back</button>
                </div>
                <hr></hr>

                {/* FORM */}

                <div className='form-group mb-4'>
                    <label className='form-label' htmlFor='menuName' >Menu Name</label>
                    <input type='text' id='menuName' className='form-control' value={name} onChange={e => setName(e.target.value)} disabled />
                </div>

                {/* CATEGORY INFORMATION */}

                {categories[0].name === 'no-category' && (
                    <p><Badge bg='danger'>No categories for this menu</Badge></p>
                )}

                {categories.length > 0 && categories[0].name !== 'no-category' && (
                    <>
                        <label className='mb-2 text-muted' style={{fontSize: '14px'}}>Categories</label>
                        <div className='mb-4 p-3 shadow d-flex align-items-center gap-3'>
                            {/* <button className='border-0 bg-transparent text-white' ><MdCancel fontSize={18} /></button> */}
                            {categories.map(c => (
                                <Badge key={c.id} bg="warning" className='d-flex align-items-center gap-2' >{c.name}</Badge>
                            ))}
                        </div>
                    </>
                )}

                {/* ADD MEALS */}

                {/* <div className='mb-5'>
                    <label className='mb-2 text-muted' style={{fontSize: '14px'}}>Add new meal</label>
                    <div className='p-3 shadow rounded d-flex align-items-center gap-4'>
                        <div className='form-group'>
                            <label className='form-label'>Meal Name</label>
                            <input type='text' value={mealName} onChange={e => setMealName(e.target.value)} />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Price (USD 1 qty )</label>
                            <input type='number' min="1" step=".01" value={mealPrice.toString()} onChange={e => setMealPrice(+e.target.value)} />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Select meal category</label>
                            {categories.length === 0 ? (
                                <select disabled defaultChecked={mealCategory}>
                                    <option>No categories added</option>
                                </select>
                            ) : (
                                <select onChange={e => setMealCategory(+e.target.value)} >
                                    {categories.map(c => <option key={c.id} value={c.id} >{c.name}</option>)}
                                </select>
                            )}
                        </div>
                        <div className='form-group' style={{alignSelf: 'flex-end'}}>
                            <button className='btn btn-primary d-flex align-items-center gap-2' disabled={!mealName.trim() || !mealPrice || (categories.length > 0 && !mealCategory)} ><MdAddCircle />Add meal to the menu</button>
                        </div>
                    </div>
                </div> */}


                {/* DISPLAY ADDED MEALS */}
                {meals.length > 0 && (
                    <>
                        <p className='m-0 my-3 d-flex align-items-center justify-content-between' style={{fontWeight: 500}}>Meals Details <button className='btn btn-sm btn-secondary d-flex align-items-center gap-2' onClick={handleMealSort} >sort by category <MdSort fontSize={20} /></button></p>
                        <hr></hr>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Meal</th>
                                    <th>Price (USD 1 quantity)</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meals.map(m => (
                                    <MenuMealRow key={`${m.category}-${m.name}`} meal={m} menuId={menu.id} setMeals={setMeals} />
                                ))}
                            </tbody>
                        </Table>
                    </>
                )}
            </>
        )
    );
}

export default FoodUpdate;