import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {Table} from 'react-bootstrap';
import {MdPersonAdd} from 'react-icons/md';

import {toast} from 'react-toastify';

import '../../styles/employee_management/employeeList.css';

const EmployeeList = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [employees, setEmployees] = useState([]);

    

    useEffect(() => {
        const getAllEmployees = async () => {
            
            try {
                const response = await axiosPrivate.get('/api/employees');
                console.log(response.data);
                setEmployees(response.data.employees);
            } catch(err) {
                console.log(err);
                toast.error(err.response.data?.message);
            }

        }

        getAllEmployees();

    }, [axiosPrivate]);

    const handleEmployeeDelete = async id => {

        const isConfirmed = window.confirm(`Are you sure that you want to remove this employee?`);

        if(isConfirmed) {
            try {
                await axiosPrivate.delete(`/api/employees/${id}`);
                toast.success('Employee removed');
                setEmployees(employees.filter(e => e.id !== id));
            } catch (err) {
                toast.error(err.response.data?.message);
            }
        }
    }

    return (
        <div>

            <aside className='employeeList-header'>
                <h1>Employee Management</h1>
                <button className='btn btn-primary' onClick={() => navigate('/dash/admin/employee-management/add')}>Add Employee <MdPersonAdd /></button>
            </aside>

            <hr></hr>

            
                {employees.length > 0 && (
                    <Table striped bordered hover responsive >
                        <thead>
                            <tr>
                                <th>#Employee ID</th>
                                <th>Username</th>
                                <th>Avatar</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Gender</th>
                                <th>Address</th>
                                <th>Street</th>
                                <th>City</th>
                                <th>Email</th>
                                {/* <th>Phone No.</th> */}
                                <th>Age</th>
                                <th>Salary</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(e => (
                                <tr key={e.id}>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{e.id}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{e.username}</p></td>
                                    <td>
                                        <div className='employeeList-row-avatar'>
                                            <img src={e.avatar} alt={e.username} />
                                        </div>
                                    </td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{e.firstName}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{e.lastName}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{e.gender}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{e.address}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{e.street}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{e.city}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{e.email}</p></td>
                                    {/* <td>{e.phone}</td> */}
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{e.age}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>LKR. {e.salary}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}><span className={`employee-state-tagger ${e.role === 'Admin' ? 'employee-state-tagger-admin' : 'employee-state-tagger-employee'}`}>{e.role}</span></p></td>
                                    <td>
                                        <div className='d-flex align-items-center gap-2'>
                                            <button className='btn btn-sm btn-success' onClick={() => navigate(`/dash/admin/employee-management/add?edit=true&id=${e.id}`)}>Update</button>
                                            <button className='btn btn-sm btn-danger' onClick={() => handleEmployeeDelete(e.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
        </div>
    );
}

export default EmployeeList;