import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useFirestorage from '../../hooks/useFirestorage';

import {Spinner} from 'react-bootstrap'
import {toast} from 'react-toastify';
import {MdModeEditOutline, MdDeleteForever, MdOutlineAddCircleOutline, MdDeleteSweep, MdAddCircle} from 'react-icons/md';

const VehicleAdd = () => {

    const maxNumber = 4;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();
    const {isUploading, uploadVehicleImages} = useFirestorage();

    const [isEditLoading, setIsEditLoading] = useState(searchParams.get('edit') === 'true' ? true : false);
    
    const [processing, setProcessing] = useState(false);

    const [images, setImages] = useState([]);

    const [name, setName] = useState('');
    const [type, setType] = useState('car');
    const [condition, setCondition] = useState('normal');
    const [quantity, setVehicleQuantity] =useState(1);

    const [commonFeatures, setCommonFeatrues] = useState({
        seats: 1,
        bags: 0,
        doors: 0,
        isAirConditioned: 'yes',
        isAuto: 'yes',
        fuelType: 'gasoline',
        isDriverFree: 'yes'

    });

    const [additionalFeatures, setAdditionalFeatures] = useState([]);

    const [policies, setPolicies] = useState({
        fuelPolicy: 'full-to-full',
        pickupPolicy: 'delivery'
    });

    const [paymentInfo, setPaymentInfo] = useState({
        price: 1,
        overduePrice: 1,
        paymentType: 'full',
        discount: 0
    });

    // use effect
    useEffect(() => {
        if(searchParams.get('edit') === 'true' && searchParams.get('id')) {
            const getVehicleData = async () => {
                try {
                    const {data: {vehicle}} = await axiosPrivate.get(`/api/vehicles/${searchParams.get('id')}`);
                    console.log(vehicle);
                    setName(vehicle.name);
                    setType(vehicle.type);
                    setCondition(vehicle.vehicleCondition);
                    setCommonFeatrues({
                        seats: +vehicle.seats,
                        bags: +vehicle.bags,
                        doors: +vehicle.doors,
                        isAirConditioned: vehicle.isAirConditioned,
                        isAuto: vehicle.isAuto,
                        fuelType: vehicle.fuelType,
                        isDriverFree: vehicle.isDriverFree
                    });
                    setAdditionalFeatures(vehicle.additionalFeatures);
                    setPolicies({
                        fuelPolicy: vehicle.fuelPolicy,
                        pickupPolicy: vehicle.pickupPolicy
                    });
                    setPaymentInfo({
                        price: +vehicle.price,
                        overduePrice: +vehicle.overduePrice,
                        paymentType: vehicle.paymentType,
                        discount: +vehicle.discount
                    });
                    setIsEditLoading(false);
                    setVehicleQuantity(vehicle.quantity);
                    setIsEditLoading(false);
                } catch (err) {
                    setIsEditLoading(false);
                    toast.error(err.response.data?.message || 'Internal server error');
                    navigate(-1);
                }
            }
            getVehicleData();
        }
    }, [searchParams, axiosPrivate, navigate])

    const handleAdditionalFeatures = e => {
        if(e.target.checked) {
            // add feature to the array
            setAdditionalFeatures(prev => ([...prev, e.target.value]));
        } else {
            // remove it from the array
            setAdditionalFeatures(prev => (prev.filter(item => item !== e.target.value)));
        }
    }

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        setImages(imageList);
    };

    const handleSubmit = async () => {
        if(name.trim() === '') return toast.error('Vehicle name is requried');

        if((!searchParams.get('edit') || searchParams.get('edit') !== 'true') && images.length !== 4) return toast.error('4 images required');

        setProcessing(true);

        const data = {
            name: name.trim(),
            type,
            condition,
            commonFeatures,
            additionalFeatures,
            policies,
            paymentInfo,
            quantity
        }

        if(searchParams.get('edit') === 'true') {
            // UPDATE VEHICLE
            try {
                await axiosPrivate.put('/api/vehicles', JSON.stringify({...data, vehicleId: searchParams.get('id')}));
                setProcessing(false);
                toast.success('Vehicle details updated');
                navigate('/dash/employee/vehicle-management');
            } catch (err) {
                setProcessing(false);
                toast.error(err.response.data?.message || 'vehicle details update failed');
            }

        } else {
            // ADD NEW VEHICLE
            try {
                const response = await axiosPrivate.post('/api/vehicles', JSON.stringify(data));
                // upload images to firebase storage
                const imagesData = await uploadVehicleImages(images, response.data.id);
                
                await axiosPrivate.put('/api/vehicles/images', JSON.stringify({images: imagesData, id: response.data.id}));
                setProcessing(false);
                toast.success('Vehicle added successfully');
                navigate('/dash/employee/vehicle-management');
            } catch (err) {
                setProcessing(false);
                toast.error(err.response.data?.message);            
            }
        }

       
    }

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between">
                <h1>{searchParams.get('edit') === 'true' ? 'Update Vehicle' : 'Add New Vehicle'}</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            </div>
            <hr></hr>

            {/* FORM */}

            {isEditLoading ? (
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
                <>
                    <div className='form-group mb-4'>
                        <label className='form-label' htmlFor='name'>Vehicle Name</label>
                        <input type='text' id='name' className='form-control' value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className='form-group mb-4'>
                        <label className='form-label' htmlFor='type'>Vehicle Type</label>
                        <select id='type' value={type} onChange={e => setType(e.target.value)} >
                            <option value='car'>Car</option>
                            <option value='van'>Van</option>
                            <option value='three-wheel'>Three Wheeler</option>
                            <option value='bicycle'>Bicycle</option>
                            <option value='motorbike'>Motorbike</option>
                        </select>
                    </div>

                    <div className='form-group mb-4'>
                        <label className='form-label' htmlFor='condition'>Vehicle Condition</label>
                        <select id='condition' value={condition} onChange={e => setCondition(e.target.value)} >
                            <option value='normal'>Normal</option>
                            <option value='semi-luxary'>Semi Luxary</option>
                            <option value='luxary'>Luxary</option>
                        </select>
                    </div>

                    {/* IMAGE UPLOAD */}
                    {!searchParams.get('edit') && (
                        <div className='roomAdd-images-wrapper'>
                            <p className='mb-4 roomAdd-images-label'>Vehicle Images <small>(Maximum 4 images are allowed ,only jpeg format allowed)</small></p>

                            <ImageUploading
                                multiple
                                value={images}
                                onChange={onChange}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                                acceptType={["jpg"]}
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                    errors
                                    }) => (
                                    // write your building UI
                                    <>
                                    
                                    <div className="d-flex align-items-center border p-3" style={{height: '430px'}}>

                                        <div className="roomAdd-images-left">
                                            <button
                                                type='button'
                                                style={isDragging ? { color: "red" } : null}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                            >
                                                <MdOutlineAddCircleOutline />
                                                <span>Click or Drag Images</span>
                                            </button>
                                            <button type='button' onClick={onImageRemoveAll}><MdDeleteSweep /> <span>Remove All</span></button>
                                        </div>

                                        <div className="roomAdd-images-right">
                                            {imageList.map((image, index) => (
                                                <div key={index} className="image-item">
                                                    <img src={image.data_url} alt="" width="100%" height="100%" />
                                                    <div className="image-item__btn-wrapper">
                                                        <button type='button' onClick={() => onImageUpdate(index)}><MdModeEditOutline /></button>
                                                        <button type='button' onClick={() => onImageRemove(index)}><MdDeleteForever /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>    

                                    </div>
                                    {errors && errors.maxNumber && <span className='text-danger mt-2 roomAdd-images-error'>Only 4 jpeg images are allowed</span>}
                                    </>           
                                )}
                            </ImageUploading>
                        </div>
                    )}
                    

                    <div className='p-3 border mb-4'>

                        <h5 className='mb-3'>Common Features</h5>

                        <div className='d-flex align-items-center gap-5 w-100 mb-4'>
                            <div className='form-group'>
                                <label className='form-label' htmlFor='seats'>Num. of seats</label>
                                <input type='number' min='1' step='.00' id='seats' className='form-control' value={commonFeatures.seats.toString()} onChange={e => setCommonFeatrues(prev => ({...prev, seats: +e.target.value}))} />
                            </div>
                            <div className='form-group'>
                                <label className='form-label' htmlFor='bags'>Num. of bags</label>
                                <input type='number' min='0' step='.00' id='bags' className='form-control' value={commonFeatures.bags.toString()} onChange={e => setCommonFeatrues(prev => ({...prev, bags: +e.target.value}))} />
                            </div>
                            <div className='form-group'>
                                <label className='form-label' htmlFor='doors'>Num. of doors</label>
                                <input type='number' min='0' step='.00' id='doors' className='form-control' value={commonFeatures.doors.toString()} onChange={e => setCommonFeatrues(prev => ({...prev, doors: +e.target.value}))} />
                            </div>
                        </div>

                        <div className='d-flex align-items-center gap-5 w-100 mb-4'>
                            <div className='form-group'>
                                <label className='form-label' htmlFor='air-condition-type'>Air-Condition Type</label>
                                <select id='air-condition-type' value={commonFeatures.isAirConditioned} onChange={e => setCommonFeatrues(prev => ({...prev, isAirConditioned: e.target.value}))}>
                                    <option value='yes'>Air Conditioned</option>
                                    <option value='no'>Non Air Conditioned</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label className='form-label' htmlFor='gear-type'>Gear Type</label>
                                <select id='gear-type' value={commonFeatures.isAuto} onChange={e => setCommonFeatrues(prev => ({...prev, isAuto: e.target.value}))} >
                                    <option value='yes'>Auto</option>
                                    <option value='no'>Manuel</option>
                                </select>
                            </div>
                        </div>

                        <div className='d-flex align-items-center gap-5 w-100'>
                            <div className='form-group'>
                                <label className='form-label' htmlFor='fuel-type'>Fuel Type</label>
                                <select id='fuel-type' value={commonFeatures.fuelType} onChange={e => setCommonFeatrues(prev => ({...prev, fuelType: e.target.value}))} >
                                    <option value='gasoline'>Gasoline (Petrol)</option>
                                    <option value='diesel'>Diesel</option>
                                    <option value='bio-diesel'>Bio Diesel</option>
                                    <option value='ethanol'>Ethanol</option>
                                    <option value='none'>None</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label className='form-label' htmlFor='driver-status'>Driver Status</label>
                                <select id='driver-status' value={commonFeatures.isDriverFree} onChange={e => setCommonFeatrues(prev => ({...prev, isDriverFree: e.target.value}))}>
                                    <option value='yes'>Free Driver</option>
                                    <option value='no'>No Free Driver</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <div className='p-3 border mb-4'>

                        <h5 className='mb-3'>Additional Features</h5>

                        <ul className='list-unstyled w-100 px-4'>
                            <li className='d-flex align-items-center gap-3 mb-2'>
                                <input type='checkbox' value="Unlimited mileage" checked={additionalFeatures.indexOf("Unlimited mileage") >= 0} onChange={handleAdditionalFeatures} />
                                <small>Unlimited mileage</small>
                            </li>
                            <li className='d-flex align-items-center gap-3 mb-2'>
                                <input type='checkbox' value="Theft Protection" checked={additionalFeatures.indexOf("Theft Protection") >= 0} onChange={handleAdditionalFeatures} />
                                <small>Theft Protection</small>
                            </li>
                            <li className='d-flex align-items-center gap-3 mb-2'>
                                <input type='checkbox' value="Roadside Assistance" checked={additionalFeatures.indexOf("Roadside Assistance") >= 0} onChange={handleAdditionalFeatures} />
                                <small>Roadside Assistance</small>
                            </li>
                            <li className='d-flex align-items-center gap-3 mb-2'>
                                <input type='checkbox' value="Discounts" checked={additionalFeatures.indexOf("Discounts") >= 0} onChange={handleAdditionalFeatures} />
                                <small>Discounts</small>
                            </li>
                            <li className='d-flex align-items-center gap-3 mb-2'>
                                <input type='checkbox' value="Vehicle registration fee" checked={additionalFeatures.indexOf("Vehicle registration fee") >= 0} onChange={handleAdditionalFeatures} />
                                <small>Vehicle registration fee</small>
                            </li>
                            <li className='d-flex align-items-center gap-3'>
                                <input type='checkbox' value="VAT (value added tax)" checked={additionalFeatures.indexOf("VAT (value added tax)") >= 0} onChange={handleAdditionalFeatures} />
                                <small>VAT (value added tax)</small>
                            </li>
                        </ul>

                    </div>

                    <div className='p-3 border mb-4'>

                        <h5 className='mb-3'>Policies</h5>

                        <div className='d-flex align-items-center gap-5 w-100'>
                            <div className='form-group'>
                                <label className='form-label' htmlFor='fuel-policy'>Fuel Policy</label>
                                <select id='fuel-policy' value={policies.fuelPolicy} onChange={e => setPolicies(prev => ({...prev, fuelPolicy: e.target.value}))}>
                                    <option value='full-to-full'>Full to full</option>
                                    <option value='full-to-empty'>Full to empty</option>
                                    <option value='same-to-same'>Same to same</option>
                                    <option value='none'>None</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label className='form-label' htmlFor='pickup-policy'>Pick Up Policy</label>
                                <select id='pickup-policy' value={policies.pickupPolicy} onChange={e => setPolicies(prev => ({...prev, pickupPolicy: e.target.value}))} >
                                    <option value='delivery'>Delivery Only</option>
                                    <option value='on-hotel-premise'>On Hotel Premise Only</option>
                                    <option value='both'>Both</option>
                                    <option value='none'>None</option>
                                </select>
                            </div>
                        </div>

                        

                    </div>

                    <div className='form-group mb-4'>
                            <label className='form-label' htmlFor='quantity'>Vehicle Quantity</label>
                           <input type='number' min='1' step='1' id='quantity' className='form-control' value={quantity.toString()} onChange={e => setVehicleQuantity(+e.target.value)} />
                    </div>

                    <div className='p-3 border mb-4'>

                        <h5 className='mb-3'>Payment Information</h5>

                        <div className='form-group mb-4'>
                            <label className='form-label' htmlFor='price'>Price for Vehcile (per hour USD)</label>
                            <input type='number' id='price' min='1' step='.01' className='form-control' value={paymentInfo.price.toString()} onChange={e => setPaymentInfo(prev => ({...prev, price: +e.target.value}))} />
                        </div>

                        <div className='form-group mb-4'>
                            <label className='form-label' htmlFor='overdue-price'>Overdue Price (per additional hour USD)</label>
                            <input type='number' id='overdue-price' min='1' step='.01' className='form-control' value={paymentInfo.overduePrice.toString()} onChange={e => setPaymentInfo(prev => ({...prev, overduePrice: +e.target.value}))} />
                        </div>

                        <div className='d-flex align-items-center gap-5 w-100'>
                            <div className='form-group'>
                                <label className='form-label' htmlFor='payment-type'>Payment Type</label>
                                <select id='payment-type' value={paymentInfo.paymentType} onChange={e => setPaymentInfo(prev => ({...prev, paymentType: e.target.value}))} >
                                    <option value='full'>Full Payment</option>
                                    <option value='half'>Half Payment</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label className='form-label' htmlFor='discount'>Discount (as a percentage)</label>
                                <input type='number' id='discount' min='0' step='.00' className='form-control' value={paymentInfo.discount.toString()} onChange={e => setPaymentInfo(prev => ({...prev, discount: +e.target.value}))} />
                            </div>
                        </div>

                    </div>

                    <div className='mb-4'>
                        <button 
                            className='btn btn-dark w-100 d-flex align-items-center justify-content-center gap-3' 
                            onClick={handleSubmit}
                            disabled={processing || isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    uploading images...
                                </>
                            ) : processing ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    processing...
                                </>
                            ) : (
                                <>
                                    {searchParams.get('edit') === 'true' ? (
                                        <>
                                            <MdModeEditOutline /> Update Vehicle
                                        </>
                                    ) : (
                                        <>
                                            <MdAddCircle /> Add Vehicle
                                        </>
                                    )}
                                    
                                </> 
                            )}
                            
                        </button>
                    </div>
                </>
            )}

            

        </div>
    );
}

export default VehicleAdd;