import {useState, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import useFirestorage from '../../hooks/useFirestorage';
import {axiosPublic} from '../../app/axios';

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import {toast} from 'react-toastify';

import {MdAddAPhoto, MdDeleteForever} from 'react-icons/md';

import '../../styles/register.css';

const Register = () => {

    const avatarInputRef = useRef();
    const {uploadAvatar} = useFirestorage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [file, setFile] = useState(null);
    const [avatar, setAvatar] = useState(null);

    // form fields state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [gender, setGender] = useState('');

    const handleAvatarSelect = e => {
        const file = e.target.files[0];

        if(file) {
            // use file reader and convert the file into a data url
            const reader = new FileReader();
            reader.onload = () => {
                setFile(file);
                setAvatar(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    const handleAvatarRemove = () => {
        setFile(null);
        setAvatar(null);
    }

    const handleRegister = async () => {
        setLoading(true);
        const guest = {
            username: username.trim(),
            password: password.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
            street: street.trim(),
            city: city.trim(),
            gender: gender.trim()
        }
        // check for all fields
        if(
            !guest.username ||
            !guest.password ||
            !confirmPassword.trim() ||
            !guest.firstName ||
            !guest.lastName ||
            !guest.email ||
            !guest.phone ||
            !guest.address ||
            !guest.street ||
            !guest.city ||
            !guest.gender
        ) {
            setLoading(false);
            toast.error('All fields are required');
            return;
        }

        // check for password confirmation
        if(guest.password !== confirmPassword.trim()) {
            setLoading(false);
            toast.error('Passwords do not match');
            return;
        }

        if(file) {
            guest.avatar = await uploadAvatar("customer", file);
        }

        try {
            await axiosPublic.post('/api/auth/register', JSON.stringify(guest));
            toast.success('Registered Successfully');
            setLoading(false);
            navigate('/login');
        } catch (err) {
            setLoading(false);
            console.log(err);
            toast.error(err.response.data?.message);
        }
    }

    return (
        <div className="registerPage">
            <div className='registerPage-content-wrapper'>
                <h1 className='registerPage-title'>Register as Customer</h1>
                <hr></hr>
                <div className='registerPage-content'>

                    {/* <span className='registerPage-content-vertical-line'></span> */}

                    <div className='registerPage-content-left'>

                        <div className='registerPage-content-left-avatar'>
                            <div>
                                {!avatar && !file && <span>No Avatar</span>}
                                {file && avatar && <img src={avatar} alt='avatar' />}
                            </div>
                            <p>
                                <input type='file' accept='image/jpeg' ref={avatarInputRef} onChange={handleAvatarSelect} />
                                <button title='add avatar' onClick={() => avatarInputRef.current?.click()}><MdAddAPhoto /></button>
                                {file && avatar && <button title='remove avatar' onClick={handleAvatarRemove}><MdDeleteForever /></button>}
                            </p>
                            
                        </div>

                        <FloatingLabel controlId="username" label="Username" className='mb-4'>
                            <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                        </FloatingLabel>

                        <FloatingLabel controlId="password" label="Password" className='mb-4'>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        </FloatingLabel>

                        <FloatingLabel controlId="confirmPassword" label="Confirm Password" className='mb-4'>
                            <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        </FloatingLabel>

                    </div>

                    <div className='registerPage-content-right'>
                        
                        <div className='d-flex align-items-center gap-2'>
                            <FloatingLabel controlId="First Name" label="First Name" className='mb-4'>
                                <Form.Control type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="Last Name" label="Last Name" className='mb-4'>
                                <Form.Control type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                            </FloatingLabel>
                        </div>

                        <FloatingLabel controlId="Email" label="Email" className='mb-4'>
                                <Form.Control type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        </FloatingLabel>

                        <FloatingLabel controlId="Phone No." label="Phone" className='mb-4'>
                                <Form.Control type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                        </FloatingLabel>

                        <FloatingLabel controlId="Address" label="Address" className='mb-4'>
                                <Form.Control type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
                        </FloatingLabel>

                        <div className='d-flex align-items-center gap-2'>
                            <FloatingLabel controlId="Street" label="Street" className='mb-4'>
                                <Form.Control type="text" placeholder="Street" value={street} onChange={e => setStreet(e.target.value)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="City" label="City" className='mb-4'>
                                <Form.Control type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
                            </FloatingLabel>
                        </div>

                        <div className='px-3 py-2 border rounded'>
                            <label className='mb-2'>Gender</label>
                            <div className='d-flex align-items-center gap-4'>
                                <Form.Check
                                    type='radio'
                                    label='Male'
                                    value='male'
                                    name='gender'
                                    onChange={e => setGender(e.target.value)}
                                />
                                <Form.Check
                                    type='radio'
                                    label='Female'
                                    value='female'
                                    name='gender'
                                    onChange={e => setGender(e.target.value)}
                                />
                            </div>
                        </div>

                    </div>

                </div>
                <hr></hr>
                <div className='mt-2 d-flex align-items-center gap-3'>
                    <button className='btn btn-dark px-5 py-2' disabled={loading} onClick={handleRegister}>{loading ? 'progress...' : 'Register'}</button>
                    <p className='registerPage-btn-para'>already have an account ? <Link to='/login'>Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;