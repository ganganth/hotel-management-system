import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import RoomBookingModel from '../../components/RoomBookingModel';
import {Row, Col} from 'react-bootstrap';

import {FaBed, FaChild, FaMale} from 'react-icons/fa';
import {MdClose, MdBookmarkAdd} from 'react-icons/md';
// swiper imports
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Autoplay, EffectCoverflow, Lazy, Zoom} from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/lazy';
import 'swiper/css/zoom';

import '../../styles/room_management/roomView.css';

const RoomView = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const {id} = useParams();

    const [room, setRoom] = useState({});
    const [isBookingModelOpen, setIsBookingModelOpen] = useState(false);

    useEffect(() => {

        const getSingleRoomType = async () => {
            try {
                const response = await axiosPrivate.get(`/api/rooms/${id}`);
                console.log(response.data);
                setRoom(response.data.room);
            } catch (err) {
                console.log(err);
                //navigate(-1);
            }
        }
        getSingleRoomType();

    }, [axiosPrivate, navigate, id]);

    const handleBookingModelClose = () => setIsBookingModelOpen(false);

    const calculateDiscount = () => {
        const discount = (room.totalPrice / 100) * room.fullPaymentDiscount;
        const discountAdded = ((+room.totalPrice) - (+discount.toFixed(2)));
        return discountAdded;
    }

    return (
            room.name && (
                <div className='roomView'>

                    {isBookingModelOpen && (
                        <>
                            <div className='roomView-overlay'></div>
                            <RoomBookingModel room={room} handleBookingModelClose={handleBookingModelClose} />
                        </>
                    )}
                    

                    <aside className='employeeList-header'>
                        <h1 className='roomView-header-title'>{room.name}</h1>
                        <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
                    </aside>
                
                    <div className='my-5'>
                        <Swiper
                            modules={[Navigation, Autoplay, EffectCoverflow, Lazy, Zoom]}
                            centeredSlides
                            slidesPerView={2}
                            grabCursor
                            navigation
                            autoplay
                            lazy
                            zoom
                            effect='coverflow'
                            coverflowEffect={{
                                rotate: 50,
                                stretch: 0,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true
                            }}
                        >
                            {room.images.map(item => (
                                <SwiperSlide key={item.fileName}>
                                    <div className='swiper-zoom-container'>
                                        <img src={item.imageUrl} alt={item.fileName} />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className='roomView-details'>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <div className='roomView-details-legend roomView-details-bedType'>
                                    <p className='roomView-details-title'>Bed Type</p>
                                    <p><span><FaBed /></span> {room.bedType}</p>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='roomView-details-legend'>
                                    <p className='roomView-details-title'>Adult Occupancy</p>
                                    <p>
                                        {room.adultOccupation === 0 && (<span><MdClose color='red' /></span>)}
                                        {Array.from({length: room.adultOccupation}).map((i, index) => (<span key={index}><FaMale /></span>))}
                                    </p>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='roomView-details-legend'>
                                    <p className='roomView-details-title'>Child Occupancy</p>
                                    <p>
                                        {room.childOccupation === 0 && (<span><MdClose color='red' /></span>)}
                                        {Array.from({length: room.childOccupation}).map((i, index) => (<span key={index}><FaChild /></span>))}
                                    
                                    </p>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <p  className='roomView-details-title'>Room Description</p>
                                <p>{room.description}</p>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={8}>
                        
                                <Row className='border p-4 mb-4'>
                                    <Col md={6}>
                                        <div>
                                            <p className='roomView-details-title'>Common Features</p>
                                            <ul>
                                                <li>{room.view.toUpperCase()} View</li>
                                                <li>{room.bathroomType === 'attached' ? 'Attached Bathroom' : 'Not Attached Bathroom'}</li>
                                                <li>{room.televisionType === 'cable' ? 'Cable Television' : 'Satellite Television'}</li>
                                                <li>{room.heatingAvailable === 'available' ? 'Heating Available' : 'Heating Not Available'}</li>
                                                <li>{room.towelAvailable === 'available' ? 'Linen & Towel Provided' : 'Linen & Towel Not Available'}</li>
                                                      <li>{room.towelAvailable === 'available' ? 'Linen & Towel Provided' : 'Linen & Towel Not Available'}</li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div>
                                            <p className='roomView-details-title'>Special Features</p>
                                            <ul>
                                                {room.specialFeatures.map(item => (
                                                    <li key={item.id}>{item.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12}>
                                    <div className='roomView-details-legend'>
                                    <p className='roomView-details-title'>Total {room.name}s</p>
                                    <p>
                                        {room.totalRooms}
                                    </p>
                                </div>
                                    </Col>  
                                </Row>
                            </Col>

                            <Col md={4}>
                                <div className='roomView-details-price-container'>
                                    <h1 className='text-center roomView-details-price-main-title'>Price Per Night</h1>
                                    <hr></hr>
                                    <p className='text-center roomView-details-price-main-price'>${room.totalPrice}</p>
                                    <div className='d-flex flex-column align-items-center'>
                                        <small className='text-center text-muted mb-4'>When booking a room make the full payment and get <span className='text-success'>{room.fullPaymentDiscount}%</span> Discount</small>
                                        <h5 className='roomView-details-price-discount-desc'>Full Payment Price</h5>
                                        <p className='roomView-details-price-discount'>${calculateDiscount()}</p>
                                        <p className='text-muted roomView-details-price-discount-show'><span className='roomView-details-price-discount-linethrough'>${room.totalPrice}</span> off {room.fullPaymentDiscount}%</p>
                                        <button className='d-block btn btn-primary roomView-details-price-book-btn' onClick={() => setIsBookingModelOpen(true)}>Book Room Now <MdBookmarkAdd /></button>                  
                                    </div>
                                </div>
                            </Col>
                        </Row>

                    </div>

                </div>
            )
    );
}


export default RoomView;
