
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

import {MdDeleteForever} from 'react-icons/md';

import {toast} from 'react-toastify';

const MenuMealRow = ({meal, menuId, setMeals}) => {

    const axiosPrivate = useAxiosPrivate();

    // handle meal delete
    const handleMealDelete = async () => {
        
        if(window.confirm(`Are you sure that you want to delete meal ${meal.name} ?`)) {
            // delete this meal
            try {
                await axiosPrivate.put('/api/foods/meal/update', JSON.stringify({menuId, categoryId: meal.catId, mealName: meal.name, type: 'delete'}));
                setMeals(prev => prev.filter(m => !(m.catId === meal.catId && m.name === meal.name)));
                toast.success('Meal was deleted');
            } catch (err) {
                toast.error(err.message.data?.message || 'Internal server error');
            }
        }
    }


    return (
        <>
            <tr>
                <td>
                    {meal.name}
                </td>
                <td>
                    <p>${meal.price}</p>
                </td>
                <td>
                    {meal.category === 'no-category' ? 'No Category' : meal.category}
                </td>
                <td>
                    <div>
                        <button className='border-0 bg-transparent text-danger' onClick={handleMealDelete} ><MdDeleteForever fontSize={25} /></button>
                    </div>
                </td>
            </tr>
        </>
    );
}

export default MenuMealRow;