import {useState, useEffect} from 'react';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {Table} from 'react-bootstrap';
import { toast } from 'react-toastify';


const CustomerList = () => {

    const axiosPrivate = useAxiosPrivate();
    

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const getAllCustomers = async () => {
            try {
                const response = await axiosPrivate.get('/api/customers');
                setCustomers(response.data.customers);
            } catch (err) {
                console.log(err);
            }
        }
        getAllCustomers();
    }, [axiosPrivate]);

    const handleCustomerDelete = async id => {
        const isConfirmed = window.confirm('Are you sure that you want to delete this customer ?');

        if(isConfirmed) {
            // delete customer
            try {
                await axiosPrivate.delete(`/api/customers/${id}`);
                setCustomers(customers.filter(c => c.id !== id));
                toast.success('Customer Deleted');
            } catch (err) {
                console.log(err);
                toast.error(err.response.data?.message);
            }
        }
    }

    return (
        <div>

            <aside className='employeeList-header'>
                <h1>Customer Management</h1>
            </aside>

            <hr></hr>

            {customers.length > 0 && (
                    <Table striped bordered hover responsive >
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Username</th>
                                <th>Avatar</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Gender</th>
                                <th>Address</th>
                                <th>Street</th>
                                <th>City</th>
                                <th>Email</th>
                                <th>Phone No.</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(c => (
                                <tr key={c.id}>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{c.id}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{c.username}</p></td>
                                    <td>
                                        <div className='employeeList-row-avatar'>
                                            <img src={c.avatar} alt={c.username} />
                                        </div>
                                    </td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{c.firstName}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{c.lastName}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{c.gender}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{c.address}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{c.street}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{c.city}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{c.email}</p></td>
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}>{c.phone}</p></td>
                        
                                    <td><p className='d-flex align-items-center justify-content-center' style={{width: 'max-content'}}><span>{c.role}</span></p></td>
                                    <td>
                                        <div className='d-flex align-items-center gap-2'>
                                            {/* <button className='btn btn-sm btn-success'>Update</button> */}
                                            <button className='btn btn-sm btn-danger' onClick={() => handleCustomerDelete(c.id)}>Delete</button>
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

export default CustomerList;