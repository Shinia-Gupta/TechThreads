import React from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '../redux/reducers/userReducer'
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({isAdmin}) {
    const {currentUser}=useSelector(userSelector);
    if(!isAdmin)
    return currentUser?<Outlet/>:<Navigate to='/signin'/>

    return currentUser.isAdmin?<Outlet/>:<Navigate to='/signin'/>
    
}

export default PrivateRoute
