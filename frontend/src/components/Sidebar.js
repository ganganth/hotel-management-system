import {useDispatch, useSelector} from 'react-redux';
import {logoutAuthUser, selectAuthUser} from '../app/auth/authSlice';
import {Link} from 'react-router-dom';
import {MdStarBorderPurple500, MdDashboard, MdAccountCircle, MdOutlinePowerSettingsNew, MdSupervisedUserCircle, MdRoomPreferences, MdBedroomParent, MdOutlineFoodBank, MdBookmark, MdDirectionsCarFilled, MdCarRental, MdOutlineVpnKey, MdFastfood, MdEvent, MdKitesurfing, MdSetMeal } from "react-icons/md";
import {FaUsers} from 'react-icons/fa';


const Sidebar = () => {

    const dispatch = useDispatch();
    const {role} = useSelector(selectAuthUser);

    const currentPath = window.location.pathname;

    return (
        <aside className="dash-layout-sidebar">

            <button className='logout-btn' onClick={() => dispatch(logoutAuthUser())}>
                <MdOutlinePowerSettingsNew />
                Logout
            </button>

            <div className='sidebar-logo'>
                <img src='/img/logo.jpg' alt='logo' style={{borderRadius:50}}></img>
            </div>

            <nav className='sidebar-nav'>
                <ul>
                    <li>
                        <Link to='/dash'>
                            <MdDashboard />
                            Dashboard
                        </Link>
                    </li>

                    <li>
                        <Link to='/dash/food-reservation' className={`${currentPath === '/dash/food-reservation' ? 'bg-white text-dark' : ''}`}>
                            <MdFastfood />
                            Foods Reservation
                        </Link>
                    </li>

                    {role === 'Customer' && (
                        <>
                            <li>
                                <Link to='/dash/rooms' className={`${currentPath === '/dash/rooms' ? 'bg-white text-dark' : ''}`}>
                                    <MdBedroomParent />
                                    Rooms
                                </Link>
                            </li>
                        </>
                    )}

                    <li>
                        <Link to='/dash/vehicle-rental' className={`${currentPath === '/dash/vehicle-rental' ? 'bg-white text-dark' : ''}`}>
                            <MdCarRental fontSize={20} />
                            Vehicle Rental
                        </Link>
                    </li>

                    <li>
                        <Link to='/dash/events' className={`${currentPath === '/dash/events' ? 'bg-white text-dark' : ''}`}>
                            <MdKitesurfing fontSize={20} />
                            Events
                        </Link>
                    </li>

                    <li>
                        <Link to='/dash/my-bookings' className={`${currentPath === '/dash/my-bookings' ? 'bg-white text-dark' : ''}`}>
                            <MdBookmark />
                            My Bookings
                        </Link>
                    </li>

                    <li>
                        <Link to='/dash/rentals/my' className={`${currentPath === '/dash/rentals/my' ? 'bg-white text-dark' : ''}`}>
                            <MdOutlineVpnKey />
                            My Rentals
                        </Link>
                    </li>

                    {role === 'Customer' && (
                        <>
                            <li>
                                <Link to='/dash/foods/my-orders' className={`${currentPath === '/dash/foods/my-orders' ? 'bg-white text-dark' : ''}`}>
                                    <MdSetMeal />
                                    My Food Orders
                                </Link>
                            </li>

                            <li>
                                <Link to='/dash/events/my-orders' className={`${currentPath === '/dash/events/my-orders' ? 'bg-white text-dark' : ''}`}>
                                    <MdStarBorderPurple500 />
                                    My Event Orders
                                </Link>
                            </li>
                        </>
                    )}

                    
                    

                    {(role === 'Employee' || role === 'Admin') && (
                        <>
                            
                            <li>
                                <Link to='/dash/rooms' className={`${currentPath === '/dash/rooms' ? 'bg-white text-dark' : ''}`}>
                                    <MdRoomPreferences />
                                    Room Management
                                </Link>
                            </li>
                            <li>
                                <Link to='/dash/employee/vehicle-management' className={`${currentPath === '/dash/employee/vehicle-management' ? 'bg-white text-dark' : ''}`}>
                                    <MdDirectionsCarFilled />
                                    Vehicle Management
                                </Link>
                            </li>
                            <li>
                                <Link to='/dash/employee/food-management' className={`${currentPath === '/dash/employee/food-management' ? 'bg-white text-dark' : ''}`}>
                                    <MdOutlineFoodBank />
                                    Food Management
                                </Link>
                            </li>
                            <li>
                                <Link to='/dash/employee/event-management' className={`${currentPath === '/dash/employee/event-management' ? 'bg-white text-dark' : ''}`}>
                                    <MdEvent />
                                    Event Management
                                </Link>
                            </li>
                            <li>
                                <Link to='/dash/employee/customer-management' className={`${currentPath === '/dash/employee/customer-management' ? 'bg-white text-dark' : ''}`}>
                                    <FaUsers />
                                    Customer Management
                                </Link>
                            </li>
                        </>
                    )}

                    {/* Admin Specific Navigations */}
                    {role === 'Admin' && (
                        <>
                            <li>
                                <Link to='/dash/admin/employee-management' className={`${currentPath === '/dash/admin/employee-management' ? 'bg-white text-dark' : ''}`}>
                                    <MdSupervisedUserCircle />
                                    Employee Management
                                </Link>
                            </li>
                        </>
                    )}

                    
                    <li>
                        <Link to='/dash/profile' className={`${currentPath === '/dash/profile' ? 'bg-white text-dark' : ''}`}>
                            <MdAccountCircle />
                            My Profile
                        </Link>
                    </li>
                </ul>
            </nav>

        </aside>
    );
}

export default Sidebar;