import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineUserGroup,
  HiAnnotation,
  HiDocumentText,
} from "react-icons/hi";
import {
  userSelector,
  fetchUsersForDashThunk,
} from "../redux/reducers/userReducer";
import {
  fetchPostsForDashThunk,
  postSelector,
} from "../redux/reducers/postReducer";
import {
  commentSelector,
  fetchCommentsForDashThunk,
} from "../redux/reducers/commentReducer";
import DashCard from "./DashCard";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

function DashboardComponent() {
  const { totalUsers, lastMonthUsers, currentUser, allUsers } =
    useSelector(userSelector);
  const { totalPosts, lastMonthPosts, userPosts } = useSelector(postSelector);
  const { totalComments, lastMonthComments, comments } =
    useSelector(commentSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.isAdmin) {
      dispatch(fetchPostsForDashThunk());
      dispatch(fetchUsersForDashThunk());
      dispatch(fetchCommentsForDashThunk());
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <DashCard
          heading={"Total Users"}
          classStyle={{ bg: "bg-teal-600", textColor: "text-green-500" }}
          totalCount={totalUsers}
          lastMonthCount={lastMonthUsers}
          icon={HiOutlineUserGroup}
        />

        <DashCard
          heading={"Total Posts"}
          classStyle={{ bg: "bg-indigo-600", textColor: "text-green-500" }}
          totalCount={totalPosts}
          lastMonthCount={lastMonthPosts}
          icon={HiDocumentText}
        />

        <DashCard
          heading={"Total Comments"}
          classStyle={{ bg: "bg-lime-600", textColor: "text-green-500" }}
          totalCount={totalComments}
          lastMonthCount={lastMonthComments}
          icon={HiAnnotation}
        />
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {allUsers &&
              allUsers.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {userPosts &&
              userPosts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt="user"
                        className="w-14 h-10 rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">{post.title}</Table.Cell>
                    <Table.Cell className="w-5">{post.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}

export default DashboardComponent;
