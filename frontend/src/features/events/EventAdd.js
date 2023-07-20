import {useState} from 'react';

import { useNavigate } from "react-router-dom";
import ImageUploading from "react-images-uploading";
import { MdDeleteForever, MdDeleteSweep, MdModeEditOutline, MdOutlineAddCircleOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../config/firebase';
import {v4 as uuidv4} from 'uuid';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';



const EventAdd = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [images, setImages] = useState([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('common');
    const [price, setPrice] = useState(1);
    const [processing, setProcessing] = useState(false);

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        setImages(imageList);
    };

    const handleEventCreation = async () => {

        if(!name || price <= 0 || images.length < 1) return toast.error('Please add requried data');
        setProcessing(true);
        // upload the image to firebase
        try {
            const imageRef = ref(storage, `/events/${uuidv4()}`);
            const snapshot = await uploadBytes(imageRef, images[0].file);
            const url = await getDownloadURL(snapshot.ref);

            console.log(url);

            // send event data to server
            await axiosPrivate.post('/api/events', JSON.stringify({name, type, image: url, price}));

            toast.success('Event added successfully');
            setName('');
            setType('common');
            setPrice(1);
            setImages([]);
            setProcessing(false);

        } catch (err) {
            console.log(err);
            toast.error(err.response.data?.message || 'Error creating event, please try again');
            setProcessing(false);
        }
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h1>Add New Event</h1>
                <button className="btn btn-primary" onClick={() => navigate(-1)} >Go back</button>
            </div>
            <hr></hr>

            <div className="form-group mb-3">
                <label className="form-label">Event Name</label>
                <input type='text' className="form-control" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="form-group mb-3">
                <label className="form-label">Event Type</label>
                <select className="w-100" value={type} onChange={e => setType(e.target.value)}>
                    <option value="common">Common</option>
                    <option value="special">Special</option>
                </select>
            </div>

            <div className='roomAdd-images-wrapper mb-4'>
                <p className='mb-4 roomAdd-images-label'>Event Image <small>(Image is required)</small></p>

                <ImageUploading
                    multiple={false}
                    value={images}
                    onChange={onChange}
                    maxNumber={1}
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
                                    <div key={index} className="image-item" style={{width: '100%', height: '100%'}}>
                                        <img src={image.data_url} alt="" width="100%" height="100%" />
                                        <div className="image-item__btn-wrapper">
                                            <button type='button' onClick={() => onImageUpdate(index)}><MdModeEditOutline /></button>
                                            <button type='button' onClick={() => onImageRemove(index)}><MdDeleteForever /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>    

                        </div>
                        {errors && errors.maxNumber && <span className='text-danger mt-2 roomAdd-images-error'>Only 1 jpeg images are allowed</span>}
                        </>           
                    )}
                </ImageUploading>
            </div>

            <div className='form-group mb-3'>
                <label className='form-label'>Event Price ($)</label>
                <input type='number' className='form-control' step='.01' min='1' value={price.toString()} onChange={e => setPrice(+e.target.value)} />
            </div>

            <button 
                className='btn btn-dark w-100 mt-2 mb-5 d-flex align-items-center justify-content-center gap-2'
                onClick={handleEventCreation}
                disabled={!name || !type || images.length <= 0 || processing}
            >
                {processing ? 'processing...' : (
                    <>
                        <MdOutlineAddCircleOutline size={20} />
                        Create Event
                    </>
                )}
            </button>

        </>
    );
}

export default EventAdd;