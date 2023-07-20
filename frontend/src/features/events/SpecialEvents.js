import {useState, useEffect} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import EventCard from './components/EventCard';
import EventCart from './components/EventCart';


const SpecialEvents = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [specialEvents, setSpecialEvents] = useState([]);

    useEffect(() => {
        const getAllSpecialEvents = async () => {
            try {
                const response = await axiosPrivate.get('/api/events/special');
                console.log(response);
                setSpecialEvents(response.data.events);
            } catch (err) {
                console.log(err);
            }
        }
        getAllSpecialEvents();
    }, [axiosPrivate])


    return (
        <>
            <div className='d-flex align-items-center justify-content-between'>
                <h2>Special Events</h2>
                <EventCart />
            </div>
            <hr></hr>

            <button className='btn btn-primary mb-5' onClick={() => navigate(-1)} >Go Back</button>

            {specialEvents.length > 0 && (
                <div className='d-flex flex-wrap justify-content-between'>
                    {specialEvents.map(event => (
                        <EventCard event={event} key={event.id} />
                    ))}
                </div>
            )}
            
        </>
    );
}

export default SpecialEvents;