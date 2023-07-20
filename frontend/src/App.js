import {Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';

// utilities
import RequireAuth from './utils/RequireAuth';
import PersistAuth from './utils/PersistAuth';

// pages
import Public from './components/Public';
import Login from './components/Login';
import Register from './features/auth/Register';

// protected pages
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';

// employee, admin specific pages
import CustomerList from './features/customers/CustomerList';
import RoomList from './features/rooms/RoomList';
import RoomAdd from './features/rooms/RoomAdd';

// admin specific pages
import EmployeeList from './features/employees/EmployeeList';
import EmployeeAdd from './features/employees/EmployeeAdd';

// profile page
import Profile from './features/profile/Profile';

// customer, employee, admin specific
import RoomView from './features/rooms/RoomView';
import MyBookings from './features/bookings/MyBookings';
import SingleBookingView from './features/bookings/SingleBookingView';
import Unauthorized from './features/unauthorized/Unauthorized';
import VehicleList from './features/vehicles/VehicleList';
import VehicleAdd from './features/vehicles/VehicleAdd';
import VehicleRental from './features/vehicles/VehicleRental';
import SingleRental from './features/vehicles/rentals/SingleRental';
import MyRentals from './features/vehicles/rentals/MyRentals';
import FoodAdd from './features/foods/FoodAdd';
import FoodList from './features/foods/FoodList';
import FoodUpdate from './features/foods/FoodUpdate';
import MenuList from './features/foods/MenuList';
import Menu from './features/foods/Menu';
import FoodCart from './features/foods/FoodCart';
import EventList from './features/events/EventList';
import EventAdd from './features/events/EventAdd';
import Events from './features/events/Events';
import CommonEvents from './features/events/CommonEvents';
import SpecialEvents from './features/events/SpecialEvents';
import EventsCart from './features/events/EventsCart';
import EventOrders from './features/events/EventOrders';
import AllBookings from './features/bookings/AllBookings';
import MyFoodOrders from './features/foods/MyFoodOrders';
import AllFoodOrders from './features/foods/AllFoodOrders';
import AllRentals from './features/vehicles/rentals/AllRentals';
import SingleFoodOrder from './features/foods/SingleFoodOrder';
import AllEventOrders from './features/events/AllEventOrders';

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Layout />} >
        <Route index element={<Public />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />

        <Route element={<PersistAuth />}>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route index element={<Welcome />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='rooms/:id' element={<RoomView />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='rooms' element={<RoomList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='vehicle-rental' element={<VehicleRental />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='rentals/my' element={<MyRentals />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='rentals/:rentalId' element={<SingleRental />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='my-bookings' element={<MyBookings />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='bookings/:bookingId' element={<SingleBookingView />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='food-reservation' element={<MenuList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='food-reservation/cart' element={<FoodCart />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='food-reservation/menu/:menuId' element={<Menu />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='foods/my-orders' element={<MyFoodOrders />} />
            </Route>
          </Route>

          {/* /dash/foods/orders/ */}
          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='foods/orders/:id' element={<SingleFoodOrder />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='events' element={<Events />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='events/common' element={<CommonEvents />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='events/special' element={<SpecialEvents />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='events/cart' element={<EventsCart />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='events/my-orders' element={<EventOrders />} />
            </Route>
          </Route>

          {/* Employee & Admin Specific Routes */}

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/customer-management' element={<CustomerList />} />
            </Route>
          </Route>

            {/* /dash/employee/room-management/bookings */}
            <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
              <Route path='dash' element={<DashLayout />}>
                <Route path='employee/room-management/bookings' element={<AllBookings />} />
              </Route>
            </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/room-management/add' element={<RoomAdd />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/vehicle-management' element={<VehicleList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/vehicle-management/add' element={<VehicleAdd />} />
            </Route>
          </Route>

          {/* /dash/employee/vehicle-management/rentals */}
          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/vehicle-management/rentals' element={<AllRentals />} />
            </Route>
          </Route>


          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/food-management' element={<FoodList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/food-management/add' element={<FoodAdd />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/food-management/update' element={<FoodUpdate />} />
            </Route>
          </Route>

          {/* /dash/employee/food-management/orders */}
          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/food-management/orders' element={<AllFoodOrders />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/event-management' element={<EventList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/event-management/add' element={<EventAdd />} />
            </Route>
          </Route>

          {/* /dash/employee/event-management/orders */}
          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='employee/event-management/orders' element={<AllEventOrders />} />
            </Route>
          </Route>
        

          {/* Admin Specific Routes */}

          <Route element={<RequireAuth allowedRoles={['Admin']} />}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='admin/employee-management' element={<EmployeeList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin']} />}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='admin/employee-management/add' element={<EmployeeAdd />} />
            </Route>
          </Route>

          {/* Profile Route */}
          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']} />}>
            <Route path='dash' element={<DashLayout />}>
              <Route path='profile' element={<Profile />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']} />}>
            <Route path='unauthorized' element={<DashLayout />}>
              <Route index element={<Unauthorized />} />
            </Route>
          </Route>

        </Route>

      </Route>
    </Routes>
  );
}


export default App;
