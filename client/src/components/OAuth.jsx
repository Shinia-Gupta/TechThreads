import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { signinWithGoogleThunk } from "../redux/reducers/userReducer";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const resultAction = await dispatch(signinWithGoogleThunk());
    if (signinWithGoogleThunk.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  return (
    <>
      <Button
        type="button"
        gradientDuoTone={"pinkToOrange"}
        outline
        onClick={handleGoogleClick}
      >
        <AiFillGoogleCircle className="w-6 h-6 mr-2" />
        Continue With Google
      </Button>
    </>
  );
}

export default OAuth;
