import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {storage} from '../../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {toast} from 'react-toastify';

import {InputGroup, Form, Button, Badge, Table, Spinner} from 'react-bootstrap';
import {MdModeEditOutline, MdDeleteForever, MdOutlineAddCircleOutline, MdDeleteSweep, MdAddCircle, MdCancel, MdSort} from 'react-icons/md';

const FoodAdd = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [processing, setProcessing] = useState(false);
    const [images, setImages] = useState([]);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [meals, setMeals] = useState([]);
    const [mealName, setMealName] = useState('');
    const [mealPrice, setMealPrice] = useState(1);
    const [mealCategory, setMealCategory] = useState(categories.length === 0 ? '' : categories[0]);


    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        setImages(imageList);
    };

    const handleAddCategory = () => {
        if(!category.trim()) return;

        if(categories.length === 0 && meals.length === 0) {
            setMealCategory(category.trim());
        }

        if(categories.length === 0 && meals.length > 0) {
            const isConfirmed = window.confirm('some meals are added already. This will change their category to this category. Are you sure you want to continue ?');
            if(isConfirmed) {
                const newMeals = meals.map(m => ({...m, category: category.trim()}));
                setMeals(newMeals);
                setMealCategory(category.trim());
            } else {
                return;
            }
        }

        const alreadyExist = categories.find(c => c.toLowerCase() === category.toLowerCase());

        if(alreadyExist) {
            toast.error(`category ${category} already added`);
            setCategory('');
            return;
        }

        setCategories(prev => [...prev, category.trim()]);
        setCategory('');
        toast.success('category created');
    }

    const handleRemoveCategory = c => {

        if(meals.length > 0 && meals.find(m => m.category.toLowerCase() === c.toLowerCase())) {
            // meals found within the category to be deleted, so remove them
            const isConfirmed = window.confirm(`There are already added meals with the category "${c}". This will remove all of those meals. Are you sure you want to continue ?`);
            if(isConfirmed) {
                setMeals(prev => prev.filter(i => i.category.toLowerCase() !== c.toLowerCase()));
            } else {
                return;
            }
        }

        if(c.toLowerCase() === mealCategory.toLowerCase()) {
            setMealCategory(categories.length > 1 ? categories[0] : '');
        }

        setCategories(prev => prev.filter(i => i.toLowerCase() !== c.toLowerCase()));
        toast.success(`category ${c} removed`);
    }

    const handleAddMeal = () => {
        if(!mealName.trim() || !mealPrice) return;

        // check wether the meal already added with the same category
        const found = meals.find(m => m.name.trim().toLowerCase() === mealName.trim().toLowerCase() && m.category.trim().toLowerCase() === mealCategory.trim().toLowerCase());
    
        if(found) {
            const errMessage = !mealCategory ? `Meal ${mealName} already added` : `Meal ${mealName} already added to the category ${mealCategory}`
            toast.error(errMessage);
            return;
        }

        const newMeal = {
            name: mealName.trim(),
            price: +mealPrice,
            category: !mealCategory ? '' : mealCategory.trim()
        }

        setMeals(prev => [...prev, newMeal]);
        setMealName('');
        setMealPrice(1);
        toast.success(`${newMeal.name} added to the menu`);
    
    }

    const handleRemoveMeal = m => {
        setMeals(prev => prev.filter(i => !(i.name === m.name && i.category === m.category)));
        toast.success(`Meal ${m.name} removed`);
    }

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

    // CREATE NEW MENU
    const handleNewMenuCreation = async () => {

        if(!name.trim()) return toast.error('Menu name is requried');

        if(images.length !== 1) return toast.error('Menu image is requried');

        setProcessing(true);
        // upload image to firebase
        const imageRef = ref(storage, `foods/${uuidv4()}`);
        try {
            const snapshot = await uploadBytes(imageRef, images[0].file);
            const url = await getDownloadURL(snapshot.ref);

            const menu = {
                name: name.trim(),
                categories: categories.length > 0 ? categories : '',
                meals,
                url
            }

            if(categories.length > 0) {
                let categorizedMeals = {};
                categories.forEach(c => {
                    categorizedMeals[c] = meals.filter(m => m.category === c)
                })
                menu.meals = categorizedMeals;
            }

            
            await axiosPrivate.post('/api/foods', JSON.stringify(menu));
            toast.success('Menu created');
            setProcessing(false);
            navigate('/dash/employee/food-management');
        } catch(err) {
            console.log(err);
            setProcessing(false);
            toast.error(err.response.data?.message);
        }


    }

    return (
        <>
            <div className='d-flex align-items-center justify-content-between'>
                <h1>Create New Food Menu</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)} >Go Back</button>
            </div>
            <hr></hr>

            {/* FORM */}

            <div className='form-group mb-4'>
                <label className='form-label' htmlFor='menuName' >Menu Name</label>
                <input type='text' id='menuName' className='form-control' value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className='roomAdd-images-wrapper mb-4'>
                <p className='mb-4 roomAdd-images-label'>Menu Image <small>(Image is required)</small></p>

                <ImageUploading
                    multiple={false}
                    value={images}
                    onChange={onChange}
                    maxNumber={1}
                    dataURLKey="data_url"
                    acceptType={["jpg"]}
                >
                    {({
                        imageList,
                        onImageUpload,
                        onImageRemoveAll,
                        onImageUpdate,
                        onImageRemove,
                        isDragging,
                        dragProps,
                        errors
                        }) => (
                        // write your building UI
                        <>
                        
                        <div className="d-flex align-items-center border p-3" style={{height: '430px'}}>

                            <div className="roomAdd-images-left">
                                <button
                                    type='button'
                                    style={isDragging ? { color: "red" } : null}
                                    onClick={onImageUpload}
                                    {...dragProps}
                                >
                                    <MdOutlineAddCircleOutline />
                                    <span>Click or Drag Images</span>
                                </button>
                                <button type='button' onClick={onImageRemoveAll}><MdDeleteSweep /> <span>Remove All</span></button>
                            </div>

                            <div className="roomAdd-images-right">
                                {imageList.map((image, index) => (
                                    <div key={index} className="image-item" style={{width: '100%', height: '100%'}}>
                                        <img src={image.data_url} alt="" width="100%" height="100%" />
                                        <div className="image-item__btn-wrapper">
                                            <button type='button' onClick={() => onImageUpdate(index)}><MdModeEditOutline /></button>
                                            <button type='button' onClick={() => onImageRemove(index)}><MdDeleteForever /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>    

                        </div>
                        {errors && errors.maxNumber && <span className='text-danger mt-2 roomAdd-images-error'>Only 1 jpeg images are allowed</span>}
                        </>           
                    )}
                </ImageUploading>
            </div>

            {/* CATEGORIES */}

            <div className='mb-4 form-group'>
                <label className='form-label'>Create new categories</label>
                <InputGroup>
                    
                    <Form.Control
                        type="text"
                        placeholder="category name"
                        aria-label="Input group example"
                        aria-describedby="btnGroupAddon"
                        value={category} onChange={e => setCategory(e.target.value)}
                        
                    />
                    <Button disabled={!category.trim()} onClick={handleAddCategory} >Create new category</Button>
                </InputGroup>
            </div>

            {categories.length > 0 && (
                <>
                    <label className='mb-2 text-muted' style={{fontSize: '14px'}}>Already added categories</label>
                    <div className='mb-4 p-3 shadow d-flex align-items-center gap-3'>
                        {categories.map(c => (
                            <Badge key={c} bg="warning" className='d-flex align-items-center gap-2' >{c} <button className='border-0 bg-transparent text-white' onClick={() => handleRemoveCategory(c)} ><MdCancel fontSize={18} /></button></Badge>
                        ))}
                    </div>
                </>
            )}                         

            {/* ADD MEALS */}

            <div className='mb-5'>
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
                            <select onChange={e => setMealCategory(e.target.value.trim())} >
                                {categories.map(c => <option key={c} value={c} >{c}</option>)}
                            </select>
                        )}
                    </div>
                    <div className='form-group' style={{alignSelf: 'flex-end'}}>
                        <button className='btn btn-primary d-flex align-items-center gap-2' disabled={!mealName.trim() || !mealPrice || (categories.length > 0 && !mealCategory)} onClick={handleAddMeal} ><MdAddCircle />Add meal to the menu</button>
                    </div>
                </div>
            </div>

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
                                <tr key={`${m.name}-${m.category}`}>
                                    <td>
                                        {m.name}
                                    </td>
                                    <td>
                                        <p>${m.price.toFixed(2)}</p>
                                    </td>
                                    <td>
                                        {m.category === '' ? 'No Category' : m.category}
                                    </td>
                                    <td>
                                        <div>
                                            <button className='border-0 bg-transparent text-danger' onClick={() => handleRemoveMeal(m)}><MdDeleteForever fontSize={25} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className='my-5'>
                        <button className='d-flex align-items-center justify-content-center gap-3 w-100 btn btn-dark' onClick={handleNewMenuCreation} >
                            {processing ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    processing...
                            </>
                            ) : (
                                <>
                                    <MdAddCircle fontSize={25} /> Create this menu
                                </>
                            )}
                            
                        </button>
                    </div>
                </>
            )}

        </>
    );
}

export default FoodAdd;