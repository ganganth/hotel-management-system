import {useState, useEffect} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import VehicleCard from '../../components/VehicleCard';
import Overlay from './vehicleRentalModel/Overlay';
import VehicleRentalModel from './vehicleRentalModel/vehicleRentalModel';
import {Row, Col} from 'react-bootstrap';
import moment from 'moment';

import {toast} from 'react-toastify';
import {MdOutlineSearch} from 'react-icons/md';

const VehicleRental = () => {

    const axiosPrivate = useAxiosPrivate();

    const [isOnceSearched, setIsOnceSearched] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [resultVehicles, setResultVehicles] = useState([]);

    const [modelState, setModelState] = useState({
        isOpen: false,
        vehicle: null
    });

    const [pickupDate, setPickupDate] = useState(new Date());
    const [dropoffDate, setDropoffDate] = useState('');

    useEffect(() => {
        setResultVehicles([]);
        setIsOnceSearched(false);
    }, [pickupDate, dropoffDate])

    const yesterday = moment().subtract( 1, 'day' );
    const valid1 = function( current ){
        
        return current.isAfter( yesterday );
    };

    const valid2 = function( current ){
        //console.log(current);
        const currentDate = moment(current);
        const selectedDate = moment(pickupDate);

        const daysDiff = Math.abs(selectedDate.diff(currentDate, 'days'))
        let futureDay;
        //console.log(new Date(moment(new Date())).toDateString());
        //console.log(new Date(moment(pickupDate)).toDateString());
        if(new Date(moment(pickupDate)).toDateString() === new Date(moment(new Date())).toDateString()) {
           futureDay = moment().add(daysDiff - 1, 'day');
        } else {
            futureDay = moment().add(daysDiff, 'day');
        }
        return current.isAfter( futureDay );
    };

    const handleModelState = (vehicle) => {
        setModelState({
            isOpen: true,
            vehicle
        });
    }

    const handleModelClose = () => {
        setModelState({
            isOpen: false,
            vehicle: null
        });
    }

    // function getHours(date1, date2) {
    //     const millieSeconds = Math.abs(date2 - date1);
    //     return millieSeconds / (1000 * 60 * 60);
    // }

    const handleVehicleSearch = async () => {

        // check for the dropOffDate before search
        if(!dropoffDate && dropoffDate.trim() === '') return toast.error('please select drop off date');

        setIsSearching(true);

        const pickupDateString = moment(pickupDate).toDate();
        const dropoffDateString = moment(dropoffDate).toDate();

        const sqlPickupDate = `${pickupDateString.getFullYear()}-${pickupDateString.getMonth() + 1}-${pickupDateString.getDate()} ${pickupDateString.getHours()}:00:00`;
        const sqlDropoffDate = `${dropoffDateString.getFullYear()}-${dropoffDateString.getMonth() + 1}-${dropoffDateString.getDate()} ${dropoffDateString.getHours()}:00:00`;
    
        // console.log(getHours(new Date(sqlPickupDate), new Date(sqlDropoffDate)));

        try {
            // MAKE THE API CALL TO FETCH AVAILABLE VEHICLES
            const response = await axiosPrivate.get(`/api/vehicles/rental/search?pickupDate=${sqlPickupDate}&dropoffDate=${sqlDropoffDate}`);
            console.log(response);
            setIsOnceSearched(true);
            setResultVehicles(response.data.vehicles);
            setIsSearching(false);
        } catch (err) {
            console.log(err.response.data?.message || 'Internal server error');
            setIsSearching(false);
        }
    }

    return (

        <>
            {modelState.isOpen && modelState.vehicle && (
                <>
                    <Overlay />
                    <VehicleRentalModel vehicle={modelState.vehicle} handleModelClose={handleModelClose} pickupDate={pickupDate} dropoffDate={dropoffDate} />
                </>
            )}
            

            <div>
                <h6 className="text-center" style={{fontSize: '40px', fontWeight: 900}}>Journey Beyond, Your Comprehensive Resource for Car Rentals and Exploration !</h6>
            </div>
            <hr></hr>

            <div className='w-75 mx-auto shadow px-3 py-4 rounded mt-4'>
                <p className='text-dark text-start my-0' style={{fontSize: '14px', fontWeight: 500, marginLeft: '25px'}}>Please select your <strong>Pick Up Date</strong> and <strong>Drop Off Date</strong></p>

                <div className='d-flex align-items-center justify-content-center gap-5 mt-3 w-100 mx-auto'>
                    <div>
                        <label htmlFor="pickup-date-picker" className='text-muted mb-2' style={{fontSize: '14px'}}>Select Pick Up Date</label>
                        <Datetime
                            inputProps={{ id: 'pickup-date-picker' }}
                            value={pickupDate}
                            onChange={(date) => setPickupDate(date)}
                            timeFormat="HH A"
                            isValidDate={valid1}
                        />
                    </div>

                    <span style={{width: '30px', height: '3px', alignSelf: 'flex-end', marginBottom: '20px'}} className='bg-secondary' ></span>

                    <div className=''>
                        <label htmlFor="dropoff-date-picker" className='text-muted mb-2' style={{fontSize: '14px'}}>Select Drop Off Date</label>
                        <Datetime
                            inputProps={{ id: 'dropoff-date-picker' }}
                            value={dropoffDate}
                            onChange={(date) => setDropoffDate(date)}
                            timeFormat="HH A"
                            isValidDate={valid2}
                        />
                    </div>

                    <button style={{alignSelf: 'flex-end', fontWeight: 500, width: '180px'}} className='btn btn-warning text-white px-3 d-flex align-items-center justify-content-center gap-1' onClick={handleVehicleSearch} disabled={isSearching} >
                        <MdOutlineSearch fontSize={22} />
                        {isSearching ? 'searching...' : 'search'}
                    </button>
                </div>

            </div>

            {!isOnceSearched && !isSearching && (
                <div className='d-flex align-items-center justify-content-center' style={{marginTop: '180px'}}>
                    <p className='d-flex align-items-center gap-4 text-warning' style={{fontSize: '30px', fontWeight: 500}}><MdOutlineSearch fontSize={50} /> Search for vehicles...</p>
                </div>
            )}

            {isSearching && (
                <div className='d-flex align-items-center justify-content-center' style={{marginTop: '180px'}}>
                    <p className='d-flex flex-column align-items-center gap-2 text-warning' style={{fontSize: '16px', fontWeight: 500}}><MdOutlineSearch fontSize={50} className='search-icon' /> Searching...</p>
                </div>
            )}
            
            
            {/* RENDER SEARCH RESULT */}
           
           {!isSearching && resultVehicles.length > 0 && (
                <Row className='my-5'>
                    <Col md={12}>
                        {resultVehicles.map(v => <VehicleCard key={v.id} vehicle={v} isEditable={false} isRentalBtnVisible={true} handleModelState={handleModelState} />)}
                    </Col>
                </Row>
           )}
            

        </>

    );
}

export default VehicleRental;