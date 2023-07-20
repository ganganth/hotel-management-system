// eslint-disable-next-line
import {useState, useEffect} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

/*
const data = [
    {
        category: "Sri Lankan",
        categoryId: 1,
        menu: "Breakfast",
        menuId: 1,
        total_times_ordered: 40
    },
    {
        category: "Indian",
        categoryId: 1,
        menu: "Breakfast",
        menuId: 1,
        total_times_ordered: 10
    },
    {
        category: "Chinease",
        categoryId: 1,
        menu: "Breakfast",
        menuId: 1,
        total_times_ordered: 5
    },
    {
        category: "Jucie",
        categoryId: 1,
        menu: "Breakfast",
        menuId: 1,
        total_times_ordered: 8
    },
    {
        category: "Italian",
        categoryId: 1,
        menu: "Breakfast",
        menuId: 1,
        total_times_ordered: 25
    },
    
];
*/

const PopularFoodCategory = () => {

    const axiosPrivate = useAxiosPrivate();

    const [data, setData] = useState([]);

    useEffect(() => {
        const getPopularCategories = async () => {
            try {
                // eslint-disable-next-line
                const response = await axiosPrivate.get('/api/foods/popular-categories');
                // console.log(response.data);
                const updatedData = response.data.data.map(item => {
                    if(item.category === 'no-category') {
                        return {...item, category: 'Unspecified Categories'}
                    }
                    return item;
                })                
                setData(updatedData);
            } catch (err) {
                console.log(err);
            }
        }
        getPopularCategories();
    }, [axiosPrivate]);

    return (
        <div className="my-5 mx-auto" style={{width: '80%', height: 'max-content'}}>
            <h2 className="mb-5 text-center" style={{fontSize: '25px'}}>Top 5 Most Popular Food Categories</h2>
            <div style={{width: '100%', height: '450px'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total_times_ordered" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default PopularFoodCategory;