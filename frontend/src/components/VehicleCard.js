import {useSelector} from 'react-redux';
import {selectAuthUser} from '../app/auth/authSlice';
import {useNavigate} from 'react-router-dom';

import {Carousel, Badge} from 'react-bootstrap';
import {MdInfo, MdCheckCircle, MdCancel, MdDeleteForever, MdModeEditOutline, MdDoubleArrow} from 'react-icons/md';
import {FaCarSide, FaGasPump, FaMapMarkerAlt, FaCheck} from 'react-icons/fa';

const VehicleCard = ({vehicle, handleDelete=null, isEditable=true, isRentalBtnVisible=false, handleModelState=null}) => {

    const navigate = useNavigate();
    const user = useSelector(selectAuthUser);

    const calculatePriceWithDiscount = (price, discount) => {
        const d = (+price / 100) * +discount;
        return (+price - d).toFixed(2);
    }

    return (
        <div className="p-4 shadow mb-4 w-100 position-relative">

            {user.role !== "Customer" && isEditable && (
                <div className='position-absolute top-0 end-0 d-flex align-items-center gap-3 px-3 py-2'>
                    <button className='bg-transparent border-0' onClick={() => navigate(`/dash/employee/vehicle-management/add?edit=true&id=${vehicle.id}`)} ><MdModeEditOutline fontSize={25} className='text-dark' /></button>
                    <button className='bg-transparent border-0' onClick={() => handleDelete(vehicle.id)}><MdDeleteForever fontSize={25} className='text-danger' /></button>
                </div>
            )}
            

            <div className="d-flex align-items-center justify-content-center gap-4">
                {/* image carousel */}
                <div style={{width: '35%', alignSelf: 'flex-start'}}>
                    <Carousel className='w-100'>
                        {vehicle.images.map(img => (
                            <Carousel.Item key={img.fileName}>
                                <img
                                    className="d-block w-100"
                                    src={img.url}
                                    alt={img.fileName}
                                    style={{height: '200px', objectFit: 'cover'}}
                                />
                            </Carousel.Item>
                        ))}
                        
                    </Carousel>
                </div>
                {/* details */}
                <div className='d-flex flex-column justify-content-start align-items-start' style={{width: '65%', height: 'max-content'}}>
                    <h5 className='mt-0 mb-4 d-flex align-items-center gap-4' style={{fontSize: '30px', fontWeight: 700}} >{vehicle.name} <Badge bg={vehicle.vehicleCondition === 'normal' ? 'warning' : vehicle.vehicleCondition === 'semi-luxary' ? 'info' : 'success'} style={{fontSize: '12px'}}>{vehicle.vehicleCondition === 'normal' ? 'Normal' : vehicle.vehicleCondition === 'semi-luxary' ? 'Semi Luxary' : 'Luxary'}</Badge></h5>
                    <div className='d-flex align-items-center gap-4 flex-wrap'>
                        <p className='d-flex align-items-center gap-1 text-muted m-0'>
                            {/* <MdAirlineSeatReclineNormal fontSize={25} className='text-muted' /> */}
                            <img src="https://img.icons8.com/material-rounded/24/null/passenger.png" alt='seat' style={{width: '20px', height: '20px'}} />
                            <span style={{fontSize: '14px', fontWeight: 500}}>{vehicle.seats} seats</span>
                        </p>
                        <p className='d-flex align-items-center gap-2 text-muted m-0'>
                            <img src="https://img.icons8.com/ios-glyphs/30/null/briefcase.png" alt='bag' style={{width: '20px', height: '20px'}}/>
                            {/* <MdShoppingBag fontSize={25} className='text-muted' /> */}
                            <span style={{fontSize: '14px', fontWeight: 500}}>{vehicle.bags} bags</span>
                        </p>
                        <p className='d-flex align-items-center gap-2 text-muted m-0'>
                            <img src="https://img.icons8.com/material-rounded/24/null/car-door.png" alt='door' style={{width: '20px', height: '20px'}} />
                            <span style={{fontSize: '14px', fontWeight: 500}}>{vehicle.doors} doors</span>
                        </p>
                        <p className='d-flex align-items-center gap-2 text-muted m-0'>
                            {/* <FaSnowflake fontSize={25} className='text-muted' /> */}
                            <img src="https://img.icons8.com/ios/50/null/cooling.png" alt='cooling' style={{width: '20px', height: '20px'}} />
                            <span style={{fontSize: '14px', fontWeight: 500}}>{vehicle.isAirConditioned === 'yes' ? 'Air Conditioning' : 'No Air Conditioning'}</span>
                        </p>
                        <p className='d-flex align-items-center gap-2 text-muted m-0'>
                            <img src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/null/external-gearbox-transportation-tanah-basah-basic-outline-tanah-basah-2.png" alt='gearbox' style={{width: '20px', height: '20px'}} />
                            <span style={{fontSize: '14px', fontWeight: 500}}>{vehicle.isAuto === 'yes' ? 'Automatic' : 'Manuel'}</span>
                        </p>
                        <p className='d-flex align-items-center gap-2 text-muted m-0'>
                        <img src="https://img.icons8.com/external-vitaliy-gorbachev-fill-vitaly-gorbachev/60/null/external-fuel-ecology-vitaliy-gorbachev-fill-vitaly-gorbachev.png" alt="fuel" style={{width: '20px', height: '20px'}} />
                            <span style={{fontSize: '14px', fontWeight: 500}}>{vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1)}</span>
                        </p>
                    </div>
                    <p className='bg-info text-white mt-4 mb-4 rounded d-flex align-items-center gap-2' style={{fontSize: '12px', fontWeight: 500, padding: '4px 10px', letterSpacing: '1px'}} ><MdInfo fontSize={20} /> {vehicle.paymentType === 'half' ? 'HALF PAYMENT' : 'FULL PAYMENT'}</p>
                    <div className='w-100 d-flex align-items-center justify-content-between'>
                        <p className='d-flex align-items-center gap-2 m-0'>
                            <FaCarSide fontSize={18} />
                            <Badge bg='dark'>{vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</Badge>
                        </p>
                        {isRentalBtnVisible && (<button className='btn btn-primary rounded mx-5 d-flex align-items-center justify-content-center gap-2' style={{fontWeight: 500, width: '200px', fontSize: '18px'}} onClick={() => handleModelState(vehicle)} >Rent Now <MdDoubleArrow fontSize={25} /></button>)}   
                    </div>
                    
                </div>
            </div>

            <hr></hr>

            <div className='d-flex  justify-content-between' style={{height: 'max-content'}}>

                <div style={{flex: 1}}>
                    <div className='d-flex align-items-center gap-3 mb-3' title='This is it'>
                        <FaGasPump fontSize={28} />
                        <p className='d-flex flex-column align-items-start m-0'>
                            <span style={{fontSize: '14px', fontWeight: 700}}>Fuel Policy</span>
                            <span style={{fontSize: '16px'}}>{vehicle.fuelPolicy === 'full-to-full' ? 'Full to Full' : vehicle.fuelPolicy === 'full-to-empty' ? 'Full to Empty' : 'Same to Same'}</span>
                        </p>
                    </div>
                    <div className='d-flex align-items-center gap-3'>
                        <FaMapMarkerAlt fontSize={28} />
                        <p className='d-flex flex-column align-items-start m-0'>
                            <span style={{fontSize: '14px', fontWeight: 700}}>Pick Up Policy</span>
                            <span style={{fontSize: '16px'}}>
                                {vehicle.pickupPolicy === 'delivery' ? 'Delivery Only' : vehicle.pickupPolicy === 'on-hotel-premise' ? 'No Delivery, On Hotel Premise Only' : 'Both Delivery And Hotel Premise'}
                            </span>
                        </p>
                    </div>
                </div>

                <div style={{flex: 1, height: '100%'}}>
                    <ul>
                        {vehicle.additionalFeatures.length > 0 ? (
                            vehicle.additionalFeatures.map(f => (
                                <li key={f} className='d-flex align-items-center gap-2 mb-1'>
                                    <FaCheck className='text-success' fontSize={12} />
                                    <small style={{fontSize: '13px'}}>{f}</small>
                                </li>
                            ))
                        ) : (
                            <p>No additional features</p>
                        )}
                    </ul>
                </div>

                <div style={{flex: 1}}>
                    <p className={`mb-3 d-flex align-items-center justify-content-start gap-3 m-0 px-2 py-1 border rounded ${vehicle.isDriverFree === 'yes' ? 'text-success' : 'text-danger'} ${vehicle.isDriverFree === 'yes' ? 'border-success' : 'border-danger'}`} style={{fontWeight: 500}} >{vehicle.isDriverFree === 'yes' ? (<><MdCheckCircle className='text-success' fontSize={22} /> Free Driver</>) : (<><MdCancel className='text-danger' fontSize={22} />No Free Driver</>)}</p>
                            
                    <div className='mb-3'>
                        <small style={{fontSize: '12px', fontWeight: 500}} className='text-muted'>Overdue cost (per hour)</small>
                        <p className='m-0 text-muted'>USD ${vehicle.overduePrice}</p>
                    </div>

                    <div>
                        <small style={{fontSize: '14px', fontWeight: 500}} className='text-dark'>Rental cost (per hour)</small>
                        {vehicle.discount > 0 ? (
                            <p className='m-0 text-dark d-flex align-items-center gap-3' style={{fontSize: '20px'}}>USD ${calculatePriceWithDiscount(vehicle.price, vehicle.discount)} <span style={{textDecoration: 'line-through', marginLeft: '10px'}} className='text-muted'>${vehicle.price}</span> <span style={{fontSize: '12px', fontWeight: 500}} className='text-muted'>with {vehicle.discount}% Discount</span></p>
                        ) : (
                            <p className='m-0 text-dark' style={{fontSize: '20px'}}>USD ${vehicle.price}</p>
                        )}
                        
                    </div>
                
                </div>
            </div>
        </div>
    );
}

export default VehicleCard;