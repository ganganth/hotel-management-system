import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import VehicleCard from '../../components/VehicleCard';
import {Spinner} from 'react-bootstrap';

import{toast} from 'react-toastify';
import {MdQueue} from 'react-icons/md';

const VehicleList = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAllVehicleData = async () => {
            try {
                const response = await axiosPrivate.get('/api/vehicles');
                setVehicles(response.data.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.log(err);
            }
        }
        getAllVehicleData();
    }, [axiosPrivate])

    const handleDelete = async (vehicleId) => {
        const isConfirmed = window.confirm('Are you sure that you want to delete this vehicle ?');

        if(isConfirmed) {
            try {
                await axiosPrivate.delete(`/api/vehicles/${vehicleId}`);
                // delete success, so update the vehicles state
                setVehicles(prev => prev.filter(v => v.id !== vehicleId));
                toast.success('Vehicle removed');
            } catch (err) {
                toast.error(err.response.data?.message || 'vehicle deletion ailed');
            }
        }
    }


    return (
        <div>
            <div className="d-flex align-items-center justify-content-between">
                <h1>Vehicle Management</h1>
                <button className='btn btn-dark' onClick={() => navigate('/dash/employee/vehicle-management/rentals')} >View All Rentals</button>
                <button className='btn btn-primary d-flex align-items-center gap-2' onClick={() => navigate('/dash/employee/vehicle-management/add')}><MdQueue /> Add New Vehicle</button>
            </div>
            <hr></hr>

            {/* Search for vehicle section */}

            {loading ? (
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
            ) : (
                <div>
                    {vehicles.length > 0 ? (
                        vehicles.map(v => <VehicleCard key={v.id} vehicle={v} handleDelete={handleDelete} />)
                    ) : (
                        <h1 className='text-center mt-5'>No vehicles to show</h1>
                    )}
                </div>
            )}
            
        </div>
    );
}

export default VehicleList;