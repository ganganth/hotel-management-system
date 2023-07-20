

import {MdExpandMore} from 'react-icons/md';
import {Badge} from 'react-bootstrap';
import { useState } from 'react';
import {useSelector} from 'react-redux';
import { selectAuthUser } from '../../../app/auth/authSlice';



const EventOrderItem = ({order, customer ,handleeventBookingDelete}) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const user = useSelector(selectAuthUser);

    


    return (
        <div className='mb-5 shadow'>
        <div className=" d-flex align-items-center px-4 py-3">
            <p style={{width: '18%', margin: 0}} className="d-flex flex-column gap-2" >
                <span style={{fontSize: '14px', fontWeight: 500}}>#Order ID</span>
                <span>{order.id}</span>
            </p>
            <p style={{width: '18%', margin: 0}} className="d-flex flex-column gap-2">
                <span style={{fontSize: '14px'}}>Created At</span>
                <span style={{fontSize: '12px'}}>{new Date(order.createdAt).toDateString()}</span>
            </p>
            <p style={{width: '18%', margin: 0}} className="d-flex flex-column gap-2">
                <span style={{fontSize: '14px'}}>Total Booked Events</span>
                <span>{order.totalNumOfEvents}</span>
                
            </p>
            <p style={{width: '18%', margin: 0}} className="d-flex flex-column gap-2">
                <span style={{fontSize: '14px'}}>Order Total (USD)</span>
                <span>${order.total}</span>
                
            </p>
            <p style={{width: '18%', margin: 0}} className="d-flex flex-column gap-2">
                <span style={{fontSize: '14px'}}>Paid Status</span>
                <span><Badge bg='success'>{order.isPaid}</Badge></span>
                
            </p>
            <p style={{width: '10%', margin: 0}}>
                <button style={{cursor: 'pinter', background: 'transparent', border: 'none'}} onClick={() => setIsExpanded(prev => !prev)} ><MdExpandMore size={25} /></button>
            </p>
            {user?.role !== 'Customer' && (
                <p style={{width: '10%', margin: 0}}>
                    <button className='btn btn-sm btn-danger'onClick={() => handleeventBookingDelete(order.id)} >Delete</button>
                </p>
            )}
        </div>
            {isExpanded && (
                <>
                    <div className='p-3'>
                        {order.items.map((item, index) => (

                            <div className='mb-3 d-flex align-items-start gap-5' key={index} >
                                <div>
                                    <img src={item.image} alt={item.eventId} width={150} height={100} style={{objectFit: 'cover'}} />
                                </div>
                                <div>
                                    <h4>{item.name}</h4>
                                    <Badge bg="info">{item.type} event</Badge>
                                    <p className='my-3'>Total people : {item.totalPeople}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {user?.role !== 'Customer' && (
                        <div className='p-3'>
                            <h3 className='my-3' style={{fontSize: '20px', fontWeight: 900}}>Customer Details</h3>
                                <div className='d-flex align-items-center justify-content-between p-3'>
                                    <div className='mb-3'>
                                        <img src={customer?.avatar} alt='avatar' style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%'}} />
                                    </div>
                                    <div className='mb-3'>
                                        <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer ID</label>
                                        <p><span className='bg-dark text-white px-3 py-1 rounded' style={{fontWeight: 500}}>{customer?.id}</span></p>
                                    </div>
                                    <div className='mb-3'>
                                        <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer Name</label>
                                        <p>{`${customer?.firstName} ${customer?.lastName}`}</p>
                                    </div>
                                    <div className='mb-3'>
                                        <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer Phone</label>
                                        <p>{customer?.phone}</p>
                                    </div>
                                    <div className='mb-3'>
                                        <label className="text-dark mb-1" style={{fontSize: '14px', fontWeight: 500}}>Customer Email</label>
                                        <p>{customer?.email}</p>
                                    </div>
                                    
                               
                                </div>
                        </div>
                    )}
                    
                </>
            )}
        
        </div>
    );
}

export default EventOrderItem;