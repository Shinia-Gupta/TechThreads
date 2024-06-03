import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePostThunk,
  postSelector,
  setImageUploadProgress,
  uploadPostImageThunk,
  getAPostThunk,
} from "../redux/reducers/postReducer";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import sanitizeHtml from "sanitize-html";

function UpdatePost() {
  const { imageFileUploadProgress, error } = useSelector(postSelector);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});

  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setUploadError(null);
    }, 4000);
  }, [uploadError]);

  useEffect(() => {
    getPostToUpdate();
  }, [postId]);

  const handleUploadImage = async () => {
    if (!file) {
      setUploadError("Please provide an image! ");
      return;
    }
    setImageFileUploading(true);
    const resultAction = await dispatch(
      uploadPostImageThunk({ imageFile: file })
    );
    if (uploadPostImageThunk.rejected.match(resultAction)) {
      setTimeout(() => {
        dispatch(setImageUploadProgress(null));
        setFile(null);
        // dispatch(setImageFileUrl(prevImageFileUrl));
      }, 5000);
    }
    if (uploadPostImageThunk.fulfilled.match(resultAction)) {
      setFormData({ ...formData, image: resultAction.payload });
      setTimeout(() => {
        dispatch(setImageUploadProgress(null));
      }, 5000);
    }
    setImageFileUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedContent = sanitizeHtml(formData.content, {
      allowedTags: [],
    }).trim();

    if (sanitizedContent.length === 0) {
      setPublishError("Content cannot be empty or only spaces.");
      return;
    }

    const resultAction = await dispatch(updatePostThunk({ formData,postId }));
    if (
      updatePostThunk.rejected.match(resultAction) &&
      !resultAction.payload.success
    ) {
      setPublishError(resultAction.payload.message);
    }
    if (updatePostThunk.fulfilled.match(resultAction)) {
      setPublishError(null);
      navigate(`/post/${resultAction.payload.slug}`);
    }
  };

  const getPostToUpdate = async () => {
    const resultAction = await dispatch(getAPostThunk(postId));
    if (getAPostThunk.fulfilled.match(resultAction)) {
      setFormData(resultAction.payload.posts[0]);
    }
  };

  return (
    <>
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              value={formData.title}
            />
            <Select
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              value={formData.category}
            >
              <option value="uncategorized">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nodejs">Node.js</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleUploadImage}
              disabled={imageFileUploading}
            >
              {imageFileUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageFileUploadProgress}
                    text={`${imageFileUploadProgress} %`}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>
          {(error || uploadError) && (
            <Alert color="failure">{error || uploadError}</Alert>
          )}
          {formData.image && (
            <img
              src={formData.image}
              alt="upload"
              className="w-full h-72 object-cover"
            />
          )}
          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="h-72 mb-12"
            required
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}
            value={formData.content}
           
          />

          <Button
            type="submit"
            gradientDuoTone="purpleToPink"
            disabled={imageFileUploading}
          >
            Update Post
          </Button>
          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
        </form>
      </div>
    </>
  );
}

export default UpdatePost;
