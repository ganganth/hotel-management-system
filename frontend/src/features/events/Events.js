import {useEffect, useState} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {MdOutlineArrowForward} from 'react-icons/md';
import { Spinner } from 'react-bootstrap';
import EventCart from './components/EventCart';
import { useNavigate } from 'react-router-dom';

const Events = () => {

    const axiosPrivate = useAxiosPrivate();

    const [overallData, setOverallData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getOverallEventsData = async () => {
            try {
                const response = await axiosPrivate.get('/api/events/overall');
                setOverallData(response.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        getOverallEventsData();
    }, [axiosPrivate]);

    return (
        <>
            <div className='d-flex align-items-center justify-content-between'>
                <h3>More events to enjoy</h3>
                <EventCart />
            </div>
            <hr></hr>

            <div className="d-flex justify-content-between my-5">
                <CommonEventsCard loading={loading} overallData={overallData} />
                <SpecialEventsCard loading={loading} overallData={overallData} />
            </div>

        </>
    );
}

const CommonEventsCard = ({loading, overallData}) => {

    const navigate = useNavigate();

    return (
        <div className="shadow p-3 px-4 rounded" style={{width: '47%'}}>
            <h4 className="text-center mb-4">Common Events</h4>
            <div className='my-3'>
                <img src="/images/common.jpg" alt="common" style={{width: '100%', height: '300px', objectFit: 'cover'}} />
            </div>
            <p className='my-4'>
                Hotels are popular venues for a wide range of events, from weddings and business meetings to banquets and holiday celebrations. The convenience and versatility of hotels make them ideal locations for hosting events of all sizes and types. With spacious ballrooms and meeting rooms equipped with audio-visual equipment, catering services, and accommodations, hotels offer everything needed for successful events.
            </p>
            <div className='d-flex flex-column align-items-center gap-4 my-5'>
                <span className='d-flex align-items-center justify-content-center' style={{width: '100px', height: '100px', borderRadius: '50%', outline: '10px solid #333', fontSize: '40px', fontWeight: 500}}>
                    {loading ? (
                        <Spinner
                            as="span"
                            animation="grow"
                            size="xl"
                            role="status"
                            aria-hidden="true"
                        />
                    ) : overallData.common}
                </span>
                <span style={{fontWeight: 500}}>we are offering {loading ? '...' : overallData.common} common events</span>
            </div>
            <button 
                className='btn btn-primary w-100 mb-4 d-flex align-items-center justify-content-center gap-3'
                onClick={() => navigate('/dash/events/common')}
            >
                Explore more common events <MdOutlineArrowForward size={25} /></button>
        </div>
    );
}

const SpecialEventsCard = ({loading, overallData}) => {

    const navigate = useNavigate();

    return (
        <div className="shadow p-3 px-4 rounded" style={{width: '47%'}}>
            <h4 className="text-center mb-4">Special Events</h4>
            <div className='my-3'>
                <img src="/images/special.jpg" alt="common" style={{width: '100%', height: '300px', objectFit: 'cover'}} />
            </div>
            <p className='my-4'>
                In addition to common hotel events, hotels also host special events that draw in crowds and create memorable experiences for guests. These events are often themed and curated to cater to specific interests or occasions. One example of a special hotel event is a wine-tasting weekend, where guests can indulge in tastings of different wines, attend educational seminars, and enjoy gourmet food pairings.
            </p>
            <div className='d-flex flex-column align-items-center gap-4 my-5'>
                <span className='d-flex align-items-center justify-content-center' style={{width: '100px', height: '100px', borderRadius: '50%', outline: '10px solid #333', fontSize: '40px', fontWeight: 500}}>
                    {loading ? (
                        <Spinner
                            as="span"
                            animation="grow"
                            size="xl"
                            role="status"
                            aria-hidden="true"
                        />
                    ) : overallData.special}
                </span>
                <span style={{fontWeight: 500}}>we are offering {loading ? '...' : overallData.special} special events</span>
            </div>
            <button 
                onClick={() => navigate('/dash/events/special')}
                className='btn btn-primary w-100 mb-4 d-flex align-items-center justify-content-center gap-3'>Explore more special events <MdOutlineArrowForward size={25} /></button>
        </div>
    );
}

export default Events;