import {Outlet} from 'react-router-dom';


import Sidebar from './Sidebar';

import '../styles/dash-layout.css';

const DashLayout = () => {

    return (
        <div className='dash-layout'>
            <Sidebar />
            {/* <header>
                <button onClick={() => dispatch(logoutAuthUser())}>Logout</button>
            </header> */}
            <div className='dash-layout-content'>
                <div className='dash-layout-content-wrapper'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default DashLayout;