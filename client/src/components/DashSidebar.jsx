import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutUserThunk, userSelector } from "../redux/reducers/userReducer";

function DashSidebar() {
  const location = useLocation();
  const { currentUser } = useSelector(userSelector);
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = () => {
    dispatch(signoutUserThunk());
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser.isAdmin && (
      <>
          <Link to="/dashboard?tab=dashboard">
            <Sidebar.Item
              as={"div"}
              active={tab === "dashboard"}
              icon={HiChartPie}
              labelColor="dark"
            >
              Dashboard
            </Sidebar.Item>
          </Link></>)}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              as={"div"}
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  as={"div"}
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  labelColor="dark"
                >
                  Posts
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  as={"div"}
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  labelColor="dark"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  as={"div"}
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  labelColor="dark"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
