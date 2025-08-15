import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";
import { serverUrl } from "../constant.js";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const currentUser = useSelector((state) => state.user?.currentUser);
  const loading = useSelector((state) => state.user?.loading);
  const error = useSelector((state) => state.user?.error);

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  // Trigger upload when file changes
  useEffect(() => {
    if (file) {
      handleFileupload(file);
    }
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleFileupload = (selectedFile) => {
    if (!selectedFile) return;

    const storage = getStorage(app);
    const fileName = new Date().getTime() + selectedFile.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error("Upload error:", error);
        setUploadError("Upload failed, please try again.");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Uploaded file URL:", downloadURL);
        setFormData((prev) => ({ ...prev, avatar: downloadURL }));
      }
    );
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?._id) {
      console.error("No user ID found. Aborting update request.");
      return;
    }

    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `${serverUrl}/api/user/update/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // send cookies with request
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      let data;
      try {
        data = await res.json(); // Try to parse JSON
      } catch {
        data = {}; // Fallback if no JSON body
      }

      if (!res.ok || data.success === false) {
        dispatch(deleteUserFailure(data.message || "Failed to delete user"));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch(`/api/auth/signout/`, {
        method: "GET", // your backend expects GET
        credentials: "include", // send cookies/session
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        next(error.message);
      }

      if (!res.ok || data.success === false) {
        dispatch(signOutUserFailure(data.message || "Sign out failed"));
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message || "Network error"));
    }
  };

  if (!currentUser) {
    return (
      <div className="p-3 max-w-lg mx-auto text-center">
        <h1 className="text-2xl font-semibold mt-10">Please sign in</h1>
      </div>
    );
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleFileChange}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={filePreview || currentUser?.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-4"
        />

        {uploadProgress > 0 && uploadProgress < 100 && (
          <p className="text-sm text-gray-500 text-center">
            Uploading: {uploadProgress}%
          </p>
        )}
        {uploadError && (
          <p className="text-sm text-red-500 text-center">{uploadError}</p>
        )}

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg bg-white"
          onChange={handleChange}
          id="username"
        />
        <input
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg bg-white"
          onChange={handleChange}
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg bg-white"
          onChange={handleChange}
          id="password"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 cursor-pointer disabled:opacity-80"
        >
          {loading ? `Loading...` : `Update`}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ``}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? `User is updated successfully!` : ``}
      </p>
    </div>
  );
}
