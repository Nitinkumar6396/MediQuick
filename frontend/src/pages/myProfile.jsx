import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, fetchUserData, backendUrl } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const toggleEdit = () => setIsEdit((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setUserData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("address", JSON.stringify({
        line1: userData.address.line1,
        line2: userData.address.line2,
      }));

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message || "Profile updated");
      fetchUserData();
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return userData && (
    <div className="max-w-[35rem]">
      {
        isEdit ? (
          <label className="" htmlFor="image">
            <div className="inline-block cursor-pointer relative mb-4">
              <img className="w-36 rounded-lg opacity-70 border border-black" src={image ? URL.createObjectURL(image) : userData.image} alt="Profile Preview" />
              {!image && (
                <img
                  className="absolute bottom-12 right-12 w-10"
                  src={assets.upload_area}
                  alt="Upload Icon"
                />
              )}

            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>
        ) : (
          <img
            className="w-36 mb-4 bg-slate-200 rounded-lg"
            src={userData.image}
            alt="Profile"
          />
        )
      }

      {
        isEdit ? <input onChange={handleInputChange} type="text" name="name" value={userData.name}
        className="block text-xl font-medium border rounded px-2 py-1"/>
        : <p className="text-xl font-medium">{userData.name}</p>
      }
      <hr />
      <p className="my-4 underline text-gray-800">CONTACT INFORMATION</p>
      <div className="flex gap-14 text-sm text-gray-600">
        <div className="flex flex-col gap-1">
          <p>Phone:</p>
          <p>Address:</p>
        </div>
        <div className="flex flex-col gap-1">
          {isEdit ? (
            <>
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                className="border rounded px-2"
              />
              <input
                type="text"
                name="address.line1"
                value={userData.address?.line1 || ''}
                onChange={handleInputChange}
                className="border rounded px-2"
              />
              <input
                type="text"
                name="address.line2"
                value={userData.address?.line2 || ''}
                onChange={handleInputChange}
                className="border rounded px-2"
              />
            </>
          ) : (
            <>
              <p>{userData.phone}</p>
              <p>
                {userData.address.line1} <br />
                {userData.address.line2}
              </p>
            </>
          )}
        </div>
      </div>

      <p className="my-4 underline text-gray-800">BASIC INFORMATION</p>
      <div className="flex gap-14 text-gray-600">
        <div className="flex flex-col gap-1">
          <p>Gender:</p>
          <p>DOB:</p>
        </div>
        <div className="flex flex-col gap-1">
          {isEdit ? (
            <>
              <select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                className="border rounded px-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="date"
                name="dob"
                value={userData.dob}
                onChange={handleInputChange}
                className="border rounded px-2"
              />
            </>
          ) : (
            <>
              <p>{userData.gender}</p>
              <p>{userData.dob}</p>
            </>
          )}
        </div>
      </div>

      <button
        className="bg-primary mt-6 text-white text-sm px-10 py-2 rounded-full"
        onClick={(e) => {
          e.preventDefault();
          if (isEdit) {
            handleSave();
          } else {
            toggleEdit();
          }
        }}
        disabled={loading}
      >
        {loading ? "Saving..." : isEdit ? "Save" : "Edit"}
      </button>
    </div>
  );
};

export default MyProfile;
