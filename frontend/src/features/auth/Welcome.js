import {useState, useEffect, Suspense} from 'react';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/auth/authSlice';
import moment from 'moment';

import '../../styles/welcome.css';
import PopularFoodCategory from '../../components/charts/PopularFoodCategory';
import BookingsMonthlyReport from '../../components/charts/BookingsMonthlyReport';
import DashboardCard from '../../components/DashboardCard';

const Welcome = () => {

    const user = useSelector(selectAuthUser);

    const [timestamp, setTimestamp] = useState(moment().format('LTS'));

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimestamp(moment().format('LTS'));
        }, 1000)

        return () => clearInterval(timerId);
    }, []);

    return (
        <div>
            <div className="dashboard-welcome-box">
                <div className='contact_left'>
                    <h1>Welcome, <span>{user.username}</span></h1>
                    <h6>{moment().format('MMMM Do YYYY')} , {moment().format('dddd')}</h6>
                   
                    <div className='welcome-box-img'>
                        <img src='/img/welcome.png' alt='welcome' />
                    </div>
                </div>
               
                <div className='contact_us'>
                     <p>Email : lakraj@gmail.com</p>
                    <p>Contact us : 076-4567634</p>
                    <p>Fax : 041-235676</p>
                    <p className='welcome-box-current-time'>{timestamp}</p>
                </div>
            </div>

            {user && user.role === 'Customer' && (
                <div className='my-5'>
                    <div className='d-flex flex-wrap justify-content-between'>
                        <DashboardCard
                            title="Book your room today"
                            text="Booking your room today will ensure your accommodation is secured for your desired dates."
                            url="/images/dash_room.jpg"
                            link="/dash/rooms"
                        />
                        <DashboardCard
                            title="Rent A vehicle!"
                            text="Renting a vehicle will provide you with the means to conveniently travel and explore your destination."
                            url="/images/dash_rental.jpg"
                            link="/dash/vehicle-rental"
                        />
                        <DashboardCard
                            title="Order some foods!"
                            text="Ordering some food will satisfy your hunger and provide you with a delicious meal delivered right to your doorstep. "
                            url="/images/dash_food.jpg"
                            link="/dash/food-reservation"
                        />
                        <DashboardCard
                            title="Join some events!"
                            text="Joining some events will allow you to immerse yourself in enriching experiences, connect with like-minded individuals, and create lasting memories."
                            url="/images/dash_event.jpg"
                            link="/dash/events"
                        />
                    </div>
                </div>
            )}

            {/* Reports Charts  */}
            {user && (user.role === 'Admin' || user.role === 'Employee') && (
                <>
                    <Suspense fallback={<p>Loading...</p>}>
                        <PopularFoodCategory />
                    </Suspense>
                    <Suspense fallback={<p>Loading...</p>}>
                        <BookingsMonthlyReport />
                    </Suspense>
                </>
            )}
            
            
        </div>
    );
}

export default Welcome;