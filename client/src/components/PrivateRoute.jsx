import React from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '../redux/reducers/userReducer'
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
    const {currentUser}=useSelector(userSelector);
    return currentUser?<Outlet/>:<Navigate to='/signin'/>
}

export default PrivateRoute
