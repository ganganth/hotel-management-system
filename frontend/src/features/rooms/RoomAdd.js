import {useState, useRef, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useFirestorage from '../../hooks/useFirestorage';
import ImageUploading from "react-images-uploading";

import {Table, Form, Button, InputGroup} from 'react-bootstrap';

import {toast} from 'react-toastify';

import {MdModeEditOutline, MdDeleteForever, MdOutlineAddCircleOutline, MdDeleteSweep, MdCancel} from 'react-icons/md';
import '../../styles/room_management/roomAdd.css';

const RoomAdd = () => {

    const maxNumber = 6;

    const roomNoInputRef = useRef();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const {isUploading, uploadRoomImages} = useFirestorage();

    const [loading, setLoading] = useState(false);
    const [specialFeatures, setSpecialFeatures] = useState([]);

    const [images, setImages] = useState([]);

    const [name, setName] = useState('');
    const [bedType, setBedType] = useState('');
    const [regularPrice, setRegularPrice] = useState(0.0);
    const [fullPaymentDiscount, setFullPaymentDiscount] = useState(0);
    const [adult, setAdult] = useState(0);
    const [children, setChildren] = useState(0);
    const [description, setDescription] = useState('');
    const [commonFeatures, setCommonFeatures] = useState({
        view: '',
        bathroomType: '',
        televisionType: '',
        heatingAvailability: '',
        towelAvailability: ''
    });
    const [commonFeaturePrice, setCommonFeaturePrice] = useState(0.0);
    const [selectedSpecialFeatures, setSelectedSpecialFeatures] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const getAllSpecialFeatures = async () => {
            try {
                const response = await axiosPrivate.get('/api/rooms/special-features');
                setSpecialFeatures(response.data.features);
            } catch (err) {
                console.log(err);
                toast.error(err.response.data?.message);
            }
        }
        getAllSpecialFeatures();
    }, [axiosPrivate]);

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        setImages(imageList);
    };

    const handleSelectedSpecialFeatures = e => {
        if(e.target.checked) {
            // update selected special features
            const f = specialFeatures.find(f => f.id === +e.target.value);
            setSelectedSpecialFeatures(prev => ([...prev, f]));
        } else {
            // remove it from the selected list
            setSelectedSpecialFeatures(prev => (prev.filter(n => n.id !== +e.target.value)));
        }
    }

    const handleRoomNoAdd = () => {
        const roomNo = +roomNoInputRef.current?.value || null;
        
        if(roomNo && roomNo > 0) {
            const duplicate = rooms.indexOf(roomNo);
            if(duplicate >= 0) {
                // room no already added
                toast.error('Room No already added');
                return;
            }

            setRooms(prev => ([...prev, roomNo]));
            roomNoInputRef.current.value = '';
        }
    }

    const handleNewRoomCreate = async () => {
        setLoading(true);
        const newRoomType = {
            name: name.trim(),
            bedType: bedType.trim(),
            regularPrice: +regularPrice,
            fullPaymentDiscount: +fullPaymentDiscount,
            adultOccupation: +adult,
            childOccupation: +children,
            description: description.trim(),
            view: commonFeatures.view,
            bathroomType: commonFeatures.bathroomType,
            televisionType: commonFeatures.televisionType,
            heatingAvailability: commonFeatures.heatingAvailability,
            towelAvailability: commonFeatures.towelAvailability,
            commonFeaturePrice: +commonFeaturePrice,
            specialFeatures: selectedSpecialFeatures,
            rooms,
            imageCount: images.length
        }

        if(images.length !== 6) {
            setLoading(false);
            toast.error('6 images are required');
            return;
        }

        if(
            !newRoomType.name ||
            !newRoomType.bedType ||
            newRoomType.regularPrice <= 0 ||
            newRoomType.adultOccupation < 0 ||
            newRoomType.childOccupation < 0 ||
            !newRoomType.description ||
            !newRoomType.view ||
            !newRoomType.bathroomType ||
            !newRoomType.televisionType ||
            !newRoomType.heatingAvailability ||
            !newRoomType.towelAvailability
        ) {
            setLoading(false);
            toast.error('Invalid Input Data');
            return;
        }

        if(rooms.length <= 0) {
            setLoading(false);
            toast.error('At least one room number is required');
            return;
        }

        try {
            const response = await axiosPrivate.post('/api/rooms', JSON.stringify(newRoomType));
            // upload images to firebase storage
            const imageUrls = await uploadRoomImages(images, response.data.id);
            
            await axiosPrivate.put('/api/rooms/images', JSON.stringify({imageUrls, id: response.data.id}));

            toast.success('New Room type created');
            // everything success, reset state
            setImages([]);
            setName('');
            setBedType('');
            setRegularPrice(0);
            setFullPaymentDiscount(0);
            setAdult(0);
            setChildren(0);
            setDescription('');
            setCommonFeatures({
                view: '',
                bathroomType: '',
                televisionType: '',
                heatingAvailability: '',
                towelAvailability: ''
            });
            setCommonFeaturePrice(0);
            setSelectedSpecialFeatures([]);
            setRooms([]);
            setLoading(false);

        } catch (err) {
            setLoading(false);
            console.log(err);
            toast.error(err.response.data?.message);
        }
    }

    return (
        <div>

            <aside className='employeeList-header'>
                <h1>Add New Room Type</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            </aside>

            <hr></hr>

            <div className='roomAdd-content'>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Room Type</label>
                        <input type='text' value={name} onChange={e => setName(e.target.value)} />
                    </div>
                </div>  

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Bed Type</label>
                        <input type='text' value={bedType} onChange={e => setBedType(e.target.value)} />
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Regular Price $ (per one night)</label>
                        <input type='number' step='.01' min='1' value={regularPrice} onChange={e => setRegularPrice(e.target.value)} />
                    </div>  
                </div> 

                <div className='form-group-wrapper'>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Full Payment Discount (as a percentage)</label>
                        <input type='number' step='.01' min='0' value={fullPaymentDiscount} onChange={e => setFullPaymentDiscount(e.target.value)} />
                    </div>  
                </div> 

                <div className='roomAdd-images-wrapper'>
                    <p className='mb-4 roomAdd-images-label'>Room Images <small>(Maximum 6 images are allowed ,only jpeg format allowed)</small></p>

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
                            
                            <div className="roomAdd-images-container">

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
                            {errors && errors.maxNumber && <span className='text-danger mt-2 roomAdd-images-error'>Only 6 jpeg images are allowed</span>}
                            </>           
                        )}
                    </ImageUploading>
                    
                </div>  

                <div>
                    <label className='mb-3'>Occupation Details</label>
                    <div className='form-group-wrapper'>
                        <div className='form-group form-group-wrapper-item'>
                            <label>Adults Occupation</label>
                            <input type='number' step='1' min='0' value={adult} onChange={e => setAdult(e.target.value)} />
                        </div>
                        <div className='form-group form-group-wrapper-item'>
                            <label>Children Occupation</label>
                            <input type='number' step='1' min='0' value={children} onChange={e => setChildren(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Room Description</label>
                        <textarea className='p-4' rows={8} value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </div>

                <div className='mb-4'>
                    <label className='mb-3'>Room Features Details</label>
                    <div className='roomAdd-content-features'>

                        <div className='roomAdd-content-features-left'>

                            <label className='mb-3 text-secondary'>Common Features</label>

                            <div className='roomAdd-content-features-left-select'>
                                <p>View :</p>
                                <select value={commonFeatures.view} onChange={e => setCommonFeatures(prev => ({...prev, view: e.target.value}))}>
                                    <option value=''>--select view type--</option>
                                    <option value='sea'>Sea</option>
                                    <option value='land'>Land</option>
                                </select>
                            </div>  

                            <div className='roomAdd-content-features-left-select'>
                                <p>Bathroom Type :</p>
                                <select value={commonFeatures.bathroomType} onChange={e => setCommonFeatures(prev => ({...prev, bathroomType: e.target.value}))}>
                                    <option value=''>--select bathroom type--</option>
                                    <option value='attached'>Attached</option>
                                    <option value='non-attached'>Non Attached</option>
                                </select>
                            </div>  
                                          
                            <div className='roomAdd-content-features-left-select'>
                                <p>Television Type :</p>
                                <select value={commonFeatures.televisionType} onChange={e => setCommonFeatures(prev => ({...prev, televisionType: e.target.value}))}>
                                    <option value=''>--select television type--</option>
                                    <option value='cable'>Cable</option>
                                    <option value='satellite'>Satellite</option>
                                </select>
                            </div>   

                            <div className='roomAdd-content-features-left-select'>
                                <p>Heating Availability :</p>
                                <select value={commonFeatures.heatingAvailability} onChange={e => setCommonFeatures(prev => ({...prev, heatingAvailability: e.target.value}))}>
                                    <option value=''>--select heating availability--</option>
                                    <option value='available'>Available</option>
                                    <option value='unavailable'>Unavailable</option>
                                </select>
                            </div>

                            <div className='roomAdd-content-features-left-select'>
                                <p>Linen & Towel Availability :</p>
                                <select value={commonFeatures.towelAvailability} onChange={e => setCommonFeatures(prev => ({...prev, towelAvailability: e.target.value}))}>
                                    <option value=''>--select linen & towel availability--</option>
                                    <option value='available'>Available</option>
                                    <option value='unavailable'>Unavailable</option>
                                </select>
                            </div>

                            <div className='form-group-wrapper'>
                                <div className='form-group form-group-wrapper-item'>
                                    <label>Common Features Price $ (per one night)</label>
                                    <input type='number' step='.01' min='1' value={commonFeaturePrice} onChange={e => setCommonFeaturePrice(e.target.value)} />
                                </div>  
                            </div>                

                        </div>

                        <div className='roomAdd-content-features-right'>

                            <label className='mb-3 text-secondary'>Special Features</label>

                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Select Feature</th>
                                        <th>Feature</th>
                                        <th>Price (per night)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {specialFeatures.map(f => (
                                        <tr key={f.id}>
                                            <td>
                                                <input type='checkbox' value={f.id} onChange={handleSelectedSpecialFeatures} />
                                            </td>
                                            <td>{f.name}</td>
                                            <td>$ {f.price.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>

                <div className='mb-4'>
                    <label className='mb-3'>Room Number Details</label>

                    {rooms.length === 0 && (<p>No room numbers added yet</p>)}
                    {rooms.length > 0 && (
                        <div className='roomAdd-roomno-tag-container'>
                            {rooms.map(no => (
                                <span key={no} className='roomAdd-roomno-tag'>
                                    {no}
                                    <button onClick={() => setRooms(prev => (prev.filter(n => n !== no)))}><MdCancel /></button>
                                </span>
                            ))}
                        </div>
                    )}
                    
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Room No"
                            aria-label="Room No"
                            aria-describedby="basic-addon2"
                            type='number'
                            min='0'
                            step='.00'
                            ref={roomNoInputRef}
                        />
                        <Button variant="outline-primary" id="button-addon2" onClick={handleRoomNoAdd}>
                            Add Room
                        </Button>
                    </InputGroup>
                </div>

                <div>
                    <button className='btn btn-dark' onClick={handleNewRoomCreate}>{loading && !isUploading ? 'Progress...' : loading && isUploading ? 'Images uploading...' : 'Create New Room'}</button>
                </div>

            </div>

        </div>
    );
}

export default RoomAdd;