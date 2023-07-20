
import {Link} from 'react-router-dom';

import '../styles/landing.css';

const Public = () => {


    return (
        <div className='landingPage'>
            <div className='landingPage-content-wrapper'>
                <div className='landingPage-content'>
                    <h1 className='landingPage-content-title'>Enjoy Your <br></br> Dream Vaccation</h1>
                    <p className='landingPage-content-desc'>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary</p>
                    <div className='d-flex align-items-center gap-4'>
                        <Link to='/login' className="landingPage-content-btn">Login</Link>
                        <Link to='/register' className="landingPage-content-btn">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Public;