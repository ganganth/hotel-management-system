import {useState, useEffect, useRef} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useFirestorage from '../../hooks/useFirestorage';
import {toast} from 'react-toastify';

import ProgressBar from 'react-bootstrap/ProgressBar';

import {MdAddAPhoto, MdDeleteForever} from 'react-icons/md';

import '../../styles/employee_management/employeeAdd.css';



const EmployeeAdd = () => {

    const avatarInputRef = useRef();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();
    const {isUploading, progress, uploadAvatar} = useFirestorage();
    const isEdit = searchParams.get('edit') === 'true' ? 'true' : null;
    const id = searchParams.get('id') !== null ? searchParams.get('id') : null;

    const [loading, setLoading] = useState(false);

    const [file, setFile] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState(0);
    const [salary, setSalary] = useState(0);
    const [address, setAddress] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Employee');
    const [gender, setGender] = useState('');

    useEffect(() => {
        if(isEdit === 'true' && id) {
            const getEmployee = async () => {
                try {
                    const response = await axiosPrivate.get(`/api/employees/${id}`);
                    const emp = response.data.employee;
                    setFirstName(emp.firstName);
                    setLastName(emp.lastName);
                    setEmail(emp?.email);
                    setPhone(emp?.phone);
                    setAge(emp?.age);
                    setSalary(emp?.salary);
                    setAddress(emp?.address);
                    setStreet(emp?.street);
                    setCity(emp?.city);
                    setGender(emp?.gender);
                    setUsername(emp?.username);
                    setRole(emp?.role);
                    setCurrentAvatar(emp?.avatar);
                } catch (err) {
                    navigate('/dash/admin/employee-management');
                }
            }
            getEmployee();
        }
    }, [isEdit, id, navigate, axiosPrivate]);

    const handleAvatar = e => {
        const selectedFile = e.target.files[0];

        if(selectedFile) {
            const reader = new FileReader();
            reader.onload = function() {
                setFile(selectedFile);
                setAvatar(reader.result);
            }

            reader.readAsDataURL(selectedFile);
        }
    }

    const handleAvatarCancel = () => {
        setFile(null);
        setAvatar(null);
    }

    const handleSubmit = async e => {
        e.preventDefault();

        setLoading(true);

        const emp = {
            username: username.trim(),
            password: password.trim(),
            role: role.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            age: +age,
            salary: +salary,
            address: address.trim(),
            street: street.trim(),
            city: city.trim(),
            gender
        }

        if(
            !emp.username || 
            (!isEdit && !emp.password) || 
            (!isEdit && !confirmPassword.trim()) || 
            !emp.firstName || 
            !emp.lastName || 
            !emp.email || 
            !emp.phone ||
            !emp.address ||
            !emp.street ||
            !emp.city ||
            !emp.gender ||
            age === 0 ||
            salary === 0
        ) {
            // all fields are requried
            toast.error('All fields are required');
            setLoading(false);
            return;
        }

        // password & confirm password check
        if(emp.password !== confirmPassword.trim()) {
            toast.error('Passwords are not match');
            setLoading(false);
            return;
        }

        if(file) {
            const avatarUrl = await uploadAvatar("employee", file)
            emp.avatar = avatarUrl;
        } else if(isEdit && isEdit === 'true' && currentAvatar) {
            // keep the current photo
            emp.avatar = currentAvatar;
        }

        try {
            if(isEdit === 'true') {
                // update the employee
                await axiosPrivate.put('/api/employees', JSON.stringify({...emp, id}));
                toast.success('Employee Updated');

                setLoading(false);
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setAge(0);
                setSalary(0);
                setAddress('');
                setStreet('');
                setCity('');
                setGender('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setFile(null);
                setAvatar(null);
                navigate('/dash/admin/employee-management');

            } else {
                // create new employee
                await axiosPrivate.post('/api/employees', JSON.stringify(emp));
                toast.success('Employee Added');

                setLoading(false);
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setAge(0);
                setSalary(0);
                setAddress('');
                setStreet('');
                setCity('');
                setGender('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setFile(null);
                setAvatar(null);
            }
            
        } catch (err) {
            toast.error(err.response.data?.message);
            setLoading(false);
        }

        // if(isEdit === 'true') {
        //     try {
        //         await axiosPrivate.put(`/api/users/employee/${id}`, JSON.stringify(emp), {
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             }
        //         })
        //         toast.success('Employee Updated');
        //         setFirstName('');
        //         setLastName('');
        //         setEmail('');
        //         setPhone('');
        //         setAge(0);
        //         setSalary(0);
        //         setAddress('');
        //         setUsername('');
        //         setPassword('');
        //         setConfirmPassword('');
        //         navigate('/dash/admin/employee-management');
        //     } catch (err) {
        //         toast.error(err.response.data.message);
        //     }
        // } else {
        //     // validation success, create new employee
        //     try {
        //         await axiosPrivate.post('/api/users/employee', JSON.stringify(emp) , {
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             }
        //         });
        //         toast.success('Employee Added');
        //         setFirstName('');
        //         setLastName('');
        //         setEmail('');
        //         setPhone('');
        //         setAge(0);
        //         setSalary(0);
        //         setAddress('');
        //         setUsername('');
        //         setPassword('');
        //         setConfirmPassword('');
        //     } catch (err) {
        //         console.log(err);
        //         toast.error('Cannot add employee, try again');
        //     }
        // }

    }

    // const testUpload = () => {
    //     uploadAvatar("dummy", file)
    //         .then(url => console.log(url))
    //         .catch(err => console.log(err))
    // }
   
    return (
        <div className='employeeAdd'>

            <aside className='employeeAdd-header'>
                <h1>{isEdit === 'true' ? 'Update Employee' : 'Add New Employee'}</h1>  
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            </aside>
            <hr></hr>

            {/* <button onClick={() => testUpload()}>Upload</button> */}

            <form className='employeeAdd-form' onSubmit={handleSubmit}>

                <div className='employeeAdd-form-avatar'>
                    <label className='mb-3'>Upload Profile Photo</label>
                    <div>
                        <div className='employeeAdd-form-avatar-upload-btn'>
                            <input type='file' accept='image/jpeg' ref={avatarInputRef} onChange={handleAvatar} />
                            <button type='button' onClick={() => avatarInputRef.current.click()}><MdAddAPhoto /></button>
                            {file && (<button type='button' onClick={() => handleAvatarCancel()}><MdDeleteForever /></button>)}
                        </div>
                        <div className='employeeAdd-form-avatar-preview'>
                            {avatar && <img src={avatar} alt='avatar' />}
                        </div>
                        {isEdit && currentAvatar && (
                            <div className='employeeAdd-form-avatar-preview'>
                                <small>Current Avatar</small>
                                <img src={currentAvatar} alt='avatar' />
                            </div>
                        )}
                    </div>
                    {isUploading && (<ProgressBar now={progress} />)}
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

                <div className='form-group-wrapper'>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Age</label>
                        <input type='number' step='1' min='1' value={age} onChange={e => setAge(e.target.value)} />
                    </div>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Salary</label>
                        <input type='number' step='.01' min='1' value={salary} onChange={e => setSalary(e.target.value)} />
                    </div>
                </div>

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
                        <label>{isEdit === 'true' ? 'New Password' : 'Password'} {isEdit === 'true' && (<small className='text-bold text-dark'>(For security reasons we are not showing current password)</small>)}</label>
                        <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className='form-group form-group-wrapper-item'>
                        <label>{isEdit === 'true' ? 'Confirm New Password' : 'Confirm Password'}</label>
                        <input type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                </div>   

                 <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Employee Role</label>
                        <select value={role} onChange={e => setRole(e.target.value)}>
                            <option value="Employee">Employee</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>
              
                <button type='submit' className='btn btn-dark' disabled={loading}>{isEdit === 'true' && !loading ? 'Update Employee' : loading ? 'progress...' : 'Add Employee'}</button>
            </form>
        </div>
    );
}

export default EmployeeAdd;