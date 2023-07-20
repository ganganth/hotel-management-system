import {useState, useEffect, useRef} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useFirestorage from '../../hooks/useFirestorage';

import {toast} from 'react-toastify';

import {MdEmail, MdPhone, MdLocationOn, MdAddAPhoto, MdDeleteForever} from 'react-icons/md';
import {FaMale, FaFemale, FaCalendarAlt, FaMoneyCheckAlt} from 'react-icons/fa';

import '../../styles/profile.css';

const Profile = () => {

    const avatarInputRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    const {uploadAvatar} = useFirestorage();

    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);

    const [file, setFile] = useState(null);
    const [avatar, setAvatar] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState(0);
    const [address, setAddress] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axiosPrivate.get('/api/profile');
                const p = response.data.profile;
                setProfile(p);
                setFirstName(p.firstName);
                setLastName(p.lastName);
                setEmail(p.email);
                setPhone(p.phone);
                setAge(p.age);
                setAddress(p.address);
                setStreet(p.street);
                setCity(p.city);
                setGender(p.gender);
                setUsername(p.username);
            } catch (err) {
                console.log(err);
                toast.error(err.response.data?.message);
            }
        }
        getProfile();
    }, [axiosPrivate]);


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

    const handleProfileUpdate = async () => {
        setLoading(true);
        const pro = {
            username: username.trim(),
            password: password.trim(),
            role: profile.role,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            age: +age,
            address: address.trim(),
            street: street.trim(),
            city: city.trim(),
            gender,
            avatar: profile.avatar
        }

        if(
            !pro.username || 
            !pro.firstName || 
            !pro.lastName || 
            !pro.email || 
            !pro.phone ||
            !pro.address ||
            !pro.street ||
            !pro.city ||
            !pro.gender ||
            (profile.role !== 'Customer' && pro.age <= 0)
        ) {
            // all fields are requried
            toast.error('All fields are required');
            setLoading(false);
            return;
        }

        // password & confirm password check
        if(pro.password !== confirmPassword.trim()) {
            toast.error('Passwords are not match');
            setLoading(false);
            return;
        }

        if(file) {
            pro.avatar = await uploadAvatar(profile.role.toLowerCase(), file);
        }

        try {
            const response = await axiosPrivate.put('/api/profile', JSON.stringify(pro));
            const p = response.data.profile;
            setProfile(p);
            setFirstName(p.firstName);
            setLastName(p.lastName);
            setEmail(p.email);
            setPhone(p.phone);
            setAge(p.age);
            setAddress(p.address);
            setStreet(p.street);
            setCity(p.city);
            setGender(p.gender);
            setUsername(p.username);
            setPassword('');
            setConfirmPassword('');
            setFile(null);
            setAvatar(null);
            toast.success('Profile Updated');
            setLoading(false);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data?.message);
            setLoading(false);
        }

    }

    return (
        <div className='profilePage'>

            <div className='profilePage-left'>

                <h1>Update Profile Information</h1>
                <hr></hr>

                <div className='profilePage-left-avatar'>
                    <div>
                        {!avatar && !file && <span>Update Avatar</span>}
                        {file && avatar && <img src={avatar} alt='avatar' />}
                    </div>
                    <p>
                        <input type='file' accept='image/jpeg' ref={avatarInputRef} onChange={handleAvatarSelect} />
                        <button title='add avatar' onClick={() => avatarInputRef.current?.click()}><MdAddAPhoto /></button>
                        {file && avatar && <button title='remove avatar' onClick={handleAvatarRemove}><MdDeleteForever /></button>}
                    </p>
                </div>
                
                <div className='form-group-wrapper'>
                    <div className='form-group form-group-wrapper-item'>
                        <label>First Name</label>
                        <input type='text' value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Last Name</label>
                        <input type='text' value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Email</label>
                        <input type='email' value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Phone No.</label>
                        <input type='text' value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                </div>

                {profile && profile.role !== 'Customer' && (
                    <div className='form-group-wrapper'>
                        <div className='form-group'>
                            <label>Age</label>
                            <input type='number' step='1' min='1' value={age} onChange={e => setAge(e.target.value)} />
                        </div>
                    </div>
                )}
                

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Address</label>
                        <input type='text' value={address} onChange={e => setAddress(e.target.value)} />
                    </div>
                </div>   

                <div className='form-group-wrapper'>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Street</label>
                        <input type='text' value={street} onChange={e => setStreet(e.target.value)} />
                    </div>
                    <div className='form-group form-group-wrapper-item'>
                        <label>City</label>
                        <input type='text' value={city} onChange={e => setCity(e.target.value)} />
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Gender</label>
                        <div className='d-flex align-items-center gap-5'>
                            <div className='d-flex align-items-center gap-2'>
                                <input type='radio' name='gender' value='male' checked={gender === 'male'}  onChange={e => setGender(e.target.value)} />
                                <label>Male</label>
                            </div>
                            <div className='d-flex align-items-center gap-2'>
                                <input type='radio' name='gender' value='female' checked={gender === 'female'}  onChange={e => setGender(e.target.value)} />
                                <label>Female</label>
                            </div>
                        </div>
                    </div>
                </div> 

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Username</label>
                        <input type='text' value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group form-group-wrapper-item'>
                        <label>New Password</label>
                        <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Confirm New Password</label>
                        <input type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                </div>  

                <div>
                    <button className='btn btn-dark px-5 py-2' onClick={handleProfileUpdate}>{loading ? 'Progress...' : 'Update Profile'}</button>
                </div>

            </div>

            {profile.id && (

                <div className='profilePage-right'>

                    <div className='profilePage-right-avatar'>
                        <img src={profile.avatar} alt={profile.username} />
                    </div>

                    <span>#{profile.username}</span>

                    <h1>{profile.firstName} {profile.lastName}</h1>

                    <p>{profile.role}</p>

                    <ul>
                        <li>
                            <MdEmail />
                            <span>{profile.email}</span>
                        </li>
                        <li>
                            <MdPhone />
                            <span>{profile.phone}</span>
                        </li>
                        <li>
                            <MdLocationOn />
                            <span>{profile.address}, {profile.street}, {profile.city}</span>
                        </li>
                        <li>
                            {profile.gender === 'male' ? (<FaMale />) : (<FaFemale />)}
                            <span>{profile.gender === 'male' ? 'Male' : 'Female'}</span>
                        </li>
                        {(profile.role === 'Employee' || profile.role === 'Admin') && (
                            <>
                                <li>
                                    <FaCalendarAlt />
                                    <span>{profile.age} years old</span>
                                </li>
                                <li>
                                    <FaMoneyCheckAlt />
                                    <span>LKR {profile.salary.toFixed(2)}</span>
                                </li>
                            </>
                        )}
                        
                    </ul>

                </div>

            )}

        </div>
    );
}

export default Profile;