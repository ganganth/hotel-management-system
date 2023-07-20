import {Outlet, Navigate, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectAccessToken, selectAuthUser} from '../app/auth/authSlice';

const RequireAuth = ({allowedRoles}) => {

    const location = useLocation();

    const accessToken = useSelector(selectAccessToken);
    const authUser = useSelector(selectAuthUser);

    return (
        accessToken && authUser && allowedRoles.includes(authUser?.role)
            ? (<Outlet />) 
            : accessToken && authUser 
            ? (<Navigate to='/unauthorized' />) // navigate the user to unauthorized page
            : (<Navigate to='/login' state={{from: location}} replace />)
    );

}

export default RequireAuth;