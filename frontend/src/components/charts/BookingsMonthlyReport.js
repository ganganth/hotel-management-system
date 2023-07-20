import {useState, useEffect} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
       
      return (
        <div className="shadow bg-white border-0 p-3">
            <p className='m-0 text-center mb-2' style={{fontSize: '12px', fontWeight: 500}}>{label} Report</p>
            <div className='d-flex align-items-center gap-2 mb-1' >
                <label style={{fontSize: '12px'}}>Total bookings : </label>
                <span style={{fontSize: '12px', fontWeight: 500}}>{payload[0].value}</span>
            </div>
            <div className='d-flex align-items-center gap-2' >
                <label style={{fontSize: '12px'}}>Total revenue : </label>
                <span style={{fontSize: '12px', fontWeight: 500}}>${payload[0].payload.revenue.toFixed(2)}</span>
            </div>
          {/* <p className="label">{`${label} : ${payload[0].value}`}</p>
          <p className="intro">{getIntroOfPage(label)}</p> */}
          {/* <p className="desc">Anything you want can be displayed here.</p> */}
        </div>
      );
    }
  
    return null;
};

const BookingsMonthlyReport = () => {

    const axiosPrivate = useAxiosPrivate();

    const [data, setData] = useState([]);

    useEffect(() => {
        const getMonthlyBookingData = async () => {
            try {
                const response = await axiosPrivate.get('/api/rooms/bookings/monthly-report');
                setData(response.data.data);
            } catch (err) {
                console.log(err);
            }
        }
        getMonthlyBookingData();
    }, [axiosPrivate]);

    return (
        <div className="my-5 mx-auto" style={{width: '80%', height: 'max-content'}}>
            <h2 className="mb-5 text-center" style={{fontSize: '25px'}}>Monthly Bookings & Revenue</h2>

            <div style={{width: '100%', height: '450px'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="monthName" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="totalBookings" fill="#333" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default BookingsMonthlyReport;