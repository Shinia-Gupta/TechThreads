import React, { useEffect, useState } from 'react'
import {Sidebar} from 'flowbite-react';
import {HiUser,HiArrowSmRight, HiDocumentText} from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userSelector } from '../redux/reducers/userReducer';

function DashSidebar() {
    const location = useLocation();
    const {currentUser}=useSelector(userSelector)
    const [tab, setTab] = useState("");
  
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get("tab");
      // console.log(tabFromUrl);
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }, [location.search]);


    return (
     <Sidebar className='w-full md:w-56'>
<Sidebar.Items>
<Sidebar.ItemGroup className='flex flex-col gap-1'>
    <Link to='/dashboard?tab=profile'>
    <Sidebar.Item as={'div'} active={tab==='profile'} icon={HiUser} label={currentUser.isAdmin?'Admin':'User'}  labelColor='dark'>Profile</Sidebar.Item>
    </Link>
    {currentUser.isAdmin && (
      <Link to='/dashboard?tab=posts'>
      <Sidebar.Item as={'div'} active={tab==='posts'} icon={HiDocumentText} labelColor='dark'>Posts</Sidebar.Item>
      </Link>
    )}
    <Sidebar.Item  icon={HiArrowSmRight} className="cursor-pointer">Sign Out</Sidebar.Item>
</Sidebar.ItemGroup>

</Sidebar.Items>



     </Sidebar>   
    )
}

export default DashSidebar
