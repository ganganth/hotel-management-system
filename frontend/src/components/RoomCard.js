import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Carousel} from 'react-bootstrap';

import '../styles/roomCard.css';

const RoomCard = ({room}) => {

	const navigate = useNavigate();

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const calculateDiscount = () => {
        const discount = (room.totalPrice / 100) * room.fullPaymentDiscount;
        const discountAdded_prev= ((+room.totalPrice) - (+discount.toFixed(2)));
        const discountAdded=discountAdded_prev.toFixed(2)
        return discountAdded;
    }

    return (
        <div className="row justify-content-center mb-5" >
            <div className="col-sm-9 col-md-12 col-lg-12">
                <div className="hotel-card bg-white rounded-lg shadow overflow-hidden d-block d-lg-flex">

                    <div className="hotel-card_images">

                        <Carousel activeIndex={index} onSelect={handleSelect}>
                            {room.images.map(item => (
                                <Carousel.Item style={{height: '290px'}} key={item.fileName}>
                                    <img
                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                        className="d-block w-100"
                                        src={item.imageUrl}
                                        alt={item.fileName}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>

                    </div>

                    <div className="hotel-card_info px-4 py-3">

							<div className="">
								<h3 className="mb-0 mr-2">{room.name}</h3>
                                <p className='hotel-card_info-description text-muted mt-2 m-0 p-0'>{room.description}</p>
								{/* <div>
									<i className="fa fa-star text-warning"></i>
									<i className="fa fa-star text-warning"></i>
									<i className="fa fa-star text-warning"></i>
									<i className="fa fa-star text-warning"></i>
									<i className="fa fa-star text-warning"></i>
								</div>
								<a href="#!" className="text-dark ml-auto"><i className="far fa-heart fa-lg"></i></a> */}
							</div>
							<div className="d-flex justify-content-between align-items-end mt-2">
								<div className="hotel-card_details">
									<div className="text-muted mb-2"><i className="fas fa-map-marker-alt"></i> {room.bedType}</div>
									{/* <div className="mb-2"><span className="badge badge-primary">4.5</span> <a href="#!" className="text-muted">(245 ratings & 56 reviews)</a></div> */}
									<div className="amnities d-flex align-items-center gap-3 mb-3">
										<img className="mr-2" src="/images/icons/desk-bell.svg" data-toggle="tooltip" data-placement="top" title="Desk bell" alt="Desk bell" />
										<img className="mr-2" src="/images/icons/single-bed.svg" data-toggle="tooltip" data-placement="top" title="Single Bed" alt="Single Bed" />
										<img className="mr-2" src="/images/icons/towels.svg" data-toggle="tooltip" data-placement="top" title="Towels" alt="Towels" />
										<img className="mr-2" src="/images/icons/wifi.svg" data-toggle="tooltip" data-placement="top" title="Wifi" alt="Wifi" />
										<img className="mr-2" src="/images/icons/hammock.png" data-toggle="tooltip" data-placement="top" title="Hammock" alt="Hammock" />
										<img className="mr-2" src="/images/icons/heating.svg" data-toggle="tooltip" data-placement="top" title="Hammock" alt="Hammock" />
									</div>
									<ul className="hotel-checklist p-0 m-0">
										<li className='text-muted'>{room.view.toUpperCase()} View <i className="fa fa-check text-success"></i> </li>
										<li className='text-muted'>Attached Bathrooms {room.bathroomType === 'attached' ? <i className="fa fa-check text-success"></i>  : <i className="fa fa-remove text-danger"></i>} </li>
										<li className='text-muted'>Satellite Television {room.televisionType === 'satellite' ? <i className="fa fa-check text-success"></i> : <i className="fa fa-remove text-danger"></i>}</li>
										<li className='text-muted'>Heating Available {room.heatingAvailability === 'available' ? <i className="fa fa-check text-success"></i>  : <i className="fa fa-remove text-danger"></i>}</li>
										<li className='text-muted'>Towel & Linen Available {room.towelAvailability === 'available' ? <i className="fa fa-check text-success"></i> : <i className="fa fa-remove text-danger"></i>}</li>
									</ul>
                                    
								</div>
								<div className="hotel-card_pricing text-center">
									<h3>${calculateDiscount()}</h3>
									<div className="d-flex gap-2">
										 <h6 className="text-striked text-muted">${room.totalPrice}</h6>
										 <h6 className="text-success">{room.fullPaymentDiscount}% off</h6>
									</div>
									<button className="btn btn-primary" onClick={() => navigate(`/dash/rooms/${room.id}`)}>View More</button>
								</div>
							</div>
						</div>

                </div>
            </div>
        </div>
    );
}


export default RoomCard;