import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/auth/authSlice';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import RoomCard from '../../components/RoomCard';

import {MdBedroomParent} from 'react-icons/md';

const RoomList = () => {

    const {role} = useSelector(selectAuthUser);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const getAllRoomTypes = async () => {
            try {
                const response = await axiosPrivate.get('/api/rooms');
                setRooms(response.data.rooms);
            } catch (err) {
                console.log(err);
            }
        }
        getAllRoomTypes();
    }, [axiosPrivate]);

    return (
        <div>

            {(role === 'Employee' || role === 'Admin') && (
                <>
                    <aside className='employeeList-header'>
                        <h1>Room Management</h1>
                        <button className='btn btn-dark' onClick={() => navigate('/dash/employee/room-management/bookings')}>View All Bookings</button>
                        <button className='btn btn-primary' onClick={() => navigate('/dash/employee/room-management/add')}>Create New Room Type <MdBedroomParent /></button>
                    </aside>

                    <hr></hr>
                </>
            )}
            

            <div className='container mt-4'>
                {rooms.length > 0 && rooms.map(r => (
                    <RoomCard key={r.id} room={r} />
                ))}
            </div>

        </div>
    );
}

export default RoomList;