import {useState, useEffect} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import EventCard from './components/EventCard';
import EventCart from './components/EventCart';


const CommonEvents = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [commonEvents, setCommonEvents] = useState([]);

    useEffect(() => {
        const getAllCommonEvents = async () => {
            try {
                const response = await axiosPrivate.get('/api/events/common');
                console.log(response);
                setCommonEvents(response.data.events);
            } catch (err) {
                console.log(err);
            }
        }
        getAllCommonEvents();
    }, [axiosPrivate])


    return (
        <>
            <div className='d-flex align-items-center justify-content-between'>
                <h2>Common Events</h2>
                <EventCart />
            </div>
            <hr></hr>

            <button className='btn btn-primary mb-5' onClick={() => navigate(-1)} >Go Back</button>

            {commonEvents.length > 0 && (
                <div className='d-flex flex-wrap'>
                    {commonEvents.map(event => (
                        <EventCard event={event} key={event.id} />
                    ))}
                </div>
            )}
            
        </>
    );
}

export default CommonEvents;