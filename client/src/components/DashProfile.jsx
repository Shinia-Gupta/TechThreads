import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserThunk,
  setImageFileUrl,
  setImageUploadProgress,
  signoutUserThunk,
  updateUserThunk,
  uploadImageThunk,
  userSelector,
} from "../redux/reducers/userReducer";
import { toast } from "react-toastify";

import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
function DashProfile() {
  const { currentUser, error, imageFileUploadProgress, imageFileUrl, loading } =
    useSelector(userSelector);
  const [imageFile, setImageFile] = useState(null);
  const [prevFile, setPrevFile] = useState(null);
  const [noChange, setNoChange] = useState(null);
  const [message, setMessage] = useState(null);
  const [imageUpdating, setImageUpdating] = useState(false);
  const [prevImageFileUrl, setPrevImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageUpdating(true);
    const resultAction = await dispatch(uploadImageThunk({ imageFile }));
    if (uploadImageThunk.rejected.match(resultAction)) {
      setTimeout(() => {
        dispatch(setImageUploadProgress(null));
        setImageFile(prevFile);
        dispatch(setImageFileUrl(prevImageFileUrl));
      }, 5000);
    }
    if (uploadImageThunk.fulfilled.match(resultAction)) {
      setPrevFile(imageFile);
      setPrevImageFileUrl(resultAction.payload);
      setFormData({ ...formData, profilePicture: resultAction.payload });
      setTimeout(() => {
        dispatch(setImageUploadProgress(null));
      }, 5000);
    }
    setImageUpdating(false);
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      dispatch(setImageFileUrl(URL.createObjectURL(file)));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: imageFileUrl,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setNoChange("No updates to make!");
      setTimeout(() => {
        setNoChange(null);
      }, 5000);
      return;
    }
    const resultAction = await dispatch(updateUserThunk({ formData }));
    if (updateUserThunk.fulfilled.match(resultAction)) {
      setMessage("User's Profile updated successfully!");
      setFormData({});
    }
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    const resultAction = dispatch(deleteUserThunk(currentUser._id));
    if (deleteUserThunk.fulfilled.match(resultAction)) {
      navigate("/signin");
      toast.success(resultAction.payload);
    }
  };

  const handleSignout = () => {
    const resultAction = dispatch(signoutUserThunk());
    if (signoutUserThunk.fulfilled.match(resultAction)) {
      navigate("/signin");
      toast.success(resultAction.payload);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImgChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative"
          onClick={() => filePickerRef.current.click()}
        >
          {!error && imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199,${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
          disabled={imageUpdating || loading}
        >
          {loading ? "Loading..." : "Update Profile"}
        </Button>
        {currentUser?.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone={"purpleToPink"}
              outline
              className="w-full"
            >
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </span>
      </div>
      {(error || noChange) && (
        <Alert color="failure">{error || noChange}</Alert>
      )}
      {message && <Alert color="success">{message}</Alert>}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashProfile;
